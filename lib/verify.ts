import crypto from "crypto"
import sharp from "sharp"

export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex")
}

export function verifyQr(secretInput: string, storedHexHash?: string | null) {
  if (!storedHexHash) return true // QR not required
  const inputHash = sha256Hex(secretInput)
  return crypto.timingSafeEqual(Buffer.from(inputHash, "hex"), Buffer.from(storedHexHash, "hex"))
}

export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const lat1 = toRad(aLat)
  const lat2 = toRad(bLat)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function verifyGeo(
  userLat?: number | null,
  userLng?: number | null,
  centerLat?: number | null,
  centerLng?: number | null,
  radiusM?: number | null,
) {
  if (!centerLat || !centerLng || !radiusM || radiusM <= 0) return true
  if (userLat == null || userLng == null) return false
  const d = distanceMeters(userLat, userLng, centerLat, centerLng)
  return d <= radiusM
}

// Simple pHash using DCT approximation via sharp resize + grayscale
export async function computePhashHexFromUrl(imageUrl: string) {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error("Failed to fetch image for hashing")
  const buf = Buffer.from(await res.arrayBuffer())
  const img = sharp(buf).grayscale().resize(32, 32, { fit: "fill" })
  const raw = await img.raw().toBuffer() // 32*32 grayscale
  // Compute average
  let sum = 0
  for (let i = 0; i < raw.length; i++) sum += raw[i]
  const avg = sum / raw.length
  // Build 64-bit hash by sampling 8x8 from center (skip DCT for MVP)
  let bits = ""
  const size = 32
  const start = 12
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const idx = (start + y) * size + (start + x)
      bits += raw[idx] > avg ? "1" : "0"
    }
  }
  // convert to hex
  let hex = ""
  for (let i = 0; i < 64; i += 4) {
    const nibble = Number.parseInt(bits.slice(i, i + 4), 2)
    hex += nibble.toString(16)
  }
  return hex
}

export function hammingDistanceHex(a: string, b: string) {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    const x = Number.parseInt(a[i], 16) ^ Number.parseInt(b[i], 16)
    dist += popcnt4(x)
  }
  return dist
}

function popcnt4(x: number) {
  const bits = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]
  return bits[x & 0xf]
}
