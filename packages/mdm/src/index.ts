import { PersistedBaseObject, BaseRepository, DataObjectClass } from '@quatrain/backend';
import { BaseObjectType } from '@quatrain/core';

/**
 * Product Nature Classification
 * - 'physical': IoT Hardware, PCB, Sensors, Accessories, Enclosures.
 * - 'virtual': Network Access Keychains, API Tokens, Software Licenses, SIM APN Credentials.
 * - 'service': Managed Connectivity (LoRaWAN/Satellite/GSM airtime subscriptions), Maintenance Contracts, Calibration, Drone Missions.
 * - 'composite': Combined Hardware + Connectivity + Keychains + Services.
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
 * Product Variant Interface
 */
export interface MdmProductVariantData extends BaseObjectType {
  id?: string;
  name: string;
  collection?: string;
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
 * Physical / Virtual / Service Item Unit Interface
 */
export interface MdmPhysicalUnitData extends BaseObjectType {
  id?: string;
  name: string;
  collection?: string;
  variantId: string;
  serialNumber: string;
  lifecycleState: 'PLANNED' | 'ORDERED' | 'AVAILABLE' | 'ASSOCIATED' | 'MAINTENANCE' | 'KO' | 'SCRAPPED' | 'ACTIVE' | 'EXPIRED' | string;
  installedRealityId?: string;
  traitsData?: Record<string, unknown>;
}

/**
 * Physical Reality Interface
 */
export interface MdmPhysicalRealityData extends BaseObjectType {
  id?: string;
  name: string;
  collection?: string;
  kind: 'plot' | 'pond' | 'barn' | 'storage' | string;
  geometry?: Record<string, unknown>;
  lifecycleState?: string;
}

/**
 * Extensible Product Variant Class based on PersistedBaseObject
 */
export class MdmProductVariantModel extends PersistedBaseObject {
  static readonly COLLECTION = 'mdm.product_variants'
  static PROPS_DEFINITION = [
    { name: 'name', type: 'string', required: true },
    { name: 'templateId', type: 'string', required: true },
    { name: 'sku', type: 'string', required: true },
    { name: 'nature', type: 'string', required: true, default: 'physical' },
    { name: 'lifecycleState', type: 'string', required: true, default: 'production' },
    { name: 'traitsData', type: 'object', required: false, default: {} }
  ]

  constructor(dao: DataObjectClass<any>) {
    super(dao)
  }
}

/**
 * Extensible Physical / Virtual / Service Unit Class based on PersistedBaseObject
 * Supports subcollections (e.g. N keychains, N credentials or N sub-services attached to parent unit)
 */
export class MdmPhysicalUnitModel extends PersistedBaseObject {
  static readonly COLLECTION = 'mdm.physical_units'
  static PROPS_DEFINITION = [
    { name: 'name', type: 'string', required: true },
    { name: 'variantId', type: 'string', required: true },
    { name: 'serialNumber', type: 'string', required: true },
    { name: 'lifecycleState', type: 'string', required: true, default: 'AVAILABLE' },
    { name: 'installedRealityId', type: 'string', required: false },
    { name: 'traitsData', type: 'object', required: false, default: {} }
  ]

  constructor(dao: DataObjectClass<any>) {
    super(dao)
  }

  /**
   * Helper to query child subcollections attached to this parent unit
   * Collection scheme: mdm.physical_units.<parent_uid>.<subcollection_name>
   */
  public getSubcollectionName(subcollection: string): string {
    return `${MdmPhysicalUnitModel.COLLECTION}.${this.dataObject.uid}.${subcollection}`;
  }
}

/**
 * Extensible Physical Reality Class based on PersistedBaseObject
 */
export class MdmPhysicalRealityModel extends PersistedBaseObject {
  static readonly COLLECTION = 'mdm.realities'
  static PROPS_DEFINITION = [
    { name: 'name', type: 'string', required: true },
    { name: 'kind', type: 'string', required: true },
    { name: 'geometry', type: 'object', required: false },
    { name: 'lifecycleState', type: 'string', required: false }
  ]

  constructor(dao: DataObjectClass<any>) {
    super(dao)
  }
}

/**
 * Lightweight Child Subcollection Attachment Model for Extensible Attributes
 * (e.g. N network keychains or N services attached to a parent physical/virtual unit)
 */
export class MdmAttachedSubitemModel extends PersistedBaseObject {
  static readonly COLLECTION = 'mdm.subitems'
  static PARENT_PROP = 'parentUid'
  static PROPS_DEFINITION = [
    { name: 'name', type: 'string', required: true },
    { name: 'parentUid', type: 'string', required: true },
    { name: 'kind', type: 'string', required: true },
    { name: 'payload', type: 'object', required: false, default: {} }
  ]

  constructor(dao: DataObjectClass<any>) {
    super(dao)
  }
}

/**
 * Repositories
 */
export class MdmPhysicalUnitRepository extends BaseRepository<MdmPhysicalUnitData> {
  public static readonly COLLECTION_NAME = 'mdm.physical_units';
}

export class MdmProductVariantRepository extends BaseRepository<MdmProductVariantData> {
  public static readonly COLLECTION_NAME = 'mdm.product_variants';
}

export class MdmPhysicalRealityRepository extends BaseRepository<MdmPhysicalRealityData> {
  public static readonly COLLECTION_NAME = 'mdm.realities';
}

export type MdmProductVariant = MdmProductVariantData;
export type MdmPhysicalUnit = MdmPhysicalUnitData;
export type MdmPhysicalReality = MdmPhysicalRealityData;

export { PersistedBaseObject };
