import { Worker } from './Worker'
import path from 'path'

export class Helpers {
   static FFMPEG = '/usr/bin/ffmpeg'

   /**
    * Generate a thubnail from a video file at given frame position
    * @param videoPath path to video file
    * @param frame frame to extract thumbnail from
    * @param width width of thumbnail (4/3 ratio)
    * @returns
    */
   static generateVideoThumbnail = async (
      videoPath: string,
      outputPath: string,
      frame: number = 0,
      width: number = 320
   ) => {
      const resolution = `${width}x${Math.ceil(width * 0.75)}`
      const ffmpegParams = [
         '-i',
         videoPath,
         '-vframes',
         '1',
         '-vf',
         String.raw`select=gte(n\,${frame})`,
         '-s',
         resolution,
         '-ss',
         '1',
         outputPath,
         '-y',
      ]

      Worker.info(`Generating Thumbnail : ${outputPath}`)

      return await Worker.execPromise(Helpers.FFMPEG, ffmpegParams)
   }
}
