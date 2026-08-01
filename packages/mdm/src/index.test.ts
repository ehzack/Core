import { MdmProductVariant, MdmPhysicalUnit, MdmPhysicalReality } from './index';

describe('@quatrain/mdm Universal Product & Service MDM Test Suite', () => {
  it('should instantiate a valid Physical Product Variant with Multi-Axis Hardware Capabilities', () => {
    const variant: MdmProductVariant = {
      id: 'variant_hybrid_probe',
      name: 'Probe V2 Hybrid Motherboard',
      collection: 'mdm.product_variants',
      templateId: 'template_brad_probe',
      sku: 'BRAD-PHY-PCB-HYBRID-01',
      nature: 'physical',
      lifecycleState: 'production',
      traitsData: {
        hardwareCapabilities: {
          commCapabilities: [
            { technology: 'lorawan_terrestrial', frequencyBands: ['EU868'] },
            { technology: 'lorawan_satellite', modulation: 'LR-FHSS' },
            { technology: 'cellular_gsm', networkTypes: ['LTE-M'] }
          ],
          powerCapabilities: {
            sources: ['solar_mppt', 'primary_lithium'],
            solarMaxWattage: 5
          },
          sensorBusCapabilities: {
            buses: ['SDI-12', 'RS485_Modbus']
          }
        }
      }
    };

    expect(variant.nature).toBe('physical');
    expect(variant.traitsData.hardwareCapabilities?.commCapabilities?.length).toBe(3);
  });

  it('should instantiate a valid Virtual Product Variant (Network Access Keychain / Credentials)', () => {
    const virtualKeychainVariant: MdmProductVariant = {
      id: 'variant_keychain_lorawan_wss',
      name: 'ChirpStack WSS TLS Network Access Keychain',
      collection: 'mdm.product_variants',
      templateId: 'template_network_keychain',
      sku: 'BRAD-VIR-KEYCHAIN-WSS-01',
      nature: 'virtual',
      lifecycleState: 'production',
      traitsData: {
        virtualCapabilities: {
          authMechanism: 'x509_certificate',
          targetNetwork: 'chirpstack_wss',
          scopes: ['gateway:connect', 'telemetry:publish']
        }
      }
    };

    expect(virtualKeychainVariant.nature).toBe('virtual');
    expect(virtualKeychainVariant.traitsData.virtualCapabilities?.authMechanism).toBe('x509_certificate');
  });

  it('should instantiate a valid Managed Service Variant (Satellite Airtime / Maintenance)', () => {
    const serviceVariant: MdmProductVariant = {
      id: 'variant_service_sat_airtime',
      name: 'Direct-to-Satellite Annual Data Subscription',
      collection: 'mdm.product_variants',
      templateId: 'template_service_subscription',
      sku: 'BRAD-SRV-SAT-AIRTIME-1Y',
      nature: 'service',
      lifecycleState: 'production',
      traitsData: {
        serviceCapabilities: {
          serviceCategory: 'satellite_data_pass',
          billingPeriod: 'annual',
          slaHours: 24,
          dataCapMb: 500
        }
      }
    };

    expect(serviceVariant.nature).toBe('service');
    expect(serviceVariant.traitsData.serviceCapabilities?.serviceCategory).toBe('satellite_data_pass');
  });

  it('should instantiate a Physical Unit and a Virtual Keychain Unit', () => {
    const probeUnit: MdmPhysicalUnit = {
      id: 'unit_probe_001',
      name: 'Probe Unit #001',
      collection: 'mdm.physical_units',
      variantId: 'variant_hybrid_probe',
      serialNumber: 'SN-2026-001',
      lifecycleState: 'ASSOCIATED',
      installedRealityId: 'plot_parcelle_42'
    };

    const keychainUnit: MdmPhysicalUnit = {
      id: 'keychain_unit_001',
      name: 'Site Gateway X509 Keychain',
      collection: 'mdm.physical_units',
      variantId: 'variant_keychain_lorawan_wss',
      serialNumber: 'KEYCHAIN-MAS-BAUDOUIN-01',
      lifecycleState: 'ACTIVE',
      installedRealityId: 'plot_parcelle_42'
    };

    expect(probeUnit.lifecycleState).toBe('ASSOCIATED');
    expect(keychainUnit.lifecycleState).toBe('ACTIVE');
  });
});
