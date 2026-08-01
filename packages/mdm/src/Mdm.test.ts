import { Mdm } from './Mdm'
import { MockMdmAdapter } from './MockMdmAdapter'
import { MdmObject } from './MdmObject'
import { MdmObjectTypeDefinition } from './MdmObjectType'

describe('@quatrain/mdm Pivot Class & Registry Test Suite', () => {
   beforeEach(() => {
      const adapter = new MockMdmAdapter('default')
      Mdm.addAdapter(adapter, 'default', true)
   })

   it('should register and retrieve MDM adapters via alias registry', () => {
      const adapter = Mdm.getAdapter('default')
      expect(adapter).toBeInstanceOf(MockMdmAdapter)
      expect(adapter.alias).toBe('default')
   })

   it('should register and retrieve physical, virtual, and service archetype definitions', () => {
      const physicalTypeDef: MdmObjectTypeDefinition = {
         archetypeId: 'device.probe',
         name: 'Probe IoT Device',
         nature: 'physical',
         collection: 'mdm.physical_units',
      }

      const virtualTypeDef: MdmObjectTypeDefinition = {
         archetypeId: 'keychain.network_access',
         name: 'Network Access Keychain',
         nature: 'virtual',
         collection: 'mdm.virtual_keychains',
      }

      const serviceTypeDef: MdmObjectTypeDefinition = {
         archetypeId: 'service.satellite_airtime',
         name: 'Satellite Airtime Subscription',
         nature: 'service',
         collection: 'mdm.services',
      }

      Mdm.registerObjectType(physicalTypeDef)
      Mdm.registerObjectType(virtualTypeDef)
      Mdm.registerObjectType(serviceTypeDef)

      expect(Mdm.getObjectType('device.probe')?.nature).toBe('physical')
      expect(Mdm.getObjectType('keychain.network_access')?.nature).toBe('virtual')
      expect(Mdm.getObjectType('service.satellite_airtime')?.nature).toBe('service')
   })

   it('should register custom PersistedBaseObject models for archetypes', () => {
      Mdm.registerModel('device.probe', MdmObject)
      expect(Mdm.getModel('device.probe')).toBe(MdmObject)
   })

   it('should instantiate MdmObject extending PersistedBaseObject with subcollection helper', () => {
      const obj = new MdmObject({
         uid: 'unit_123',
         name: 'Test Physical Device',
         archetypeId: 'device.probe',
         nature: 'physical',
         lifecycleState: 'AVAILABLE',
      } as any)

      expect(MdmObject.COLLECTION).toBe('mdm.objects')
      expect(obj.getSubcollectionName('keychains')).toBe('mdm.objects.unit_123.keychains')
   })
})
