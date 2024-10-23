export interface Persisted {
   /**
    * Set or return the persisted status of object
    * @param set boolean
    * @return boolean
    */
   isPersisted(set?: boolean): boolean

   read(): Promise<any>

   save(): Promise<any>

   delete(): Promise<any>
}
