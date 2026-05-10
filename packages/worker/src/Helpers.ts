import { Worker } from './Worker'
import path from 'node:path'

/**
 * General utility class providing common static helpers for workers.
 */
export class Helpers {
   /** Default absolute path to the system's FFmpeg binary. */
   static FFMPEG = Worker.getSystemCommandPath('ffmpeg')

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

      return await Worker.execPromise(await Helpers.FFMPEG, ffmpegParams)
   }
}
