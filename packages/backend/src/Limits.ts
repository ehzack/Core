export interface LimitsType {
   offset: number
   batch: number
}

/**
 * Defines the pagination boundaries for a database query.
 */
export class Limits implements LimitsType {
   /** The number of initial records to skip. Defaults to 0. */
   offset: number
   /** The maximum number of records to return in a single batch. Defaults to 10. */
   batch: number
   constructor(offset = 0, batch = 10) {
      this.offset = offset
      this.batch = batch
   }
}
