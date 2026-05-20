import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot,
} from "firebase/storage"
import { storage } from "./firebase"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Attachment {
  name:       string // original filename
  url:        string // public download URL
  path:       string // Storage path (for deletion)
  type:       string // MIME type
  size:       number // bytes
  uploadedAt: string // ISO string
}

export interface UploadProgress {
  file:     File
  progress: number   // 0-100
  done:     boolean
  error:    string | null
  url:      string | null
  path:     string | null
}

// ─── Validation ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]

const MAX_SIZE_BYTES = 15 * 1024 * 1024 // 15 MB

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Tipo no permitido: ${file.type}. Solo JPG, PNG, WEBP, GIF y PDF.`
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `El archivo "${file.name}" supera el límite de 15 MB.`
  }
  return null
}

export function isImage(type: string): boolean {
  return type.startsWith("image/")
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Unique filename generator ────────────────────────────────────────────────

function generateStorageName(file: File): string {
  const timestamp = Date.now()
  const random    = Math.random().toString(36).slice(2, 8)
  const ext       = file.name.split(".").pop() ?? "bin"
  // sanitise the original name (max 40 chars, no spaces)
  const base      = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40)
  return `${timestamp}_${random}_${base}.${ext}`
}

// ─── Upload single file with progress ─────────────────────────────────────────

/**
 * Uploads a single file to Storage under shipments/{shipmentId}/files/
 * Calls onProgress(0-100) during upload.
 * Resolves with an Attachment object on completion.
 */
export function uploadShipmentFile(
  shipmentId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const filename    = generateStorageName(file)
    const storagePath = `shipments/${shipmentId}/files/${filename}`
    const fileRef     = ref(storage, storagePath)

    const task = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    })

    task.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        onProgress?.(pct)
      },
      (error) => reject(error),
      async () => {
        try {
          const url: string = await getDownloadURL(task.snapshot.ref)
          const attachment: Attachment = {
            name:       file.name,
            url,
            path:       storagePath,
            type:       file.type,
            size:       file.size,
            uploadedAt: new Date().toISOString(),
          }
          resolve(attachment)
        } catch (err) {
          reject(err)
        }
      }
    )
  })
}

/**
 * Uploads multiple files in parallel, with per-file progress tracking.
 * Returns the array of Attachment objects for all successfully uploaded files.
 */
export async function uploadShipmentFiles(
  shipmentId: string,
  files: File[],
  onFileProgress?: (index: number, pct: number) => void
): Promise<Attachment[]> {
  const results = await Promise.allSettled(
    files.map((file, i) =>
      uploadShipmentFile(
        shipmentId,
        file,
        (pct) => onFileProgress?.(i, pct)
      )
    )
  )

  const attachments: Attachment[] = []
  for (const result of results) {
    if (result.status === "fulfilled") {
      attachments.push(result.value)
    }
    // silently skip failed uploads — caller can handle via count mismatch
  }
  return attachments
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes a file from Storage by its storage path.
 */
export async function deleteStorageFile(path: string): Promise<void> {
  const fileRef = ref(storage, path)
  await deleteObject(fileRef)
}
