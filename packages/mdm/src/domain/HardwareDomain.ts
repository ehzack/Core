import { OntologyMappingInterface, MdmStandardOntologies } from './OntologyDomain'

/**
 * Standard Radio & Communication Technologies
 */
export enum CommTechnology {
   LORAWAN_TERRESTRIAL = 'lorawan_terrestrial',
   LORAWAN_SATELLITE = 'lorawan_satellite',
   CELLULAR_GSM = 'cellular_gsm',
   BLE = 'ble',
   WIFI = 'wifi',
   HYBRID_FALLBACK = 'hybrid_fallback',
}

/**
 * Standard Power Sources
 */
export enum PowerSource {
   SOLAR_MPPT = 'solar_mppt',
   PRIMARY_LITHIUM = 'primary_lithium',
   RECHARGEABLE_LIION = 'rechargeable_liion',
   EXTERNAL_MAINS = 'external_mains',
}

/**
 * Standard Sensor Buses
 */
export enum SensorBus {
   SDI12 = 'SDI-12',
   RS485_MODBUS = 'RS485_Modbus',
   I2C = 'I2C',
   ONE_WIRE = '1-Wire',
   SPI = 'SPI',
}

/**
 * Standard Recognized W3C SOSA / W3C WoT / GS1 Hardware Ontology Mapping
 */
export const HARDWARE_DEVICE_ONTOLOGY_DEFAULT: OntologyMappingInterface = {
   ontologyUri: MdmStandardOntologies.W3C_SOSA,
   w3cSosaTerm: 'sosa:System',
   w3cWotType: 'wot:Thing',
   schemaOrgType: 'https://schema.org/Product',
   gs1GpcCode: '60000000', // GS1 GPC Brick Code: IT & Telecom Hardware
}

/**
 * Standardized and Extensible Hardware IoT Device Specification Interface (ends with 'Interface')
 */
export interface HardwareDeviceSpecInterface extends Record<string, unknown> {
   serialNumber: string
   commCapabilities: Array<CommTechnology | string>
   powerCapabilities?: Array<PowerSource | string>
   sensorBuses?: Array<SensorBus | string>
   firmwareVersion?: string
   hardwareRevision?: string
   macAddress?: string
   devEui?: string
   ontologyMapping?: OntologyMappingInterface
}
