# HOWTO: `@quatrain/mdm` Usage Scenarios

## 1. Registering an Adapter and Archetype Definitions with Pivot Class `Mdm`

```typescript
import { Mdm, MockMdmAdapter, MdmObjectTypeDefinition } from '@quatrain/mdm';

// Register provider adapter
const adapter = new MockMdmAdapter('default');
Mdm.addAdapter(adapter, 'default', true);

// Register Physical Archetype Definition
Mdm.registerObjectType({
  archetypeId: 'device.probe',
  name: 'Probe IoT Device',
  nature: 'physical',
  collection: 'mdm.physical_units'
});

// Register Virtual Archetype Definition (Network Access Keychain)
Mdm.registerObjectType({
  archetypeId: 'keychain.network_access',
  name: 'Network Access Keychain',
  nature: 'virtual',
  collection: 'mdm.virtual_keychains'
});

// Register Managed Service Archetype Definition
Mdm.registerObjectType({
  archetypeId: 'service.satellite_airtime',
  name: 'Satellite Airtime Subscription',
  nature: 'service',
  collection: 'mdm.services'
});
```

## 2. Instantiating an Extensible `MdmObject` with Subcollections

```typescript
import { MdmObject } from '@quatrain/mdm';

// Create an MdmObject instance from raw data or backend
const deviceUnit = new MdmObject({
  uid: 'unit_probe_8c1f640001',
  name: 'Probe Unit #001',
  archetypeId: 'device.probe',
  nature: 'physical',
  lifecycleState: 'ASSOCIATED'
} as any);

// Get subcollection path for N child keychains or credentials attached to this parent unit
const keychainsCollection = deviceUnit.getSubcollectionName('keychains');
// Result: 'mdm.objects.unit_probe_8c1f640001.keychains'
```
