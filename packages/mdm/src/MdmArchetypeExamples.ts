import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { MdmNature } from './enums/MdmEnums'
import { TextileGarmentSpecInterface } from './domain/TextileDomain'
import { MediaDiskSpecInterface } from './domain/MediaDomain'
import { HardwareDeviceSpecInterface } from './domain/HardwareDomain'
import { VirtualKeychainSpecInterface } from './domain/VirtualDomain'

/**
 * Concrete Garment MDM Object Class (Extends AbstractMdmObject)
 * Enforces standardized and extensible TextileGarmentSpecInterface (sizes, colors, materials, etc.).
 */
export class GarmentMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.garments'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.garment',
         name: 'Garment Textile Item',
         nature: MdmNature.PHYSICAL,
         collection: GarmentMdmObject.COLLECTION,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand', 'weightGrams', 'fitType'],
      }
   }

   public get specifications(): TextileGarmentSpecInterface {
      return this.dataObject.val('specifications') as TextileGarmentSpecInterface
   }
}

/**
 * Concrete Audio/Video Disk MDM Object Class (Extends AbstractMdmObject)
 * Enforces standardized and extensible MediaDiskSpecInterface (format, durationSec, trackCount, etc.).
 */
export class DiskMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.disks'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'media.disk',
         name: 'Audio/Video Media Disk',
         nature: MdmNature.PHYSICAL,
         collection: DiskMdmObject.COLLECTION,
         requiredProperties: ['format', 'durationSec', 'trackCount'],
         optionalProperties: ['rpm', 'genre', 'label', 'isrcCodes', 'catalogNumber'],
      }
   }

   public get specifications(): MediaDiskSpecInterface {
      return this.dataObject.val('specifications') as MediaDiskSpecInterface
   }
}

/**
 * Concrete Hardware IoT Device MDM Object Class (Extends AbstractMdmObject)
 * Enforces standardized and extensible HardwareDeviceSpecInterface (serialNumber, commCapabilities, etc.).
 */
export class HardwareDeviceMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.devices'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'hardware.device',
         name: 'IoT Hardware Device / Probe',
         nature: MdmNature.PHYSICAL,
         collection: HardwareDeviceMdmObject.COLLECTION,
         requiredProperties: ['serialNumber', 'commCapabilities'],
         optionalProperties: ['powerCapabilities', 'sensorBuses', 'firmwareVersion', 'hardwareRevision'],
      }
   }

   public get specifications(): HardwareDeviceSpecInterface {
      return this.dataObject.val('specifications') as HardwareDeviceSpecInterface
   }
}

/**
 * Concrete Virtual Keychain MDM Object Class (Extends AbstractMdmObject)
 * Enforces standardized and extensible VirtualKeychainSpecInterface (authMechanism, targetNetwork, etc.).
 */
export class VirtualKeychainMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.keychains'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'virtual.keychain',
         name: 'Network Access Keychain Credentials',
         nature: MdmNature.VIRTUAL,
         collection: VirtualKeychainMdmObject.COLLECTION,
         requiredProperties: ['authMechanism', 'targetNetwork'],
         optionalProperties: ['scopes', 'expiresAt', 'maxUsageCount'],
      }
   }

   public get specifications(): VirtualKeychainSpecInterface {
      return this.dataObject.val('specifications') as VirtualKeychainSpecInterface
   }
}
