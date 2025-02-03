import { BackendAction } from '@quatrain/backend'

export type GenericTriggerType = {
   name: string
   event: BackendAction | BackendAction[]
   script: Function
}
