import { Worker } from './Worker'

export const handler = async (
   messageHandler: Function,
   config: any,
   adapters: any
) => {
   try {
      Worker.info(
         `Worker version ${require('../package.json').version} started in ${
            config.MQ_MODE
         } mode`
      )
      switch (config.MQ_MODE) {
         case 'queue':
            const { Queue } = require('@quatrain/queue')
            Queue.addQueue(adapters.queue, 'default', true)
            Queue.info(
               `Connecting to amqp://${config.MQ_HOST}:${config.MQ_PORT}`
            )
            Queue.getQueue().listen(config.MQ_TOPIC, messageHandler, {
               concurrency: config.MQ_CONCURRENCY,
               gpu: config.MQ_GPU,
            })
            break

         case 'cli':
         case 'test':
            Worker.warn(`Message received from CLI.`)
            const json =
               config.MQ_MODE === 'test'
                  ? require('../test.json')
                  : process.env.JSON

            if (!json) {
               throw new Error(`CLI call with missing environment variables`)
            }

            await messageHandler(json)
            break

         default:
            Worker.error(`Unknown mode option: '${config.MQ_MODE}'`)
            process.exit(1)
      }
   } catch (error) {
      Worker.error((error as Error).message)
      process.exit(1)
   }
}
