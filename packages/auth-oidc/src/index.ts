// @ts-ignore
import Provider from 'oidc-provider'

/**
 * OpenID Connect provider factory implementing `oidc-provider`.
 * Can be used to run a fully functional OAuth2 / OIDC server locally.
 */
export class AuthOIDC {
   /**
    * Creates an OIDC Provider instance.
    * 
    * @param issuer - The base URL issuer (e.g. `http://localhost:3000`).
    * @param config - Overrides for the underlying OIDC configuration.
    * @returns An `oidc-provider` instance.
    */
   public static factory(issuer: string, config?: any) {
      // Basic minimal configuration for PoC
      const configuration = {
         clients: [{
            client_id: 'studio-client',
            client_secret: 'secret', // NOSONAR
            redirect_uris: ['http://localhost:3000/callback'],
            response_types: ['code'],
            grant_types: ['authorization_code']
         }],
         // Default features (PKCE etc.)
         features: {
            devInteractions: { enabled: true } // Provides a basic dev login screen automatically
         },
         ...config
      }

      const oidc = new Provider(issuer, configuration)
      return oidc
   }
}
