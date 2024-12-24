import { Core } from '@quatrain/core'
import os from 'os'
import axios from 'axios'
import { spawn } from 'child_process'

export class Worker extends Core {
   static endpoint: string = ''

   /**
    * Execute an external command in a promise
    * @see https://stackoverflow.com/questions/46289682/how-to-wait-for-child-process-spawn-execution-with-async-await
    * @see https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
    * @param string command
    * @param array args
    * @return Promise
    */
   static execPromise = (
      command: string,
      args: any[] = [],
      cwd = process.cwd()
   ): Promise<any> => {
      Worker.log(`Executing command ${command} in ${cwd} with arguments:`)
      args.forEach((arg) => console.log(`\t${arg}`))
      return new Promise((resolve, reject) => {
         const child = spawn(command, args, { cwd })

         child.stdout.on('data', (data) => {
            console.info(`stdout: ${data}`)
         })

         child.stderr.on('data', (data) => {
            console.info(`stderr: ${data}`)
         })

         child.on('close', (code) => {
            if (code !== 0) {
               console.error(`Command execution failed with code: ${code}`)
               reject(code)
            } else {
               console.info(`Command execution completed with code: ${code}`)
               resolve(undefined)
            }
         })
      })
   }

   static pushEvent(event: string, data = {}, ts = 0) {
      if (!this.endpoint) {
         Worker.log(`Events endpoint is not set, can't send update!`)
         return false
      }

      ts = ts === Date.now() ? Date.now() + 1 : Date.now()
      const payload = {
         event,
         worker: `Container ${os.hostname}`,
         os: `${os.type} ${os.release} (${os.platform} ${os.arch})`,
         ...data,
         ts,
      }

      axios
         .put(Worker.endpoint, payload)
         .then((res) =>
            Worker.log(`Event pushed to backend: ${res.statusText}`)
         )
         .catch((err) => Worker.log(`Failed to push event to backend: ${err}`))
   }
}
