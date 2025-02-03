import { GenericTriggerType } from './GenericTriggerType'

export interface DatabaseTriggerType extends GenericTriggerType {
   schema?: string
   model: string
   path: string
}
