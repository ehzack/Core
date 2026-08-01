# HOWTO: `@quatrain/mdm` Abstract Object & Archetype Usage

## 1. Defining a Concrete Object Class Extending `AbstractMdmObject`

```typescript
import { AbstractMdmObject, MdmArchetypeSpec } from '@quatrain/mdm';

// Example: Garment Textile Object
export class GarmentMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.garments'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.garment',
         name: 'Garment Textile Item',
         nature: 'physical',
         collection: GarmentMdmObject.COLLECTION,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand']
      }
   }
}

// Example: Audio/Video Media Disk Object
export class DiskMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.disks'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'media.disk',
         name: 'Audio/Video Media Disk',
         nature: 'physical',
         collection: DiskMdmObject.COLLECTION,
         requiredProperties: ['format', 'durationSec', 'trackCount'],
         optionalProperties: ['rpm', 'genre']
      }
   }
}
```

## 2. Registering Archetypes and Validating Specifications

```typescript
import { Mdm } from '@quatrain/mdm';

// Register Archetype Spec & Model with Pivot Manager
const garmentObj = new GarmentMdmObject({ name: 'Winter Coat' } as any);
Mdm.registerArchetype(garmentObj.getArchetypeSpec());
Mdm.registerModel('textile.garment', GarmentMdmObject);

// Instantiate & Validate
const jeans = GarmentMdmObject.fromObject({
   uid: 'garment_001',
   name: 'Blue Denim Jeans',
   archetypeId: 'textile.garment',
   nature: 'physical',
   specifications: {
      sizes: ['S', 'M', 'L'],
      colors: ['Blue'],
      materials: ['Cotton 100%']
   }
});

jeans.validateArchetypeSpecs(); // Returns true (throws MdmValidationError if required specs are missing)
```
