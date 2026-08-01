/**
 * Standardized MDM Product Natures
 */
export enum MdmNature {
   PHYSICAL = 'physical',
   VIRTUAL = 'virtual',
   SERVICE = 'service',
   COMPOSITE = 'composite',
}

/**
 * Standardized MDM Lifecycle States
 */
export enum MdmLifecycleState {
   RND_CONCEPT = 'rnd_concept',
   PROTOTYPE = 'prototype',
   VALIDATION = 'validation',
   PRODUCTION = 'production',
   PLANNED = 'PLANNED',
   ORDERED = 'ORDERED',
   AVAILABLE = 'AVAILABLE',
   ASSOCIATED = 'ASSOCIATED',
   ACTIVE = 'ACTIVE',
   MAINTENANCE = 'MAINTENANCE',
   EXPIRED = 'EXPIRED',
   KO = 'KO',
   SCRAPPED = 'SCRAPPED',
   END_OF_LIFE = 'end_of_life',
}

/**
 * Standardized Radio & Communication Technologies
 */
export enum MdmCommTechnology {
   LORAWAN_TERRESTRIAL = 'lorawan_terrestrial',
   LORAWAN_SATELLITE = 'lorawan_satellite',
   CELLULAR_GSM = 'cellular_gsm',
   BLE = 'ble',
   WIFI = 'wifi',
   HYBRID_FALLBACK = 'hybrid_fallback',
}

/**
 * Standardized Electrical Power Sources
 */
export enum MdmPowerSource {
   SOLAR_MPPT = 'solar_mppt',
   PRIMARY_LITHIUM = 'primary_lithium',
   RECHARGEABLE_LIION = 'rechargeable_liion',
   EXTERNAL_MAINS = 'external_mains',
}

/**
 * Standardized Sensor & Input Buses
 */
export enum MdmSensorBus {
   SDI12 = 'SDI-12',
   RS485_MODBUS = 'RS485_Modbus',
   I2C = 'I2C',
   ONE_WIRE = '1-Wire',
   SPI = 'SPI',
}

/**
 * Standardized Audio / Video Media Formats
 */
export enum MdmMediaDiskFormat {
   VINYL_7IN = 'vinyl_7in',
   VINYL_12IN = 'vinyl_12in',
   CD = 'compact_disc',
   SACD = 'super_audio_cd',
   DVD = 'dvd',
   BLURAY = 'bluray',
   CASSETTE = 'cassette',
}

/**
 * Standardized Authentication & Key Mechanisms for Virtual Products
 */
export enum MdmAuthMechanism {
   BEARER_TOKEN = 'bearer_token',
   JWT = 'jwt',
   OAUTH2 = 'oauth2',
   X509_CERTIFICATE = 'x509_certificate',
   APN_KEYCHAIN = 'apn_keychain',
   SSH_KEY = 'ssh_key',
}

/**
 * Standardized Managed Service Categories
 */
export enum MdmServiceCategory {
   CONNECTIVITY_AIRTIME = 'connectivity_airtime',
   SATELLITE_DATA_PASS = 'satellite_data_pass',
   HARDWARE_MAINTENANCE = 'hardware_maintenance',
   SENSOR_CALIBRATION = 'sensor_calibration',
   DRONE_SCOUTING = 'drone_scouting',
}
