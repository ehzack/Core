import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { MdmNature } from './enums/MdmEnums'
import { TextileGarmentSpecInterface, TEXTILE_GARMENT_ONTOLOGY_DEFAULT } from './domain/TextileDomain'
import { MediaDiskSpecInterface, MEDIA_DISK_ONTOLOGY_DEFAULT } from './domain/MediaDomain'
import { HardwareDeviceSpecInterface, HARDWARE_DEVICE_ONTOLOGY_DEFAULT } from './domain/HardwareDomain'
import { VirtualKeychainSpecInterface, VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT } from './domain/VirtualDomain'

/**
 * Concrete Garment MDM Object Class (Extends AbstractMdmObject)
 * Clean class name 'Garment' (derived concrete class without 'MdmObject' suffix).
 */
export class Garment extends AbstractMdmObject {
   static COLLECTION = 'garments'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.garment',
         name: 'Garment Textile Item',
         nature: MdmNature.PHYSICAL,
         collection: Garment.COLLECTION,
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
 * Clean class name 'Disk' (derived concrete class without 'MdmObject' suffix).
 */
export class Disk extends AbstractMdmObject {
   static COLLECTION = 'disks'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'media.disk',
         name: 'Audio/Video Media Disk',
         nature: MdmNature.PHYSICAL,
         collection: Disk.COLLECTION,
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
 * Clean class name 'HardwareDevice' (derived concrete class without 'MdmObject' suffix).
 */
export class HardwareDevice extends AbstractMdmObject {
   static COLLECTION = 'devices'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'hardware.device',
         name: 'IoT Hardware Device / Probe',
         nature: MdmNature.PHYSICAL,
         collection: HardwareDevice.COLLECTION,
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
 * Clean class name 'VirtualKeychain' (derived concrete class without 'MdmObject' suffix).
 */
export class VirtualKeychain extends AbstractMdmObject {
   static COLLECTION = 'keychains'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'virtual.keychain',
         name: 'Network Access Keychain Credentials',
         nature: MdmNature.VIRTUAL,
         collection: VirtualKeychain.COLLECTION,
         ontologyMapping: VIRTUAL_KEYCHAIN_ONTOLOGY_DEFAULT,
         requiredProperties: ['authMechanism', 'targetNetwork'],
         optionalProperties: ['scopes', 'expiresAt', 'maxUsageCount', 'ontologyMapping'],
      }
   }

   public get specifications(): VirtualKeychainSpecInterface {
      return this.dataObject.val('specifications') as VirtualKeychainSpecInterface
   }
}
