import { Mdm } from './Mdm'
import { MockMdmAdapter } from './MockMdmAdapter'
import { 
   GarmentMdmObject, 
   DiskMdmObject, 
   HardwareDeviceMdmObject, 
   VirtualKeychainMdmObject 
} from './MdmArchetypeExamples'

describe('@quatrain/mdm Pivot Class & AbstractMdmObject Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should register and retrieve MDM adapters via alias registry', () => {
      const adapter = Mdm.getAdapter('default')
      expect(adapter).toBeInstanceOf(MockMdmAdapter)
      expect(adapter.alias).toBe('default')
   })

   it('should register archetype specifications and concrete AbstractMdmObject child models', () => {
      const garment = new GarmentMdmObject({ name: 'Winter Jacket' } as any)
      const disk = new DiskMdmObject({ name: 'Vinyl LP' } as any)

      Mdm.registerArchetype(garment.getArchetypeSpec())
      Mdm.registerArchetype(disk.getArchetypeSpec())

      Mdm.registerModel('textile.garment', GarmentMdmObject)
      Mdm.registerModel('media.disk', DiskMdmObject)

      expect(Mdm.getArchetype('textile.garment')?.requiredProperties).toEqual(['sizes', 'colors', 'materials'])
      expect(Mdm.getArchetype('media.disk')?.requiredProperties).toEqual(['format', 'durationSec', 'trackCount'])
      expect(Mdm.getModel('textile.garment')).toBe(GarmentMdmObject)
   })

   it('should validate required archetype specifications on concrete AbstractMdmObject instances', () => {
      const validGarment = GarmentMdmObject.fromObject({
         uid: 'garment_001',
         name: 'Blue Denim Jeans',
         archetypeId: 'textile.garment',
         nature: 'physical',
         lifecycleState: 'AVAILABLE',
         specifications: {
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Blue', 'Black'],
            materials: ['Cotton 98%', 'Elastane 2%'],
         },
      })

      expect(validGarment.validateArchetypeSpecs()).toBe(true)

      const invalidGarment = GarmentMdmObject.fromObject({
         uid: 'garment_002',
         name: 'Incomplete Jeans',
         archetypeId: 'textile.garment',
         nature: 'physical',
         lifecycleState: 'AVAILABLE',
         specifications: {
            sizes: ['M'],
            // Missing required 'colors' and 'materials'
         },
      })

      expect(() => invalidGarment.validateArchetypeSpecs()).toThrow(/MdmValidationError/)
   })

   it('should support Audio/Video Disk archetype specifications (vinyl, duration, trackCount)', () => {
      const vinylDisk = DiskMdmObject.fromObject({
         uid: 'disk_vinyl_001',
         name: 'Dark Side of the Moon Vinyl',
         archetypeId: 'media.disk',
         nature: 'physical',
         lifecycleState: 'AVAILABLE',
         specifications: {
            format: 'vinyl_12in',
            durationSec: 2580,
            trackCount: 10,
            rpm: 33,
         },
      })

      expect(vinylDisk.validateArchetypeSpecs()).toBe(true)
      expect(vinylDisk.dataObject.val('specifications').format).toBe('vinyl_12in')
      expect(vinylDisk.dataObject.val('specifications').trackCount).toBe(10)
   })

   it('should support Virtual Keychain Credentials and IoT Hardware Device archetypes', () => {
      const probeDevice = HardwareDeviceMdmObject.fromObject({
         uid: 'dev_probe_001',
         name: 'Soil Probe V2',
         archetypeId: 'hardware.device',
         nature: 'physical',
         lifecycleState: 'ASSOCIATED',
         specifications: {
            serialNumber: 'SN-BRAD-2026-99',
            commCapabilities: ['lorawan_terrestrial', 'lorawan_satellite', 'cellular_gsm'],
         },
      })

      const keychain = VirtualKeychainMdmObject.fromObject({
         uid: 'keychain_wss_001',
         name: 'ChirpStack WSS Key',
         archetypeId: 'virtual.keychain',
         nature: 'virtual',
         lifecycleState: 'ACTIVE',
         specifications: {
            authMechanism: 'x509_certificate',
            targetNetwork: 'chirpstack_wss',
         },
      })

      expect(probeDevice.validateArchetypeSpecs()).toBe(true)
      expect(keychain.validateArchetypeSpecs()).toBe(true)
      expect(probeDevice.getSubcollectionName('keychains')).toBe('mdm.devices.dev_probe_001.keychains')
   })
})
