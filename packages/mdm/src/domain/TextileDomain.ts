/**
 * Standard Garment Sizes
 */
export enum GarmentSize {
   XXS = 'XXS',
   XS = 'XS',
   S = 'S',
   M = 'M',
   L = 'L',
   XL = 'XL',
   XXL = 'XXL',
   XXXL = '3XL',
   ONE_SIZE = 'one_size',
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
 * Standardized and Extensible Textile Garment Specification Interface
 */
export interface ITextileGarmentSpec extends Record<string, unknown> {
   sizes: Array<GarmentSize | string>
   colors: Array<TextileColor | string>
   materials: Array<TextileMaterial | string>
   washCare?: Array<TextileWashCare | string>
   brand?: string
   weightGrams?: number
   fitType?: 'slim' | 'regular' | 'relaxed' | string
}
