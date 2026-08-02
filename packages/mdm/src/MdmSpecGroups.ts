/**
 * Reusable Standard Specification Groups Registry in @quatrain/mdm.
 * Allows domain models to reference standard Quatrain MDM groups (dimensions, vendor_info, power, comm)
 * and extend them locally.
 */
export class MdmSpecGroups {
   private static _registry: Map<string, Record<string, unknown>> = new Map()

   public static readonly DIMENSIONS = {
      $id: '@quatrain/mdm/groups/dimensions',
      type: 'object',
      title: 'Physical Dimensions & Enclosure Specification Group',
      description: 'Standard physical dimensions (metric/imperial) and ingress protection rating',
      required: ['unitSystem', 'height', 'width'],
      properties: {
         unitSystem: {
            type: 'string',
            title: 'Unit System',
            enum: ['metric', 'imperial'],
            default: 'metric'
         },
         height: { type: 'number', title: 'Height', minimum: 0 },
         width: { type: 'number', title: 'Width', minimum: 0 },
         depth: { type: 'number', title: 'Depth', minimum: 0 },
         weight: { type: 'number', title: 'Weight', minimum: 0 },
         enclosureRating: {
            type: 'string',
            title: 'Ingress Protection Rating',
            enum: ['IP65', 'IP66', 'IP67', 'IP68', 'NONE']
         }
      }
   }

   public static readonly VENDOR_INFO = {
      $id: '@quatrain/mdm/groups/vendor_info',
      type: 'object',
      title: 'Vendor Relationship & Product Lifecycle Group',
      description: 'Supplier ObjectUri reference and manufacturing lifecycle status',
      required: ['status'],
      properties: {
         vendorUri: {
            type: 'string',
            title: 'Vendor ObjectUri Reference',
            pattern: '^vendors/[a-zA-Z0-9_-]+$'
         },
         vendorSku: { type: 'string', title: 'Vendor Product SKU' },
         status: {
            type: 'string',
            title: 'Lifecycle Status',
            enum: ['ACTIVE', 'EOL', 'DISCONTINUED'],
            default: 'ACTIVE'
         },
         releaseDate: { type: 'string', title: 'Market Release Date', format: 'date' },
         eolDate: { type: 'string', title: 'End of Life Date', format: 'date' }
      }
   }

   static {
      this.registerGroup('@quatrain/mdm/groups/dimensions', this.DIMENSIONS)
      this.registerGroup('@quatrain/mdm/groups/vendor_info', this.VENDOR_INFO)
   }

   public static registerGroup(groupId: string, schema: Record<string, unknown>): void {
      this._registry.set(groupId, schema)
   }

   public static getGroup(groupId: string): Record<string, unknown> | undefined {
      return this._registry.get(groupId)
   }
}
