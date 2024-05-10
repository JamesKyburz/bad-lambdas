import process from 'node:process'
import crypto from 'node:crypto'
import { readdirSync } from 'node:fs'
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi'

const id = crypto.randomUUID()

/**
 * @param {any} _
 * @param {import('aws-lambda').Context} context
 * @returns {Promise<any>}
 */
export async function leak1(_, context) {
  await leakFileDescriptors(1)
  return {
    id,
    fileDescriptorCount: readdirSync('/proc/self/fd').length,
    logStreamName: context.logStreamName,
  }
}

/**
 * @param {any} _
 * @param {import('aws-lambda').Context} context
 * @returns {Promise<any>}
 */
export async function leak100(_, context) {
  await leakFileDescriptors(100)
  return {
    id,
    fileDescriptorCount: readdirSync('/proc/self/fd').length,
    logStreamName: context.logStreamName,
  }
}
async function leakFileDescriptors(n) {
  await Promise.allSettled([...Array(n)].map(async function leakFileDescriptor() {
    // We should only create aws sdk clients outside handler functions
    const client = new ApiGatewayManagementApiClient({
      apiVersion: '2018-11-29',
      endpoint: `https://${process.env.API_ID}.execute-api.us-east-1.amazonaws.com/dev`,
    })
    await client.send(
      new PostToConnectionCommand({
        ConnectionId: crypto.randomUUID(),
        Data: 'test',
      }),
    )
  }))
}
