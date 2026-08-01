import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { MdmNature } from './enums/MdmEnums'
import { TextileGarmentSpecInterface, TEXTILE_GARMENT_ONTOLOGY_DEFAULT } from './domain/TextileDomain'
import { MediaDiskSpecInterface, MEDIA_DISK_ONTOLOGY_DEFAULT } from './domain/MediaDomain'
import { HardwareDeviceSpecInterface, HARDWARE_DEVICE_ONTOLOGY_DEFAULT } from './domain/HardwareDomain'
import { VirtualKeychainSpecInterface, VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT } from './domain/VirtualDomain'

/**
 * Concrete Garment MDM Object Class (Extends AbstractMdmObject)
 * Enforces standardized GS1/Schema.org ontology mapping & TextileGarmentSpecInterface.
 */
export class GarmentMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.garments'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.garment',
         name: 'Garment Textile Item',
         nature: MdmNature.PHYSICAL,
         collection: GarmentMdmObject.COLLECTION,
         ontologyMapping: TEXTILE_GARMENT_ONTOLOGY_DEFAULT,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand', 'weightGrams', 'fitType', 'ontologyMapping'],
      }
   }

   public get specifications(): TextileGarmentSpecInterface {
      return this.dataObject.val('specifications') as TextileGarmentSpecInterface
   }
}

/**
 * Concrete Audio/Video Disk MDM Object Class (Extends AbstractMdmObject)
 * Enforces standardized Schema.org/GS1 Media ontology mapping & MediaDiskSpecInterface.
 */
export class DiskMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.disks'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'media.disk',
         name: 'Audio/Video Media Disk',
         nature: MdmNature.PHYSICAL,
         collection: DiskMdmObject.COLLECTION,
         ontologyMapping: MEDIA_DISK_ONTOLOGY_DEFAULT,
         requiredProperties: ['format', 'durationSec', 'trackCount'],
         optionalProperties: ['rpm', 'genre', 'label', 'isrcCodes', 'catalogNumber', 'ontologyMapping'],
      }
   }

   public get specifications(): MediaDiskSpecInterface {
      return this.dataObject.val('specifications') as MediaDiskSpecInterface
   }
}

/**
 * Concrete Hardware IoT Device MDM Object Class (Extends AbstractMdmObject)
 * Enforces W3C SOSA / W3C WoT ontology mapping & HardwareDeviceSpecInterface.
 */
export class HardwareDeviceMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.devices'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'hardware.device',
         name: 'IoT Hardware Device / Probe',
         nature: MdmNature.PHYSICAL,
         collection: HardwareDeviceMdmObject.COLLECTION,
         ontologyMapping: HARDWARE_DEVICE_ONTOLOGY_DEFAULT,
         requiredProperties: ['serialNumber', 'commCapabilities'],
         optionalProperties: ['powerCapabilities', 'sensorBuses', 'firmwareVersion', 'hardwareRevision', 'ontologyMapping'],
      }
   }

   public get specifications(): HardwareDeviceSpecInterface {
      return this.dataObject.val('specifications') as HardwareDeviceSpecInterface
   }
}

/**
 * Concrete Virtual Keychain MDM Object Class (Extends AbstractMdmObject)
 * Enforces ISO/IEC 19770 ontology mapping & VirtualKeychainSpecInterface.
 */
export class VirtualKeychainMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.keychains'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'virtual.keychain',
         name: 'Network Access Keychain Credentials',
         nature: MdmNature.VIRTUAL,
         collection: VirtualKeychainMdmObject.COLLECTION,
         ontologyMapping: VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT,
         requiredProperties: ['authMechanism', 'targetNetwork'],
         optionalProperties: ['scopes', 'expiresAt', 'maxUsageCount', 'ontologyMapping'],
      }
   }

   public get specifications(): VirtualKeychainSpecInterface {
      return this.dataObject.val('specifications') as VirtualKeychainSpecInterface
   }
}
