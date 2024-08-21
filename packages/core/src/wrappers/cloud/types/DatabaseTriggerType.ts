import { BackendAction } from '../../../Backend'

export type DatabaseTriggerType = {
   name: string
   event: BackendAction
   model: string
   path: string
   script: Function
}
