import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.resolve(__dirname, '../docs/public/images')

async function optimizeImages() {
  const sharp = (await import('sharp')).default
  const files = fs.readdirSync(imagesDir)

  let optimized = 0
  let skipped = 0

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      skipped++
      continue
    }

    const inputPath = path.join(imagesDir, file)
    const outputPath = path.join(imagesDir, `${path.basename(file, ext)}.webp`)

    // 跳过已存在的 WebP
    if (fs.existsSync(outputPath)) {
      skipped++
      continue
    }

    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)

      optimized++
      console.log(`✓ ${file} → ${path.basename(outputPath)}`)
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`)
    }
  }

  console.log(`\nDone: ${optimized} optimized, ${skipped} skipped`)
}

optimizeImages()