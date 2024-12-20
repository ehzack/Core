import fs from 'fs'
import path from 'path'
import axios from 'axios'
import fetch, { Response } from "node-fetch"
import { Worker } from './Worker'

export class FileSystem {

   static prepare(folder: string) {
      Worker.log(`Setting up process folder ${folder}`)
      this.removeFolder(folder)

      fs.mkdirSync(folder)
      fs.mkdirSync(folder + path.sep + 'images')
      fs.mkdirSync(folder + path.sep + 'vecto')
   }

   static makeFolder(folder: string) {
      fs.mkdirSync(folder)
   }

   static removeFolder(folder: string) {
      if (fs.existsSync(folder)) {
         fs.readdirSync(folder).forEach((element) => {
            const item = path.join(folder, element)
            if (fs.lstatSync(item).isDirectory()) {
               this.removeFolder(item)
            } else {
               fs.unlinkSync(item)
            }
         })

         fs.rmdirSync(folder)
      }
   }

   static async downloadFile(url: string, filepath: string) {
      try {
         const writer = fs.createWriteStream(filepath)
         const response = await axios.get(url, {
            responseType: 'stream',
         })

         response.data.pipe(writer)

         return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
         })
      } catch (error) {
         console.error(`Download error: ${(error as Error).message}`)
         throw error
      }
   }

   static safeString(name: string) {
      return name.replace(/\s+/g, '_')
   }

   static uploadFile(
      filename: string,
      destination: string,
      mime: string = 'application/octet-stream'
   ) {
      return new Promise((resolve, reject) => {
         try {
            // init upload, Google sends a new url
            fetch(destination, {
               method: 'POST',
               //mode: 'cors',
               headers: {
                  'Content-Type': mime,
                  'X-Goog-Resumable': 'start',
               },
            })
               .then((res: Response) => {
                  if (res.ok) {
                     let done = 0 // total bytes uploaded
                     let prev = 0 // latest value of done stored when % done was displayed
                     const { size } = fs.statSync(filename)
                     const readStream = fs.createReadStream(filename)
                     const sizeMB = size / (1024 * 1024)

                     readStream.on('data', (data) => {
                        done += data.length
                        if (done - prev >= size / 20) {
                           // only display message when 5% more has been uploaded
                           Worker.log(
                              `${(done / size) * 100}% - ${
                                 done / (1024 * 1024)
                              }MB / ${sizeMB}MB`
                           )
                           prev = done
                        }
                     })

                     Worker.log(
                        `Uploading file ${filename} with size ${size} bytes`
                     )
                     const url = res.headers.get('location') || ''
                     fetch(url, {
                        method: 'PUT',
                        //mode: 'cors',
                        body: readStream,
                        headers: {
                           'Content-Type': mime,
                           'Content-length': String(size),
                        },
                     })
                        .then(() => resolve(undefined))
                        .catch((err) => reject(err))
                  } else {
                     Worker.log(res)
                     reject(new Error('Unable to init upload'))
                  }
               })
               .catch((err) => reject(err))
         } catch (err) {
            reject(err)
         }
      })
   }
}
