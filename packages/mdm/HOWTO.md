# HOWTO: `@quatrain/mdm` — Step-by-Step Guide: Creating a T-Shirt Product Variant & Inventory Unit

This guide demonstrates how to create a concrete **T-Shirt** garment product using `@quatrain/mdm` with standardized ENUMs, extensible interfaces, archetype specification validation, and subcollections.

---

## 1. Define the Concrete `TShirtMdmObject` Model Class

Extend `AbstractMdmObject` and define the mandatory `getArchetypeSpec()` schema specifying required and optional properties:

```typescript
import { 
   AbstractMdmObject, 
   MdmArchetypeSpec, 
   MdmNature, 
   TextileGarmentSpecInterface 
} from '@quatrain/mdm';

/**
 * Concrete T-Shirt MDM Object Model
 */
export class TShirtMdmObject extends AbstractMdmObject {
   static COLLECTION = 'mdm.garments.tshirts'

   getArchetypeSpec(): MdmArchetypeSpec {
      return {
         archetypeId: 'textile.tshirt',
         name: 'Organic Cotton T-Shirt',
         nature: MdmNature.PHYSICAL,
         collection: TShirtMdmObject.COLLECTION,
         requiredProperties: ['sizes', 'colors', 'materials'],
         optionalProperties: ['washCare', 'brand', 'weightGrams', 'fitType']
      }
   }

   public get specifications(): TextileGarmentSpecInterface {
      return this.dataObject.val('specifications') as TextileGarmentSpecInterface
   }
}
```

---

## 2. Register Provider Adapter & Archetype with Pivot Class `Mdm`

Centralize registry initialization via `Mdm`:

```typescript
import { Mdm, MockMdmAdapter } from '@quatrain/mdm';

// Register provider adapter
Mdm.addAdapter(new MockMdmAdapter('default'), 'default', true);

// Register T-Shirt Archetype Spec & Model Class
const tshirtSample = new TShirtMdmObject({ name: 'T-Shirt Archetype' } as any);
Mdm.registerArchetype(tshirtSample.getArchetypeSpec());
Mdm.registerModel('textile.tshirt', TShirtMdmObject);
```

---

## 3. Instantiate & Validate a T-Shirt Product Variant

Use standardized ENUMs (`GarmentSize.SMALL`, `GarmentSize.MEDIUM`, `GarmentSize.LARGE`, `TextileColor`, `TextileMaterial`, `TextileWashCare`) and extend the interface with custom properties (`customCollar`):

```typescript
import { 
   GarmentSize, 
   TextileColor, 
   TextileMaterial, 
   TextileWashCare, 
   TextileGarmentSpecInterface,
   MdmNature
} from '@quatrain/mdm';

// 1. Build standardized and extended specifications
const tshirtSpec: TextileGarmentSpecInterface = {
   sizes: [GarmentSize.SMALL, GarmentSize.MEDIUM, GarmentSize.LARGE, GarmentSize.EXTRA_LARGE],
   colors: [TextileColor.NAVY_BLUE, TextileColor.WHITE, TextileColor.BLACK],
   materials: [TextileMaterial.ORGANIC_COTTON, TextileMaterial.ELASTANE],
   washCare: [TextileWashCare.WASH_30C, TextileWashCare.NO_BLEACH, TextileWashCare.IRON_MEDIUM],
   brand: 'Quatrain EcoWear',
   weightGrams: 180,
   fitType: 'regular',
   customCollar: 'V-Neck' // Extensible property!
};

// 2. Instantiate T-Shirt Product Variant
const tshirtVariant = TShirtMdmObject.fromObject({
   uid: 'tshirt_organic_vneck_navy',
   name: 'Quatrain Organic V-Neck T-Shirt (Navy)',
   archetypeId: 'textile.tshirt',
   nature: MdmNature.PHYSICAL,
   lifecycleState: 'production',
   specifications: tshirtSpec
});

// 3. Validate specifications against required archetype properties
tshirtVariant.validateArchetypeSpecs(); // Returns true
console.log(tshirtVariant.specifications.colors); // ['navy_blue', 'white', 'black']
```

---

## 4. Instantiate a Physical Inventory Unit & Attach Subcollections

Create an individual physical unit (serialized item or SKU instance) and manage $N$ child subcollections (*GOTS certifications, QR codes, care tags*):

```typescript
// Create an individual physical unit instance
const tshirtUnit = TShirtMdmObject.fromObject({
   uid: 'unit_tshirt_sn_2026_0042',
   name: 'Quatrain T-Shirt - Size Medium Navy',
   archetypeId: 'textile.tshirt',
   parentUid: tshirtVariant.dataObject.uid,
   nature: MdmNature.PHYSICAL,
   lifecycleState: 'AVAILABLE',
   specifications: {
      selectedSize: GarmentSize.MEDIUM,
      selectedColor: TextileColor.NAVY_BLUE,
      barcode: '3760000000042'
   }
});

// Resolve child subcollection path for N attached certifications / tags
const certificationsCollection = tshirtUnit.getSubcollectionName('certifications');
// Result: 'mdm.garments.tshirts.unit_tshirt_sn_2026_0042.certifications'
```
