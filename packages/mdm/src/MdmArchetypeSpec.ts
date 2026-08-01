import { MdmNature } from './enums/MdmEnums'
import { OntologyMappingInterface } from './domain/OntologyDomain'

/**
 * Specification Schema Definition for an Archetype
 * Supports recognized international ontologies (Schema.org, GS1 GPC, W3C SOSA, W3C WoT, ISO).
 */
export interface MdmArchetypeSpec {
   archetypeId: string
   name: string
   nature: MdmNature | string
   collection: string
   /** Recognized International Ontology Mapping */
   ontologyMapping?: OntologyMappingInterface
   /** Array of required specification property names */
   requiredProperties?: string[]
   /** Array of optional specification property names */
   optionalProperties?: string[]
   /** Default specification key-value pairs */
   defaultSpecifications?: Record<string, unknown>
}
