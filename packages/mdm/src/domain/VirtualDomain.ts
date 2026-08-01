import { OntologyMappingInterface, MdmStandardOntologies } from './OntologyDomain'

/**
 * Standard Virtual Product Auth Mechanisms
 */
export enum AuthMechanism {
   BEARER_TOKEN = 'bearer_token',
   JWT = 'jwt',
   OAUTH2 = 'oauth2',
   X509_CERTIFICATE = 'x509_certificate',
   APN_KEYCHAIN = 'apn_keychain',
   SSH_KEY = 'ssh_key',
}

/**
 * Standard Recognized ISO/IEC 19770 / Schema.org Virtual Product Ontology Mapping
 */
export const VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT: OntologyMappingInterface = {
   ontologyUri: MdmStandardOntologies.ISO_IEC_19770,
   isoStandardRef: 'ISO/IEC 19770-2:2015 (Software Identification Tag & Entitlements)',
   schemaOrgType: 'https://schema.org/DigitalDocument',
}

/**
 * Standardized and Extensible Virtual Product Specification Interface (ends with 'Interface')
 */
export interface VirtualKeychainSpecInterface extends Record<string, unknown> {
   authMechanism: AuthMechanism | string
   targetNetwork: string
   scopes?: string[]
   expiresAt?: string
   maxUsageCount?: number
   ontologyMapping?: OntologyMappingInterface
}
