import { MdmNature } from './enums/MdmEnums'

/**
 * Specification Schema Definition for an Archetype
 * (e.g. Garment: sizes, colors, materials | Disk: format, duration, tracks | Hardware: comm, power, bus)
 */
export interface MdmArchetypeSpec {
   archetypeId: string
   name: string
   nature: MdmNature | string
   collection: string
   /** Array of required specification property names */
   requiredProperties?: string[]
   /** Array of optional specification property names */
   optionalProperties?: string[]
   /** Default specification key-value pairs */
   defaultSpecifications?: Record<string, unknown>
}
