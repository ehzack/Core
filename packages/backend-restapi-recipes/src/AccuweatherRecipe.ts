import { Filters, Filter, SortAndLimit } from '@quatrain/backend'
import { RestAdapterOptions, QuerySerializer } from '@quatrain/backend-restapi'
import { RestApiRecipe } from './RestApiRecipe'

/**
 * Recipe providing configuration and query mapping for the AccuWeather REST API.
 */
export class AccuweatherRecipe implements RestApiRecipe {
   /** The human-readable name of the recipe. */
   public name = 'AccuWeather'
   /** The default endpoint URL. */
   public defaultBaseUrl = 'https://dataservice.accuweather.com'

   private apiKey: string

   constructor(apiKey: string) {
      this.apiKey = apiKey
   }

   /**
    * Custom query serializer transforming Quatrain filters into AccuWeather parameters.
    * 
    * @param filters - Active filters.
    * @param pagination - Pagination details.
    * @returns The parameter record.
    */
   public querySerializer: QuerySerializer = (filters: Filters | Filter[] | undefined, pagination: SortAndLimit | undefined) => {
      const params: Record<string, string> = {
         apikey: this.apiKey,
         language: 'en-us',
         details: 'true'
      }

      if (filters) {
         const filterArray = Array.isArray(filters) ? filters : [filters]
         for (const f of filterArray) {
            if ('property' in f && 'value' in f) {
               // AccuWeather often uses 'q' for location searches
               if (f.property === 'q' || f.property === 'city') params['q'] = String(f.value)
               // For geocoding or specific keys
               if (f.property === 'locationKey') params['locationKey'] = String(f.value)
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
