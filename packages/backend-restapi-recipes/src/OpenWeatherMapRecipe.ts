import { Filters, Filter, SortAndLimit } from '@quatrain/backend'
import { RestAdapterOptions, QuerySerializer } from '@quatrain/backend-restapi'
import { RestApiRecipe } from './RestApiRecipe'

/**
 * Recipe providing configuration and query mapping for the OpenWeatherMap REST API.
 */
export class OpenWeatherMapRecipe implements RestApiRecipe {
   /** The human-readable name of the recipe. */
   public name = 'OpenWeatherMap'
   /** The default endpoint URL. */
   public defaultBaseUrl = 'https://api.openweathermap.org/data/2.5'

   private apiKey: string

   constructor(apiKey: string) {
      this.apiKey = apiKey
   }

   /**
    * Custom query serializer transforming Quatrain filters into OpenWeatherMap parameters.
    * 
    * @param filters - Active filters.
    * @param pagination - Pagination details.
    * @returns The parameter record.
    */
   public querySerializer: QuerySerializer = (filters: Filters | Filter[] | undefined, pagination: SortAndLimit | undefined) => {
      const params: Record<string, string> = {
         appid: this.apiKey,
         units: 'metric' // Default to metric
      }

      if (filters) {
         // Very simplistic filter mapping for PoC
         const filterArray = Array.isArray(filters) ? filters : [filters]
         for (const f of filterArray) {
            if ('property' in f && 'value' in f) {
               // f is a Filter
               if (f.property === 'city' || f.property === 'q') params['q'] = String(f.value)
               if (f.property === 'lat') params['lat'] = String(f.value)
               if (f.property === 'lon') params['lon'] = String(f.value)
            }
         }
      }
      return params
   }

   /**
    * Returns the composed REST adapter options.
    * 
    * @param apiKey - Optional API key (overrides constructor value).
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
