/**
 * Standard Garment Sizes (Full explicit terms, no single-letter abbreviations)
 */
export enum GarmentSize {
   EXTRA_EXTRA_SMALL = 'XXS',
   EXTRA_SMALL = 'XS',
   SMALL = 'Small',
   MEDIUM = 'Medium',
   LARGE = 'Large',
   EXTRA_LARGE = 'Extra-Large',
   DOUBLE_EXTRA_LARGE = '2XL',
   TRIPLE_EXTRA_LARGE = '3XL',
   ONE_SIZE = 'One-Size',
}

/**
 * Standard Textile Colors
 */
export enum TextileColor {
   BLACK = 'black',
   WHITE = 'white',
   NAVY_BLUE = 'navy_blue',
   ROYAL_BLUE = 'royal_blue',
   RED = 'red',
   GREEN = 'green',
   YELLOW = 'yellow',
   GREY = 'grey',
   BEIGE = 'beige',
   BROWN = 'brown',
   CUSTOM = 'custom',
}

/**
 * Standard Textile Materials
 */
export enum TextileMaterial {
   COTTON = 'cotton',
   ORGANIC_COTTON = 'organic_cotton',
   POLYESTER = 'polyester',
   RECYCLED_POLYESTER = 'recycled_polyester',
   ELASTANE = 'elastane',
   WOOL = 'wool',
   LINEN = 'linen',
   NYLON = 'nylon',
   SILK = 'silk',
}

/**
 * Standard Textile Wash Care Directives
 */
export enum TextileWashCare {
   WASH_30C = 'wash_30c',
   WASH_40C = 'wash_40c',
   HAND_WASH = 'hand_wash',
   NO_BLEACH = 'no_bleach',
   TUMBLE_DRY_LOW = 'tumble_dry_low',
   DO_NOT_TUMBLE_DRY = 'do_not_tumble_dry',
   IRON_MEDIUM = 'iron_medium',
   DRY_CLEAN = 'dry_clean',
}

/**
 * Standardized and Extensible Textile Garment Specification Interface (ends with 'Interface')
 */
export interface TextileGarmentSpecInterface extends Record<string, unknown> {
   sizes: Array<GarmentSize | string>
   colors: Array<TextileColor | string>
   materials: Array<TextileMaterial | string>
   washCare?: Array<TextileWashCare | string>
   brand?: string
   weightGrams?: number
   fitType?: 'slim' | 'regular' | 'relaxed' | string
}
