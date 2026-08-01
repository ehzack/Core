import { CollectionProperty } from '@quatrain/backend'
import { MdmNature } from './enums/MdmEnums'

export { MdmNature }

/**
 * Definition of an MDM Object Type / Archetype in the Registry
 */
export interface MdmObjectTypeDefinition {
   /** Unique archetype identifier (e.g. 'device', 'keychain', 'connectivity_service') */
   archetypeId: string
   /** Human-readable title */
   name: string
   /** Nature classification */
   nature: MdmNature | string
   /** Primary collection name (e.g. 'mdm.physical_units', 'mdm.virtual_keychains') */
   collection: string
   /** Property definitions compatible with Quatrain PersistedBaseObject / CollectionProperty */
   properties?: CollectionProperty[]
   /** Optional traits schema definition */
   traitsSchema?: Record<string, unknown>
}
