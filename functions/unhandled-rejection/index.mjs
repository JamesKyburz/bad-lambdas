import { setTimeout } from 'node:timers/promises'
import crypto from 'node:crypto'

const id = crypto.randomUUID()

/**
 * @param {any} payload
 * @param {import('aws-lambda').Context} context
 * @returns {Promise<any>}
 */
export async function failAfter0(payload, context) {
  fail(0)
  return {
    id,
    payload,
    logStreamName: context.logStreamName,
  }
}

/**
 * @param {any} payload
 * @param {import('aws-lambda').Context} context
 * @returns {Promise<any>}
 */

export async function failAfter5(payload, context) {
  fail(5000)
  return {
    id,
    payload,
    logStreamName: context.logStreamName,
  }
}

/*
 * @param {Number} n
 * @returns {Promise<void>}
 **/
async function fail(n) {
  await setTimeout(n)
  throw new Error('uncaught error!')
}
