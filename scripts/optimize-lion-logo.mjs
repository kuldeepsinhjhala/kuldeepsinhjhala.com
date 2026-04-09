import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
// Keep full-resolution source outside src/assets so resolveJourneyLogo's eager glob does not bundle ~628 KiB into dist.
const src = path.join(root, 'scripts', 'source', 'Lion logo.png')
const outHero = path.join(root, 'src', 'assets', 'lion-logo-hero.png')
const outSm = path.join(root, 'src', 'assets', 'lion-logo-sm.png')
const outFavicon = path.join(root, 'public', 'favicon.png')

async function main() {
  const buf = await fs.readFile(src)
  const meta = await sharp(buf).metadata()
  const w = meta.width ?? 1021
  const h = meta.height ?? 991

  await sharp(buf)
    .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outHero)

  await sharp(buf)
    .resize(128, 128, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outSm)

  await sharp(buf)
    .resize(32, 32, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(outFavicon)

  const [heroMeta, smMeta] = await Promise.all([
    sharp(await fs.readFile(outHero)).metadata(),
    sharp(await fs.readFile(outSm)).metadata(),
  ])

  console.log('Source:', w, 'x', h)
  console.log('lion-logo-hero.png:', heroMeta.width, 'x', heroMeta.height)
  console.log('lion-logo-sm.png:', smMeta.width, 'x', smMeta.height)
  console.log('public/favicon.png: 32 x 32')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
