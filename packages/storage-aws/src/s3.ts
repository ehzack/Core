import { FileType, FileResponseUrl } from '@quatrain/core'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
   S3Client,
   PutObjectCommand,
   GetObjectCommand,
   DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Storage } from '@google-cloud/storage'
import { Readable } from 'stream'

const functions = require('firebase-functions')

const {
   accesskey,
   secret,
   s3: { bucket, region },
} = functions.config().aws || {}

export const s3Bucket = bucket

const config = {
   region,
   credentials: {
      accessKeyId: accesskey,
      secretAccessKey: secret,
   },
}

export const s3Client = new S3Client(config)

/**
 * Move file to AWS
 * @param gcsFrom source file metadata
 * @param awsTo destination file metadata
 * @returns destination bucket name
 */

export const moveFile = async (
   gcsFrom: FileType,
   awsTo: FileType
): Promise<string> => {
   const storage = new Storage()
   const fileRef = storage.bucket(gcsFrom.bucket).file(gcsFrom.ref)
   const fileStream = fileRef.createReadStream()

   if (!gcsFrom.size || gcsFrom.contentType) {
      const metadata = (await fileRef.getMetadata())[0]
      gcsFrom.size = metadata.size
      gcsFrom.contentType = metadata.contentType
   }

   const input = {
      Bucket: awsTo.bucket,
      Key: awsTo.ref,
      Body: fileStream,
      ContentType: gcsFrom.contentType,
      ContentLength: gcsFrom.size,
   }

   console.log(`Moving ${gcsFrom.ref} from GCP to ${awsTo.ref} at AWS`)
   const command = new PutObjectCommand(input)

   await s3Client.send(command)

   return awsTo.bucket
}

/**
 * Returns a temporary public url matching the provided metadata
 * @param file
 * @returns
 */
export const getPublicUrl = async (
   file: FileType,
   expiresIn: number = 3600
): Promise<FileResponseUrl> => {
   const command = new GetObjectCommand({ Bucket: file.bucket, Key: file.ref })
   const url = await getSignedUrl(s3Client, command, { expiresIn })
   return { url, expiresIn }
}

/**
 * Delete the file matching the provided metadata
 * @param file
 * @returns
 */
export const deleteFile = async (file: FileType) => {
   const command = new DeleteObjectCommand({
      Bucket: file.bucket,
      Key: file.ref,
   })

   const data = await s3Client.send(command)
   console.log('Success. Object deleted.', data)

   return data
}

export const streamFile = async (file: FileType, res: any) => {
   const command = new GetObjectCommand({ Bucket: file.bucket, Key: file.ref })
   const item = await s3Client.send(command)
   const ByteArray: any = await item.Body?.transformToByteArray()
   const buffer = Buffer.from(ByteArray, 'base64')
   const readable = new Readable()
   readable.push(buffer)
   readable.push(null)
   return readable.pipe(res)
}
