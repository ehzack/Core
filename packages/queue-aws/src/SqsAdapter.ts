import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { Queue, AbstractQueueAdapter, QueueParameters } from '@quatrain/queue'

export class SqsAdapter extends AbstractQueueAdapter {
   constructor(params: QueueParameters) {
      super(params)
      const {
         accesskey = '',
         secret = '',
         region = 'eu-central-1',
         accountid = '',
      } = params.config || {}

      if (!accesskey || !secret || !region || !accountid) {
         throw new Error(
            `Missing required parameters for SQS: accesskey, secret, region, accountid`
         )
      }

      this._client = new SQSClient({
         region,
         credentials: {
            accessKeyId: `${accesskey}`,
            secretAccessKey: `${secret}`,
         },
      })
   }

   async send(data: any, topic: string): Promise<string> {
      const params = {
         DelaySeconds: 10,
         MessageBody: JSON.stringify(data),
         QueueUrl: `https://sqs.${`${this._params?.config?.region}`}.amazonaws.com/${`${this._params?.config?.accountid}`}/${`${topic}`}`,
      }

      Queue.debug(`[SQS] Sending message to ${params.QueueUrl}`)
      const command = new SendMessageCommand(params)
      const response = await this._client.send(command)

      return response.MessageId
   }

   /**
    * Listen to a topic
    * @param topic
    */
   listen(topic: string) {
      throw new Error(`Unavailable method on this adapter`)
   }
}
