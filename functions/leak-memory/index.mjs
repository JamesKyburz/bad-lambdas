import crypto from 'node:crypto'
import process from 'node:process'

export async function handler() {
  for (let i=0; i< 500_000; i++) {
    Symbol.for(crypto.randomUUID())
  }
  const used = process.memoryUsage().heapUsed / 1024 / 1024
  return {
    usedMB: Math.floor(used)
  }
}
