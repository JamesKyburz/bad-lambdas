import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'

export async function handler() {
  // random 100mb file
  await writeFile(path.join(os.tmpdir(), crypto.randomUUID()), crypto.randomBytes(100 * 1024 * 1024))
}
