import { Mdm } from './Mdm'
import { MockMdmAdapter } from './MockMdmAdapter'
import { 
   GarmentMdmObject, 
   DiskMdmObject, 
   HardwareDeviceMdmObject, 
   VirtualKeychainMdmObject 
} from './MdmArchetypeExamples'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { MdmNature } from './enums/MdmEnums'
import { GarmentSize, TextileColor, TextileMaterial, TextileWashCare, TextileGarmentSpecInterface } from './domain/TextileDomain'
import { MediaDiskFormat, VinylRpm, MediaDiskSpecInterface } from './domain/MediaDomain'
import { CommTechnology, PowerSource, HardwareDeviceSpecInterface } from './domain/HardwareDomain'
import { AuthMechanism, VirtualKeychainSpecInterface } from './domain/VirtualDomain'

/**
 * Concrete T-Shirt MDM Model for HOWTO verification
 */
class TShirtMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.garments.tshirts'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.tshirt',
         name: 'Organic Cotton T-Shirt',
         nature: MdmNature.PHYSICAL,
         collection: TShirtMdmObject.COLLECTION,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand', 'weightGrams', 'fitType'],
      }
   }

   public get specifications(): TextileGarmentSpecInterface {
      return this.dataObject.val('specifications') as TextileGarmentSpecInterface
   }
}

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

   it('should create and validate a T-Shirt product variant and inventory unit using TextileGarmentSpecInterface and GarmentSize.MEDIUM', () => {
      const tshirtSample = new TShirtMdmObject({ name: 'T-Shirt Archetype' } as any)
      Mdm.registerArchetype(tshirtSample.getArchetypeSpec())
      Mdm.registerModel('textile.tshirt', TShirtMdmObject)

      const tshirtSpec: TextileGarmentSpecInterface = {
         sizes: [GarmentSize.SMALL, GarmentSize.MEDIUM, GarmentSize.LARGE, GarmentSize.EXTRA_LARGE],
         colors: [TextileColor.NAVY_BLUE, TextileColor.WHITE, TextileColor.BLACK],
         materials: [TextileMaterial.ORGANIC_COTTON, TextileMaterial.ELASTANE],
         washCare: [TextileWashCare.WASH_30C, TextileWashCare.NO_BLEACH, TextileWashCare.IRON_MEDIUM],
         brand: 'Quatrain EcoWear',
         weightGrams: 180,
         fitType: 'regular',
         customCollar: 'V-Neck'
      }

      const tshirtVariant = TShirtMdmObject.fromObject({
         uid: 'tshirt_organic_vneck_navy',
         name: 'Quatrain Organic V-Neck T-Shirt (Navy)',
         archetypeId: 'textile.tshirt',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'production',
         specifications: tshirtSpec,
      })

      expect(tshirtVariant.validateArchetypeSpecs()).toBe(true)
      expect(tshirtVariant.specifications.colors).toContain(TextileColor.NAVY_BLUE)
      expect(tshirtVariant.specifications.materials).toContain(TextileMaterial.ORGANIC_COTTON)
      expect(tshirtVariant.specifications.sizes).toContain(GarmentSize.MEDIUM)
      expect(tshirtVariant.specifications.sizes).toContain(GarmentSize.LARGE)
      expect(tshirtVariant.specifications.customCollar).toBe('V-Neck')

      const tshirtUnit = TShirtMdmObject.fromObject({
         uid: 'unit_tshirt_sn_2026_0042',
         name: 'Quatrain T-Shirt - Size M Navy',
         archetypeId: 'textile.tshirt',
         parentUid: tshirtVariant.dataObject.uid,
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: {
            selectedSize: GarmentSize.MEDIUM,
            selectedColor: TextileColor.NAVY_BLUE,
            barcode: '3760000000042'
         }
      })

      expect(tshirtUnit.getSubcollectionName('certifications')).toBe(
         'mdm.garments.tshirts.unit_tshirt_sn_2026_0042.certifications'
      )
   })

   it('should validate missing required textile properties', () => {
      const invalidGarment = GarmentMdmObject.fromObject({
         uid: 'garment_002',
         name: 'Incomplete Coat',
         archetypeId: 'textile.garment',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: {
            sizes: [GarmentSize.MEDIUM],
            // Missing required 'colors' and 'materials'
         },
      })

      expect(() => invalidGarment.validateArchetypeSpecs()).toThrow(/MdmValidationError/)
   })

   it('should support MediaDiskFormat ENUM and MediaDiskSpecInterface interface', () => {
      const diskSpec: MediaDiskSpecInterface = {
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
      const hardwareSpec: HardwareDeviceSpecInterface = {
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

      const keychainSpec: VirtualKeychainSpecInterface = {
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
