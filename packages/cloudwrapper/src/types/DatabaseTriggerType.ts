import { BackendAction } from '@quatrain/backend'

export type DatabaseTriggerType = {
   name: string
   event: BackendAction | BackendAction[]
   schema?: string
   model: string
   path: string
   script: Function
}
