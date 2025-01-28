import { BackendAction } from '@quatrain/backend'

export type DatabaseTriggerType = {
   name: string
   event: BackendAction | BackendAction[]
   model: string
   path: string
   script: Function
}
