import { Mdm } from './Mdm'
import { MockMdmAdapter } from './MockMdmAdapter'
import { 
   GarmentMdmObject, 
   DiskMdmObject, 
   HardwareDeviceMdmObject, 
   VirtualKeychainMdmObject 
} from './MdmArchetypeExamples'
import { MdmNature } from './enums/MdmEnums'
import { GarmentSize, TextileColor, TextileMaterial, ITextileGarmentSpec } from './domain/TextileDomain'
import { MediaDiskFormat, VinylRpm, IMediaDiskSpec } from './domain/MediaDomain'
import { CommTechnology, PowerSource, IHardwareDeviceSpec } from './domain/HardwareDomain'
import { AuthMechanism, IVirtualKeychainSpec } from './domain/VirtualDomain'

describe('@quatrain/mdm Pivot Class, ENUMs, Interfaces & AbstractMdmObject Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should register and retrieve MDM adapters via alias registry', () => {
      const adapter = Mdm.getAdapter('default')
      expect(adapter).toBeInstanceOf(MockMdmAdapter)
      expect(adapter.alias).toBe('default')
   })

   it('should register archetype specifications and concrete AbstractMdmObject child models using ENUMs', () => {
      const garment = new GarmentMdmObject({ name: 'Winter Jacket' } as any)
      const disk = new DiskMdmObject({ name: 'Vinyl LP' } as any)

      Mdm.registerArchetype(garment.getArchetypeSpec())
      Mdm.registerArchetype(disk.getArchetypeSpec())

      Mdm.registerModel('textile.garment', GarmentMdmObject)
      Mdm.registerModel('media.disk', DiskMdmObject)

      expect(Mdm.getArchetype('textile.garment')?.nature).toBe(MdmNature.PHYSICAL)
      expect(Mdm.getArchetype('textile.garment')?.requiredProperties).toEqual(['sizes', 'colors', 'materials'])
      expect(Mdm.getArchetype('media.disk')?.requiredProperties).toEqual(['format', 'durationSec', 'trackCount'])
      expect(Mdm.getModel('textile.garment')).toBe(GarmentMdmObject)
   })

   it('should support standardized and extensible ITextileGarmentSpec with ENUMs (GarmentSize, TextileColor, TextileMaterial)', () => {
      const garmentSpec: ITextileGarmentSpec = {
         sizes: [GarmentSize.S, GarmentSize.M, GarmentSize.L, 'CUSTOM_BIG_SIZE'],
         colors: [TextileColor.NAVY_BLUE, TextileColor.BLACK, '#00FF00'],
         materials: [TextileMaterial.COTTON, TextileMaterial.ELASTANE],
         brand: 'Quatrain Wear',
         customPattern: 'Jacquard'
      }

      const validGarment = GarmentMdmObject.fromObject({
         uid: 'garment_001',
         name: 'Navy Blue Denim Jacket',
         archetypeId: 'textile.garment',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: garmentSpec,
      })

      expect(validGarment.validateArchetypeSpecs()).toBe(true)
      expect(validGarment.specifications.sizes).toContain(GarmentSize.M)
      expect(validGarment.specifications.colors).toContain(TextileColor.NAVY_BLUE)
      expect(validGarment.specifications.customPattern).toBe('Jacquard')
   })

   it('should validate missing required textile properties', () => {
      const invalidGarment = GarmentMdmObject.fromObject({
         uid: 'garment_002',
         name: 'Incomplete Coat',
         archetypeId: 'textile.garment',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: {
            sizes: [GarmentSize.M],
            // Missing required 'colors' and 'materials'
         },
      })

      expect(() => invalidGarment.validateArchetypeSpecs()).toThrow(/MdmValidationError/)
   })

   it('should support MediaDiskFormat ENUM and IMediaDiskSpec interface', () => {
      const diskSpec: IMediaDiskSpec = {
         format: MediaDiskFormat.VINYL_12IN,
         durationSec: 2580,
         trackCount: 10,
         rpm: VinylRpm.RPM_33,
         catalogNumber: 'QT-VINYL-2026'
      }

      const vinylDisk = DiskMdmObject.fromObject({
         uid: 'disk_vinyl_001',
         name: 'Dark Side of the Moon Vinyl',
         archetypeId: 'media.disk',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: diskSpec,
      })

      expect(vinylDisk.validateArchetypeSpecs()).toBe(true)
      expect(vinylDisk.specifications.format).toBe(MediaDiskFormat.VINYL_12IN)
      expect(vinylDisk.specifications.rpm).toBe(33)
   })

   it('should support Virtual Keychain Credentials and IoT Hardware Device archetypes using ENUMs', () => {
      const hardwareSpec: IHardwareDeviceSpec = {
         serialNumber: 'SN-BRAD-2026-99',
         commCapabilities: [CommTechnology.LORAWAN_TERRESTRIAL, CommTechnology.LORAWAN_SATELLITE, CommTechnology.CELLULAR_GSM],
         powerCapabilities: [PowerSource.SOLAR_MPPT, PowerSource.PRIMARY_LITHIUM]
      }

      const probeDevice = HardwareDeviceMdmObject.fromObject({
         uid: 'dev_probe_001',
         name: 'Soil Probe V2',
         archetypeId: 'hardware.device',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'ASSOCIATED',
         specifications: hardwareSpec,
      })

      const keychainSpec: IVirtualKeychainSpec = {
         authMechanism: AuthMechanism.X509_CERTIFICATE,
         targetNetwork: 'chirpstack_wss',
         scopes: ['gateway:connect']
      }

      const keychain = VirtualKeychainMdmObject.fromObject({
         uid: 'keychain_wss_001',
         name: 'ChirpStack WSS Key',
         archetypeId: 'virtual.keychain',
         nature: MdmNature.VIRTUAL,
         lifecycleState: 'ACTIVE',
         specifications: keychainSpec,
      })

      expect(probeDevice.validateArchetypeSpecs()).toBe(true)
      expect(keychain.validateArchetypeSpecs()).toBe(true)
      expect(probeDevice.getSubcollectionName('keychains')).toBe('mdm.devices.dev_probe_001.keychains')
   })
})
