/**
 * Reusable Standard Specification Groups Registry in @quatrain/mdm.
 * Allows domain models to reference standard Quatrain MDM groups (dimensions, vendor, electrical, network)
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

   public static readonly VENDOR = {
      $id: '@quatrain/mdm/groups/vendor',
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

   public static readonly ELECTRICAL = {
      $id: '@quatrain/mdm/groups/electrical',
      type: 'object',
      title: 'Electrical Hardware Ratings Specification Group (Type-Level)',
      description: 'Static hardware operating voltage ratings, peak current draw and active/sleep power consumption',
      properties: {
         voltageNominal: { type: 'number', title: 'Nominal Voltage (V)', minimum: 0 },
         voltageMin: { type: 'number', title: 'Minimum Operating Voltage (V)', minimum: 0 },
         voltageMax: { type: 'number', title: 'Maximum Operating Voltage (V)', minimum: 0 },
         currentMax: { type: 'number', title: 'Peak Current Amperage (mA)', minimum: 0 },
         powerActive: { type: 'number', title: 'Active Power Consumption (mW)', minimum: 0 },
         powerSleep: { type: 'number', title: 'Sleep Standby Consumption (µW)', minimum: 0 }
      }
   }

   public static readonly NETWORK_ETH = {
      $id: '@quatrain/mdm/groups/network/eth',
      type: 'object',
      title: 'Ethernet Connectivity Sub-Group',
      properties: {
         macAddress: { type: 'string', title: 'MAC Address', pattern: '^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$' },
         speed: { type: 'number', title: 'Port Speed (Mbps)', enum: [10, 100, 1000, 2500, 10000] },
         poeSupported: { type: 'boolean', title: 'PoE Power Support', default: false }
      }
   }

   public static readonly NETWORK_WIFI = {
      $id: '@quatrain/mdm/groups/network/wifi',
      type: 'object',
      title: 'Wi-Fi Connectivity Sub-Group',
      properties: {
         macAddress: { type: 'string', title: 'Wi-Fi MAC Address', pattern: '^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$' },
         supportedStandards: {
            type: 'array',
            title: 'Supported Wi-Fi Standards',
            items: { type: 'string', enum: ['802.11a', '802.11b', '802.11g', '802.11n', '802.11ac', '802.11ax'] }
         },
         frequencyBands: {
            type: 'array',
            title: 'Frequency Bands (GHz)',
            items: { type: 'string', enum: ['2.4', '5.0', '6.0'] }
         }
      }
   }

   public static readonly NETWORK_LORAWAN = {
      $id: '@quatrain/mdm/groups/network/lorawan',
      type: 'object',
      title: 'LoRaWAN Connectivity Sub-Group',
      properties: {
         devEui: { type: 'string', title: 'Device EUI (16 Hex)', pattern: '^[0-9A-Fa-f]{16}$' },
         appEui: { type: 'string', title: 'Application EUI (16 Hex)', pattern: '^[0-9A-Fa-f]{16}$' },
         frequencyBand: { type: 'string', title: 'LoRaWAN Regional Band', enum: ['EU868', 'US915', 'AU915', 'AS923', 'KR920'] },
         activationMode: { type: 'string', title: 'Activation Mode', enum: ['OTAA', 'ABP'], default: 'OTAA' }
      }
   }

   public static readonly NETWORK_GSM = {
      $id: '@quatrain/mdm/groups/network/gsm',
      type: 'object',
      title: 'Cellular / GSM Connectivity Sub-Group',
      properties: {
         imei: { type: 'string', title: 'IMEI Number', pattern: '^[0-9]{15}$' },
         iccid: { type: 'string', title: 'SIM Card ICCID', pattern: '^[0-9]{18,20}$' },
         technologies: {
            type: 'array',
            title: 'Cellular Network Technologies',
            items: { type: 'string', enum: ['2G', '3G', '4G', '5G', 'NB-IoT', 'LTE-M'] }
         }
      }
   }

   public static readonly NETWORK = {
      $id: '@quatrain/mdm/groups/network',
      type: 'object',
      title: 'Network & Connectivity Master Specification Group (Unit-Level)',
      description: 'Network connectivity interfaces, unit power source and hardware sub-groups (eth, wifi, lorawan, gsm)',
      properties: {
         powerSource: {
            type: 'string',
            title: 'Deployment Unit Power Source',
            enum: ['BATTERY', 'SOLAR_BATTERY', 'MAINS_AC', 'POE', 'DC_EXTERNAL']
         },
         eth: this.NETWORK_ETH,
         wifi: this.NETWORK_WIFI,
         lorawan: this.NETWORK_LORAWAN,
         gsm: this.NETWORK_GSM
      }
   }

   static {
      this.registerGroup('@quatrain/mdm/groups/dimensions', this.DIMENSIONS)
      this.registerGroup('@quatrain/mdm/groups/vendor', this.VENDOR)
      this.registerGroup('@quatrain/mdm/groups/electrical', this.ELECTRICAL)
      this.registerGroup('@quatrain/mdm/groups/network', this.NETWORK)
      this.registerGroup('@quatrain/mdm/groups/network/eth', this.NETWORK_ETH)
      this.registerGroup('@quatrain/mdm/groups/network/wifi', this.NETWORK_WIFI)
      this.registerGroup('@quatrain/mdm/groups/network/lorawan', this.NETWORK_LORAWAN)
      this.registerGroup('@quatrain/mdm/groups/network/gsm', this.NETWORK_GSM)
   }

   public static registerGroup(groupId: string, schema: Record<string, unknown>): void {
      this._registry.set(groupId, schema)
   }

   public static getGroup(groupId: string): Record<string, unknown> | undefined {
      return this._registry.get(groupId)
   }
}
