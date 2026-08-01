import { AbstractMdmObject } from './AbstractMdmObject'
import { MdmArchetypeSpec } from './MdmArchetypeSpec'
import { DataObjectClass } from '@quatrain/backend'

/**
 * Concrete Garment MDM Object Class (Extends AbstractMdmObject)
 * Specifications: sizes, colors, materials, washCare.
 */
export class GarmentMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.garments'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.garment',
         name: 'Garment Textile Item',
         nature: 'physical',
         collection: GarmentMdmObject.COLLECTION,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand'],
      }
   }
}

/**
 * Concrete Audio/Video Disk MDM Object Class (Extends AbstractMdmObject)
 * Specifications: format (vinyl/cd/dvd), durationSec, trackCount, rpm.
 */
export class DiskMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.disks'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'media.disk',
         name: 'Audio/Video Media Disk',
         nature: 'physical',
         collection: DiskMdmObject.COLLECTION,
         requiredProperties: ['format', 'durationSec', 'trackCount'],
         optionalProperties: ['rpm', 'genre', 'label'],
      }
   }
}

/**
 * Concrete Hardware IoT Device MDM Object Class (Extends AbstractMdmObject)
 * Specifications: serialNumber, commCapabilities, powerCapabilities, sensorBuses.
 */
export class HardwareDeviceMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.devices'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'hardware.device',
         name: 'IoT Hardware Device / Probe',
         nature: 'physical',
         collection: HardwareDeviceMdmObject.COLLECTION,
         requiredProperties: ['serialNumber', 'commCapabilities'],
         optionalProperties: ['powerCapabilities', 'sensorBuses'],
      }
   }
}

/**
 * Concrete Virtual Keychain MDM Object Class (Extends AbstractMdmObject)
 * Specifications: authMechanism, targetNetwork, scopes, expiresAt.
 */
export class VirtualKeychainMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.keychains'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'virtual.keychain',
         name: 'Network Access Keychain Credentials',
         nature: 'virtual',
         collection: VirtualKeychainMdmObject.COLLECTION,
         requiredProperties: ['authMechanism', 'targetNetwork'],
         optionalProperties: ['scopes', 'expiresAt'],
      }
   }
}
