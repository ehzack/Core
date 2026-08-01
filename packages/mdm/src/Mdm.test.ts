import { Mdm } from './Mdm'
import { MockMdmAdapter } from './MockMdmAdapter'
import { 
   Garment, 
   Disk, 
   HardwareDevice, 
   VirtualKeychain 
} from './MdmArchetypeExamples'
import { AbstractMdmObject } from './AbstractMdmObject'
import { Specification } from './Specification'
import { Vendor } from './Vendor'
import { ObjectVendor } from './ObjectVendor'
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
      return this.specificationsObject as TextileGarmentSpecInterface
   }
}

describe('@quatrain/mdm Pivot Class, Specification, Vendor & ObjectVendor Relational Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should register and retrieve MDM adapters via alias registry', () => {
      const adapter = Mdm.getAdapter('default')
      expect(adapter).toBeInstanceOf(MockMdmAdapter)
      expect(adapter.alias).toBe('default')
   })

   it('should instantiate Specification model extending PersistedBaseObject', () => {
      const spec = Specification.fromObject({
         name: 'sizes',
         key: 'sizes',
         value: [GarmentSize.MEDIUM, GarmentSize.LARGE],
         unit: 'size_code',
         group: 'textile_dimensions'
      })

      expect(spec.val('key')).toBe('sizes')
      expect(spec.val('value')).toEqual([GarmentSize.MEDIUM, GarmentSize.LARGE])
      expect(spec.val('unit')).toBe('size_code')
      expect(spec.val('group')).toBe('textile_dimensions')
   })

   it('should instantiate standalone Vendor model extending PersistedBaseObject without parent property', () => {
      const vendor = Vendor.fromObject({
         name: 'EcoApparel Corp',
         sku: 'ECO-CORP-01',
         url: 'https://ecoapparel.example.com'
      })

      expect(vendor.val('name')).toBe('EcoApparel Corp')
      expect(vendor.val('sku')).toBe('ECO-CORP-01')
      expect(vendor.val('url')).toBe('https://ecoapparel.example.com')
   })

   it('should associate Vendors to an AbstractMdmObject via ObjectVendor relationship records', () => {
      const ecoVendor = Vendor.fromObject({ name: 'EcoApparel Mills' })
      const distroVendor = Vendor.fromObject({ name: 'Textile Global Distro' })

      const tshirtVariant = TeeShirt.fromObject({
         name: 'Quatrain Organic V-Neck T-Shirt (Navy)',
         sku: 'QT-TSHIRT-ORG-001',
         archetypeId: 'textile.tshirt',
         nature: MdmNature.PHYSICAL,
      })

      tshirtVariant.addVendor(ecoVendor, 'ECO-MILL-883', 'manufacturer', true)
      tshirtVariant.addVendor(distroVendor, 'TGD-2026-9', 'distributor')

      const objectVendors = tshirtVariant.getObjectVendors()
      expect(objectVendors.length).toBe(2)
      expect(objectVendors[0].val('vendorSku')).toBe('ECO-MILL-883')
      expect(objectVendors[0].val('role')).toBe('manufacturer')
      expect(objectVendors[0].val('isPrimary')).toBe(true)

      const vendors = tshirtVariant.getVendors()
      expect(vendors.length).toBe(2)
      expect(vendors[0].val('name')).toBe('EcoApparel Mills')
      expect(vendors[1].val('name')).toBe('Textile Global Distro')
   })

   it('should create and validate a TeeShirt product variant and inventory unit using Specification & ObjectVendor collections', () => {
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
         name: 'Quatrain Organic V-Neck T-Shirt (Navy)',
         sku: 'QT-TSHIRT-001',
         archetypeId: 'textile.tshirt',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'production',
      })

      const qtApparelVendor = Vendor.fromObject({ name: 'Quatrain Apparel' })
      tshirtVariant.addVendor(qtApparelVendor, 'VEND-QT-001', 'brand', true)
      tshirtVariant.setSpecificationsFromObject(tshirtSpec)

      expect(tshirtVariant.validateArchetypeSpecs()).toBe(true)
      expect(tshirtVariant.getSpecifications().length).toBeGreaterThanOrEqual(7)
      expect(tshirtVariant.specifications.colors).toContain(TextileColor.NAVY_BLUE)
      expect(tshirtVariant.specifications.materials).toContain(TextileMaterial.ORGANIC_COTTON)
      expect(tshirtVariant.specifications.sizes).toContain(GarmentSize.MEDIUM)
      expect(tshirtVariant.specifications.ontologyMapping?.gs1GpcCode).toBe('10000024')

      const tshirtUnit = TeeShirt.fromObject({
         name: 'Quatrain T-Shirt - Size M Navy',
         archetypeId: 'textile.tshirt',
         parent: tshirtVariant,
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
      })

      tshirtUnit.setSpecificationsFromObject({
         selectedSize: GarmentSize.MEDIUM,
         selectedColor: TextileColor.NAVY_BLUE,
         barcode: '3760000000042'
      })

      expect(tshirtUnit.getSubcollectionName('certifications')).toContain('tshirts')
   })

   it('should validate missing required textile properties on Garment instance', () => {
      const invalidGarment = Garment.fromObject({
         name: 'Incomplete Coat',
         archetypeId: 'textile.garment',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
      })

      invalidGarment.setSpecificationsFromObject({
         sizes: [GarmentSize.MEDIUM],
         // Missing required 'colors' and 'materials'
      })

      expect(() => invalidGarment.validateArchetypeSpecs()).toThrow(/MdmValidationError/)
   })

   it('should support MediaDiskFormat ENUM and MediaDiskSpecInterface interface on Disk class using Specification collection', () => {
      const diskSpec: MediaDiskSpecInterface = {
         format: MediaDiskFormat.VINYL_12IN,
         durationSec: 2580,
         trackCount: 10,
         rpm: VinylRpm.RPM_33,
         catalogNumber: 'QT-VINYL-2026',
         ontologyMapping: MEDIA_DISK_ONTOLOGY_DEFAULT
      }

      const vinylDisk = Disk.fromObject({
         name: 'Dark Side of the Moon Vinyl',
         sku: 'VINYL-DARK-SIDE-01',
         archetypeId: 'media.disk',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'AVAILABLE',
      })

      const harvestVendor = Vendor.fromObject({ name: 'Harvest Records' })
      vinylDisk.addVendor(harvestVendor, 'HAR-77491', 'record_label', true)
      vinylDisk.setSpecificationsFromObject(diskSpec)

      expect(vinylDisk.validateArchetypeSpecs()).toBe(true)
      expect(vinylDisk.specifications.format).toBe(MediaDiskFormat.VINYL_12IN)
      expect(vinylDisk.getVendors()[0].val('name')).toBe('Harvest Records')
   })

   it('should support VirtualKeychain and HardwareDevice archetypes', () => {
      const hardwareSpec: HardwareDeviceSpecInterface = {
         serialNumber: 'SN-BRAD-2026-99',
         commCapabilities: [CommTechnology.LORAWAN_TERRESTRIAL, CommTechnology.LORAWAN_SATELLITE, CommTechnology.CELLULAR_GSM],
         powerCapabilities: [PowerSource.SOLAR_MPPT, PowerSource.PRIMARY_LITHIUM]
      }

      const probeDevice = HardwareDevice.fromObject({
         name: 'Soil Probe V2',
         sku: 'BRAD-PROBE-V2-HYBRID',
         archetypeId: 'hardware.device',
         nature: MdmNature.PHYSICAL,
         lifecycleState: 'ASSOCIATED',
      })
      const bradVendor = Vendor.fromObject({ name: 'Brad Technology' })
      probeDevice.addVendor(bradVendor, 'BRAD-PHY-PCB-HYBRID-01', 'oem', true)
      probeDevice.setSpecificationsFromObject(hardwareSpec)

      const keychainSpec: VirtualKeychainSpecInterface = {
         authMechanism: AuthMechanism.X509_CERTIFICATE,
         targetNetwork: 'chirpstack_wss',
         scopes: ['gateway:connect']
      }

      const keychain = VirtualKeychain.fromObject({
         name: 'ChirpStack WSS Key',
         archetypeId: 'virtual.keychain',
         nature: MdmNature.VIRTUAL,
         lifecycleState: 'ACTIVE',
      })
      keychain.setSpecificationsFromObject(keychainSpec)

      expect(probeDevice.validateArchetypeSpecs()).toBe(true)
      expect(keychain.validateArchetypeSpecs()).toBe(true)
      expect(probeDevice.getSubcollectionName('keychains')).toContain('devices')
   })
})
