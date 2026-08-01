# HOWTO: `@quatrain/mdm` Usage Scenarios

## 1. Creating a Product Variant with Multi-Axis Hardware Capabilities

```typescript
import { MdmProductVariant } from '@quatrain/mdm';

const hybridProbeVariant: MdmProductVariant = {
  id: 'dev_pcb_probe_v2_hybrid',
  collection: 'mdm.product_variants',
  templateId: 'template_brad_probe',
  sku: 'BRAD-PHY-PCB-HYBRID-01',
  name: 'PCB Motherboard Probe V2 Hybrid',
  nature: 'physical',
  lifecycleState: 'production',
  validationPolicy: 'strict',
  traitsData: {
    hardwareCapabilities: {
      commCapabilities: [
        {
          technology: 'lorawan_terrestrial',
          frequencyBands: ['EU868', 'US915']
        },
        {
          technology: 'lorawan_satellite',
          modulation: 'LR-FHSS'
        },
        {
          technology: 'cellular_gsm',
          networkTypes: ['LTE-M', 'NB-IoT']
        }
      ],
      powerCapabilities: {
        sources: ['solar_mppt', 'primary_lithium'],
        solarMaxWattage: 5,
        batteryType: 'LiSOCl2_3.6V'
      },
      sensorBusCapabilities: {
        buses: ['SDI-12', 'RS485_Modbus', 'I2C'],
        pulseCounterChannels: 2,
        analogChannels: 4
      }
    }
  }
};
```

## 2. Instantiating a Physical Unit Linked to a Reality

```typescript
import { MdmPhysicalUnit } from '@quatrain/mdm';

const probeUnit: MdmPhysicalUnit = {
  id: 'unit_probe_8c1f640001',
  collection: 'mdm.physical_units',
  variantId: 'dev_pcb_probe_v2_hybrid',
  serialNumber: 'SN-BRAD-2026-001',
  lifecycleState: 'ASSOCIATED',
  installedRealityId: 'plot_parcelle_42',
  traitsData: {
    macAddress: '8C:1F:64:00:00:01',
    devEui: '8C1F640000000001'
  }
};
```
