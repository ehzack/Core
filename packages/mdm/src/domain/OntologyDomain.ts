/**
 * Standardized Recognized International Ontologies & Standards References
 */
export enum MdmStandardOntologies {
   SCHEMA_ORG = 'https://schema.org/',
   GS1_GPC = 'https://www.gs1.org/gpc',
   W3C_SOSA = 'http://www.w3.org/ns/sosa/',
   W3C_SSN = 'http://www.w3.org/ns/ssn/',
   W3C_WOT = 'https://www.w3.org/2019/wot/td#',
   ISO_IEC_19770 = 'https://www.iso.org/standard/65666.html',
   OGC_GEOSPARQL = 'http://www.opengis.net/ont/geosparql#',
}

/**
 * Interface for Recognized Ontology & Standard Mapping
 */
export interface OntologyMappingInterface {
   ontologyUri?: string
   schemaOrgType?: string
   gs1GpcCode?: string
   w3cSosaTerm?: string
   w3cWotType?: string
   isoStandardRef?: string
}
