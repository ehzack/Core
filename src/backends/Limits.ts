export interface LimitsType {
   offset: number
   batch: number
}

export class Limits implements LimitsType {
   offset: number
   batch: number
   constructor(offset = 0, batch = 10) {
      this.offset = offset
      this.batch = batch
   }
}
