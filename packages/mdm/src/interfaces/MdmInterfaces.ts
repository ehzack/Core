import { 
   MdmNature, 
   MdmCommTechnology, 
   MdmPowerSource, 
   MdmSensorBus, 
   MdmMediaDiskFormat, 
   MdmAuthMechanism, 
   MdmServiceCategory 
} from '../enums/MdmEnums'

/**
 * Standardized Communication Capability Interface
 */
export interface MdmCommCapabilityInterface {
   technology: MdmCommTechnology | string
   frequencyBands?: string[]
   modulation?: string
   networkTypes?: string[]
   simFormat?: string;
   strategy?: string;
   primary?: string;
   secondary?: string;
   tertiary?: string;
}

/**
 * Standardized Power Capability Interface
 */
export interface MdmPowerCapabilityInterface {
   sources: Array<MdmPowerSource | string>
   solarMaxWattage?: number
   batteryType?: string
}

/**
 * Standardized Sensor Bus Capability Interface
 */
export interface MdmSensorBusCapabilityInterface {
   buses: Array<MdmSensorBus | string>
   pulseCounterChannels?: number
   analogChannels?: number
}

/**
 * Standardized Hardware Capabilities Matrix Interface
 */
export interface MdmHardwareCapabilitiesInterface {
   commCapabilities?: MdmCommCapabilityInterface[]
   powerCapabilities?: MdmPowerCapabilityInterface
   sensorBusCapabilities?: MdmSensorBusCapabilityInterface
}

/**
 * Standardized Virtual Product Capabilities Interface
 */
export interface MdmVirtualCapabilitiesInterface {
   authMechanism?: MdmAuthMechanism | string
   targetNetwork?: string
   maxUsageCount?: number
   expiresAt?: string
   scopes?: string[]
}

/**
 * Standardized Service Capabilities Interface
 */
export interface MdmServiceCapabilitiesInterface {
   serviceCategory: MdmServiceCategory | string
   slaHours?: number
   billingPeriod?: 'monthly' | 'annual' | 'pay_per_use' | string
   dataCapMb?: number
}

/**
 * Standardized Garment Specifications Interface
 */
export interface MdmGarmentSpecificationsInterface {
   sizes: string[]
   colors: string[]
   materials: string[]
   washCare?: string
   brand?: string
}

/**
 * Standardized Disk Specifications Interface
 */
export interface MdmDiskSpecificationsInterface {
   format: MdmMediaDiskFormat | string
   durationSec: number
   trackCount: number
   rpm?: number
   genre?: string
   label?: string
}
