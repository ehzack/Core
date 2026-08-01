import { PersistedBaseObject, BaseRepository } from '@quatrain/backend';
import { BaseObjectType } from '@quatrain/core';

/**
 * Product Nature Classification
 * - 'physical': IoT Hardware, PCB, Sensors, Accessories, Enclosures.
 * - 'virtual': Network Access Keychains, API Tokens, Software Licenses, SIM APN Credentials.
 * - 'service': Managed Connectivity (LoRaWAN/Satellite/GSM airtime), Maintenance Contracts, Calibration, Drone Missions.
 * - 'composite': Combined Hardware + Connectivity + Virtual Keychain + Service Bundles.
 */
export type MdmProductNature = 'physical' | 'virtual' | 'service' | 'composite';

/**
 * Multi-Axis Communication Radio Capability (Physical Hardware Axis)
 */
export interface CommCapability {
  technology: 'lorawan_terrestrial' | 'lorawan_satellite' | 'cellular_gsm' | 'ble' | 'wifi' | 'hybrid_fallback';
  frequencyBands?: string[];
  modulation?: string;
  networkTypes?: string[];
  simFormat?: string;
  strategy?: string;
  primary?: string;
  secondary?: string;
  tertiary?: string;
}

/**
 * Multi-Axis Electrical Power Capability (Physical Hardware Axis)
 */
export interface PowerCapabilities {
  sources: Array<'solar_mppt' | 'primary_lithium' | 'rechargeable_liion' | 'external_mains'>;
  solarMaxWattage?: number;
  batteryType?: string;
}

/**
 * Multi-Axis Sensor Bus & Input Capability (Physical Hardware Axis)
 */
export interface SensorBusCapabilities {
  buses: Array<'SDI-12' | 'RS485_Modbus' | 'I2C' | '1-Wire' | 'SPI'>;
  pulseCounterChannels?: number;
  analogChannels?: number;
}

/**
 * Hardware Capabilities Trait (Combinatorial Capabilities Matrix for Physical Products)
 */
export interface HardwareCapabilitiesTrait {
  commCapabilities?: CommCapability[];
  powerCapabilities?: PowerCapabilities;
  sensorBusCapabilities?: SensorBusCapabilities;
}

/**
 * Virtual Product Capabilities Trait (Digital Keychains, Access Tokens, Credentials, Licenses)
 */
export interface VirtualCapabilitiesTrait {
  authMechanism?: 'bearer_token' | 'jwt' | 'oauth2' | 'x509_certificate' | 'apn_keychain' | 'ssh_key';
  targetNetwork?: string; // e.g. 'chirpstack_wss', 'mattermost', 'sentinel_copernicus', 'accuweather'
  maxUsageCount?: number;
  expiresAt?: string;
  scopes?: string[];
}

/**
 * Service Capabilities Trait (Connectivity Plans, Maintenance, Airtime, Field Missions)
 */
export interface ServiceCapabilitiesTrait {
  serviceCategory: 'connectivity_airtime' | 'satellite_data_pass' | 'hardware_maintenance' | 'sensor_calibration' | 'drone_scouting';
  slaHours?: number;
  billingPeriod?: 'monthly' | 'annual' | 'pay_per_use';
  dataCapMb?: number;
}

/**
 * Product Variant (Collection: 'mdm.product_variants')
 */
export interface MdmProductVariant extends BaseObjectType {
  id?: string;
  name: string;
  collection?: 'mdm.product_variants';
  templateId: string;
  sku: string;
  nature: MdmProductNature;
  traitsData: {
    hardwareCapabilities?: HardwareCapabilitiesTrait;
    virtualCapabilities?: VirtualCapabilitiesTrait;
    serviceCapabilities?: ServiceCapabilitiesTrait;
    logistics?: Record<string, unknown>;
    [key: string]: unknown;
  };
  lifecycleState: 'rnd_concept' | 'prototype' | 'validation' | 'production' | 'maintenance' | 'end_of_life' | string;
  validationPolicy?: 'lax' | 'strict';
}

/**
 * Physical or Virtual Manufactured Unit / Active Service Subscriptions (Collection: 'mdm.physical_units')
 */
export interface MdmPhysicalUnit extends BaseObjectType {
  id?: string;
  name: string;
  collection?: 'mdm.physical_units';
  variantId: string;
  serialNumber: string; // Serial number or Keychain Unique UUID
  lifecycleState: 'PLANNED' | 'ORDERED' | 'AVAILABLE' | 'ASSOCIATED' | 'MAINTENANCE' | 'KO' | 'SCRAPPED' | 'ACTIVE' | 'EXPIRED' | string;
  installedRealityId?: string;
  traitsData?: Record<string, unknown>;
}

/**
 * Physical Reality (Collection: 'mdm.realities')
 */
export interface MdmPhysicalReality extends BaseObjectType {
  id?: string;
  name: string;
  collection?: 'mdm.realities';
  kind: 'plot' | 'pond' | 'barn' | 'storage' | string;
  geometry?: Record<string, unknown>;
  lifecycleState?: string;
}

/**
 * Abstract MDM Unit & Service Repository
 */
export class MdmPhysicalUnitRepository extends BaseRepository<MdmPhysicalUnit> {
  public static readonly COLLECTION_NAME = 'mdm.physical_units';
}

/**
 * Abstract MDM Product Variant Repository
 */
export class MdmProductVariantRepository extends BaseRepository<MdmProductVariant> {
  public static readonly COLLECTION_NAME = 'mdm.product_variants';
}

/**
 * Abstract MDM Physical Reality Repository
 */
export class MdmPhysicalRealityRepository extends BaseRepository<MdmPhysicalReality> {
  public static readonly COLLECTION_NAME = 'mdm.realities';
}

export { PersistedBaseObject };
