import { Filters, Filter, SortAndLimit } from '@quatrain/backend'
import { RestAdapterOptions, QuerySerializer } from '@quatrain/backend-restapi'
import { RestApiRecipe } from './RestApiRecipe'

/**
 * Recipe providing configuration and query mapping for the CoinGecko REST API.
 */
export class CoinGeckoRecipe implements RestApiRecipe {
   /** The human-readable name of the recipe. */
   public name = 'CoinGecko'
   /** The default endpoint URL. */
   public defaultBaseUrl = 'https://api.coingecko.com/api/v3'

   /**
    * Custom query serializer transforming Quatrain filters and pagination into CoinGecko parameters.
    * 
    * @param filters - Active filters.
    * @param pagination - Pagination details.
    * @returns The parameter record.
    */
   public querySerializer: QuerySerializer = (filters: Filters | Filter[] | undefined, pagination: SortAndLimit | undefined) => {
      const params: Record<string, string> = {
         vs_currency: 'usd'
      }

      if (pagination && pagination.limits) {
         if (pagination.limits.batch) params['per_page'] = String(pagination.limits.batch)
         // Offset usually translates to page in these APIs: page = (offset / limit) + 1
         if (pagination.limits.offset && pagination.limits.batch) {
            params['page'] = String(Math.floor(pagination.limits.offset / pagination.limits.batch) + 1)
         }
      }

      if (filters) {
         const filterArray = Array.isArray(filters) ? filters : [filters]
         for (const f of filterArray) {
            if ('property' in f && 'value' in f) {
               if (f.property === 'ids') params['ids'] = String(f.value)
            }
         }
      }

      return params
   }

   /**
    * Returns the composed REST adapter options.
    * 
    * @param apiKey - Optional API key.
    * @param overrides - Additional adapter options.
    * @returns The generated adapter options.
    */
   public getOptions(apiKey?: string, overrides?: Partial<RestAdapterOptions>): RestAdapterOptions {
      return {
         baseUrl: this.defaultBaseUrl,
         querySerializer: this.querySerializer,
         ...overrides
      }
   }
}
