import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { Core } from '@quatrain/core'
import { AbstractQueueAdapter, QueueParameters } from '@quatrain/queue'

export class SqsQueueAdapter extends AbstractQueueAdapter {
   constructor(params: QueueParameters) {
      super(params)
      const { accesskey, secret, region } = params.config || {}

      this._client = new SQSClient({
         region,
         credentials: {
            accessKeyId: accesskey,
            secretAccessKey: secret,
         },
      })
   }

   async send(data: any, topic: string): Promise<string> {
      const params = {
         DelaySeconds: 10,
         MessageBody: JSON.stringify(data),
         QueueUrl: `https://sqs.${this._params.config.region}.amazonaws.com/${this._params.config.accountid}/${topic}`,
      }

      Core.log(`[SQS] Sending message to ${params.QueueUrl}`)
      const command = new SendMessageCommand(params)
      const response = await this._client.send(command)

      return response.MessageId
   }
}
