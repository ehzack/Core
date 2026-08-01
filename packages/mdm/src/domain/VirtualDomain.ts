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
 * Standardized and Extensible Virtual Product Specification Interface (ends with 'Interface')
 */
export interface VirtualKeychainSpecInterface extends Record<string, unknown> {
   authMechanism: AuthMechanism | string
   targetNetwork: string
   scopes?: string[]
   expiresAt?: string
   maxUsageCount?: number
}
