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
import { GarmentSize, TextileColor, TextileMaterial, TextileWashCare, TextileGarmentSpecInterface, TEXTILE_GARMENT_ONTOLOGY_DEFAULT } from './domain/TextileDomain'
import { MediaDiskFormat, VinylRpm, MediaDiskSpecInterface, MEDIA_DISK_ONTOLOGY_DEFAULT } from './domain/MediaDomain'
import { CommTechnology, PowerSource, HardwareDeviceSpecInterface, HARDWARE_DEVICE_ONTOLOGY_DEFAULT } from './domain/HardwareDomain'
import { AuthMechanism, VirtualKeychainSpecInterface, VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT } from './domain/VirtualDomain'
import { MdmStandardOntologies } from './domain/OntologyDomain'

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
         ontologyMapping: TEXTILE_GARMENT_ONTOLOGY_DEFAULT,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand', 'weightGrams', 'fitType', 'ontologyMapping'],
      }
   }

   public get specifications(): TextileGarmentSpecInterface {
      return this.dataObject.val('specifications') as TextileGarmentSpecInterface
   }
}

describe('@quatrain/mdm Pivot Class, ENUMs, Recognized Ontologies & AbstractMdmObject Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should register and retrieve MDM adapters via alias registry', () => {
      const adapter = Mdm.getAdapter('default')
      expect(adapter).toBeInstanceOf(MockMdmAdapter)
      expect(adapter.alias).toBe('default')
   })

   it('should support recognized international ontologies (GS1 GPC, Schema.org, W3C SOSA, ISO/IEC 19770)', () => {
      const garment = new GarmentMdmObject({ name: 'Jacket' } as any)
      const hardware = new HardwareDeviceMdmObject({ name: 'Sensor System' } as any)
      const virtualKeychain = new VirtualKeychainMdmObject({ name: 'OAuth Key' } as any)

      Mdm.registerArchetype(garment.getArchetypeSpec())
      Mdm.registerArchetype(hardware.getArchetypeSpec())
      Mdm.registerArchetype(virtualKeychain.getArchetypeSpec())

      expect(Mdm.getArchetype('textile.garment')?.ontologyMapping?.gs1GpcCode).toBe('10000024')
      expect(Mdm.getArchetype('hardware.device')?.ontologyMapping?.ontologyUri).toBe(MdmStandardOntologies.W3C_SOSA)
      expect(Mdm.getArchetype('hardware.device')?.ontologyMapping?.w3cSosaTerm).toBe('sosa:System')
      expect(Mdm.getArchetype('virtual.keychain')?.ontologyMapping?.ontologyUri).toBe(MdmStandardOntologies.ISO_IEC_19770)
   })

   it('should create and validate a T-Shirt product variant with GS1 / Schema.org ontology mapping', () => {
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
         customCollar: 'V-Neck',
         ontologyMapping: TEXTILE_GARMENT_ONTOLOGY_DEFAULT
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
      expect(tshirtVariant.specifications.ontologyMapping?.gs1GpcCode).toBe('10000024')
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

   it('should support MediaDiskFormat ENUM and MediaDiskSpecInterface interface with Schema.org ontology', () => {
      const diskSpec: MediaDiskSpecInterface = {
         format: MediaDiskFormat.VINYL_12IN,
         durationSec: 2580,
         trackCount: 10,
         rpm: VinylRpm.RPM_33,
         catalogNumber: 'QT-VINYL-2026',
         ontologyMapping: MEDIA_DISK_ONTOLOGY_DEFAULT
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
      expect(vinylDisk.specifications.ontologyMapping?.schemaOrgType).toBe('https://schema.org/MusicAlbum')
   })
})
