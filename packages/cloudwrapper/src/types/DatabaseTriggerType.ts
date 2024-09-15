import { BackendAction } from '@quatrain/backend'

export type DatabaseTriggerType = {
   name: string
   event: BackendAction
   model: string
   path: string
   script: Function
}
