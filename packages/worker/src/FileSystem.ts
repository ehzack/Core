import fs from 'fs'
import path from 'path'
import axios from 'axios'
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

   static removeFolder(folder: string, recursively = true) {
      if (fs.existsSync(folder)) {
         fs.readdirSync(folder).forEach((element) => {
            const item = path.join(folder, element)
            if (fs.lstatSync(item).isDirectory()) {
               if (recursively !== true) {
                  throw new Error(`Folder contains folder`)
               }
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
            const { size } = fs.statSync(filename)
            const bufferContent = fs.readFileSync(filename)
            fetch(destination, {
               method: 'POST',
               mode: 'cors',
               headers: {
                  'Content-Type': mime,
                  'Content-length': String(size),
               },
               body: bufferContent,
            })
               .then(() => resolve(undefined))
               .catch((err) => reject(err))
         } catch (err: any) {
            reject(err as Error)
         }
      })
   }
}
