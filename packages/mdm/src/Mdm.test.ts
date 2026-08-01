import { Mdm } from './Mdm'
import { MockMdmAdapter } from './MockMdmAdapter'
import { 
   Garment, 
   Disk, 
   HardwareDevice, 
   VirtualKeychain 
} from './MdmArchetypeExamples'
import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { MdmNature } from './enums/MdmEnums'
import { GarmentSize, TextileColor, TextileMaterial, TextileWashCare, TextileGarmentSpecInterface, TEXTILE_GARMENT_ONTOLOGY_DEFAULT } from './domain/TextileDomain'
import { MediaDiskFormat, VinylRpm, MediaDiskSpecInterface, MEDIA_DISK_ONTOLOGY_DEFAULT } from './domain/MediaDomain'
import { CommTechnology, PowerSource, HardwareDeviceSpecInterface, HARDWARE_DEVICE_ONTOLOGY_DEFAULT } from './domain/HardwareDomain'
import { AuthMechanism, VirtualKeychainSpecInterface, VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT } from './domain/VirtualDomain'
import { MdmStandardOntologies } from './domain/OntologyDomain'

/**
 * Concrete TeeShirt Model Class for HOWTO verification
 */
class TeeShirt extends AbstractMdmObject {
   static COLLECTION = 'tshirts'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.tshirt',
         name: 'Organic Cotton T-Shirt',
         nature: MdmNature.PHYSICAL,
         collection: TeeShirt.COLLECTION,
         ontologyMapping: TEXTILE_GARMENT_ONTOLOGY_DEFAULT,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand', 'weightGrams', 'fitType', 'ontologyMapping'],
      }
   }

   public get specifications(): TextileGarmentSpecInterface {
      return this.dataObject.val('specifications') as TextileGarmentSpecInterface
   }
}

describe('@quatrain/mdm Pivot Class, ENUMs, Vendor/SKU & AbstractMdmObject Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should register and retrieve MDM adapters via alias registry', () => {
      const adapter = Mdm.getAdapter('default')
      expect(adapter).toBeInstanceOf(MockMdmAdapter)
      expect(adapter.alias).toBe('default')
   })

   it('should support vendor, vendorSku, and internal sku properties on AbstractMdmObject', () => {
      const tshirtVariant = TeeShirt.fromObject({
         id: 'tshirt_organic_vneck_navy',
         name: 'Quatrain Organic V-Neck T-Shirt (Navy)',
         sku: 'QT-TSHIRT-ORG-001',
         vendor: 'EcoApparel Corp',
         vendorSku: 'VEND-ECO-9942',
         archetypeId: 'textile.tshirt',
         nature: MdmNature.PHYSICAL,
         specifications: {
            sizes: [GarmentSize.MEDIUM],
            colors: [TextileColor.NAVY_BLUE],
            materials: [TextileMaterial.ORGANIC_COTTON]
         }
      })

      expect(tshirtVariant.dataObject.val('id')).toBe('tshirt_organic_vneck_navy')
      expect(tshirtVariant.dataObject.val('sku')).toBe('QT-TSHIRT-ORG-001')
      expect(tshirtVariant.vendorInfo.vendor).toBe('EcoApparel Corp')
      expect(tshirtVariant.vendorInfo.vendorSku).toBe('VEND-ECO-9942')
   })

   it('should create and validate a TeeShirt product variant and inventory unit with clean id and parentId', () => {
      const tshirtSample = TeeShirt.fromObject({ name: 'T-Shirt Archetype', archetypeId: 'textile.tshirt', nature: MdmNature.PHYSICAL })
      Mdm.registerArchetype(tshirtSample.getArchetypeSpec())
      Mdm.registerModel('textile.tshirt', TeeShirt)

      const tshirtSpec: TextileGarmentSpecInterface = {
         sizes: [GarmentSize.SMALL, GarmentSize.MEDIUM, GarmentSize.LARGE, GarmentSize.EXTRA_LARGE],
         colors: [TextileColor.NAVY_BLUE, TextileColor.WHITE, TextileColor.BLACK],
         materials: [TextileMaterial.ORGANIC_COTTON, TextileMaterial.ELASTANE],
         washCare: [TextileWashCare.WASH_30C, TextileWashCare.NO_BLEACH, TextileWashCare.IRON_MEDIUM],
         brand: 'Quatrain EcoWear',
         weightGrams: 180,
         fitType: 'regular',
         customCollar: 'V-Neck',
         ontologyMapping: TEXTILE_GARMENT_ONTOLOGY_DEFAULT
      }

      const tshirtVariant = TeeShirt.fromObject({
         id: 'tshirt_organic_vneck_navy',
         name: 'Quatrain Organic V-Neck T-Shirt (Navy)',
         sku: 'QT-TSHIRT-001',
         vendor: 'Quatrain Apparel',
         vendorSku: 'VEND-QT-001',
         archetypeId: 'textile.tshirt',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'production',
         specifications: tshirtSpec,
      })

      expect(tshirtVariant.validateArchetypeSpecs()).toBe(true)
      expect(tshirtVariant.specifications.colors).toContain(TextileColor.NAVY_BLUE)
      expect(tshirtVariant.specifications.materials).toContain(TextileMaterial.ORGANIC_COTTON)
      expect(tshirtVariant.specifications.sizes).toContain(GarmentSize.MEDIUM)
      expect(tshirtVariant.specifications.ontologyMapping?.gs1GpcCode).toBe('10000024')

      const tshirtUnit = TeeShirt.fromObject({
         id: 'unit_tshirt_sn_2026_0042',
         name: 'Quatrain T-Shirt - Size M Navy',
         archetypeId: 'textile.tshirt',
         parentId: tshirtVariant.dataObject.val('id'),
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: {
            selectedSize: GarmentSize.MEDIUM,
            selectedColor: TextileColor.NAVY_BLUE,
            barcode: '3760000000042'
         }
      })

      expect(tshirtUnit.dataObject.val('parentId')).toBe('tshirt_organic_vneck_navy')
      expect(tshirtUnit.getSubcollectionName('certifications')).toBe(
         'tshirts/unit_tshirt_sn_2026_0042/certifications'
      )
   })

   it('should validate missing required textile properties on Garment instance', () => {
      const invalidGarment = Garment.fromObject({
         id: 'garment_002',
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

   it('should support MediaDiskFormat ENUM and MediaDiskSpecInterface interface on Disk class', () => {
      const diskSpec: MediaDiskSpecInterface = {
         format: MediaDiskFormat.VINYL_12IN,
         durationSec: 2580,
         trackCount: 10,
         rpm: VinylRpm.RPM_33,
         catalogNumber: 'QT-VINYL-2026',
         ontologyMapping: MEDIA_DISK_ONTOLOGY_DEFAULT
      }

      const vinylDisk = Disk.fromObject({
         id: 'disk_vinyl_001',
         name: 'Dark Side of the Moon Vinyl',
         sku: 'VINYL-DARK-SIDE-01',
         vendor: 'Harvest Records',
         vendorSku: 'HAR-77491',
         archetypeId: 'media.disk',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
         specifications: diskSpec,
      })

      expect(vinylDisk.validateArchetypeSpecs()).toBe(true)
      expect(vinylDisk.specifications.format).toBe(MediaDiskFormat.VINYL_12IN)
      expect(vinylDisk.vendorInfo.vendor).toBe('Harvest Records')
      expect(vinylDisk.vendorInfo.vendorSku).toBe('HAR-77491')
   })

   it('should support VirtualKeychain and HardwareDevice archetypes', () => {
      const hardwareSpec: HardwareDeviceSpecInterface = {
         serialNumber: 'SN-BRAD-2026-99',
         commCapabilities: [CommTechnology.LORAWAN_TERRESTRIAL, CommTechnology.LORAWAN_SATELLITE, CommTechnology.CELLULAR_GSM],
         powerCapabilities: [PowerSource.SOLAR_MPPT, PowerSource.PRIMARY_LITHIUM]
      }

      const probeDevice = HardwareDevice.fromObject({
         id: 'dev_probe_001',
         name: 'Soil Probe V2',
         sku: 'BRAD-PROBE-V2-HYBRID',
         vendor: 'Brad Technology',
         vendorSku: 'BRAD-PHY-PCB-HYBRID-01',
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

      const keychain = VirtualKeychain.fromObject({
         id: 'keychain_wss_001',
         name: 'ChirpStack WSS Key',
         archetypeId: 'virtual.keychain',
         nature: MdmNature.VIRTUAL,
         lifecycleState: 'ACTIVE',
         specifications: keychainSpec,
      })

      expect(probeDevice.validateArchetypeSpecs()).toBe(true)
      expect(keychain.validateArchetypeSpecs()).toBe(true)
      expect(probeDevice.getSubcollectionName('keychains')).toBe('devices/dev_probe_001/keychains')
   })
})
