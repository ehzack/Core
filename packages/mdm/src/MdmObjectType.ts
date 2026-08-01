import { CollectionProperty } from '@quatrain/backend'

/**
 * MDM Object Nature
 * - 'physical': Hardware assets, devices, components, enclosures, PCBs.
 * - 'virtual': Digital access keychains, tokens, credentials, licenses.
 * - 'service': Connectivity plans, airtime passes, maintenance, SLA contracts.
 * - 'composite': Bundled physical + virtual + service objects.
 */
export type MdmNature = 'physical' | 'virtual' | 'service' | 'composite' | string

/**
 * Definition of an MDM Object Type / Archetype in the Registry
 */
export interface MdmObjectTypeDefinition {
   /** Unique archetype identifier (e.g. 'device', 'keychain', 'connectivity_service') */
   archetypeId: string
   /** Human-readable title */
   name: string
   /** Nature classification */
   nature: MdmNature
   /** Primary collection name (e.g. 'mdm.physical_units', 'mdm.virtual_keychains') */
   collection: string
   /** Property definitions compatible with Quatrain PersistedBaseObject / CollectionProperty */
   properties?: CollectionProperty[]
   /** Optional traits schema definition */
   traitsSchema?: Record<string, unknown>
}
