import { OntologyMappingInterface, MdmStandardOntologies } from './OntologyDomain'

/**
 * Standard Audio / Video Disk Formats
 */
export enum MediaDiskFormat {
   VINYL_7IN = 'vinyl_7in',
   VINYL_10IN = 'vinyl_10in',
   VINYL_12IN = 'vinyl_12in',
   COMPACT_DISC = 'compact_disc',
   SUPER_AUDIO_CD = 'super_audio_cd',
   DVD = 'dvd',
   BLURAY = 'bluray',
   BLURAY_4K = 'bluray_4k',
   CASSETTE = 'cassette',
}

/**
 * Standard Media RPM Speeds
 */
export enum VinylRpm {
   RPM_33 = 33,
   RPM_45 = 45,
   RPM_78 = 78,
}

/**
 * Standard Recognized Schema.org / GS1 Media Ontology Mapping
 */
export const MEDIA_DISK_ONTOLOGY_DEFAULT: OntologyMappingInterface = {
   ontologyUri: 'https://schema.org/MusicAlbum',
   schemaOrgType: 'https://schema.org/MusicAlbum',
   gs1GpcCode: '50000000', // GS1 GPC Brick Code: Music & Audio Visual Media
}

/**
 * Standardized and Extensible Media Disk Specification Interface (ends with 'Interface')
 */
export interface MediaDiskSpecInterface extends Record<string, unknown> {
   format: MediaDiskFormat | string
   durationSec: number
   trackCount: number
   rpm?: VinylRpm | number
   genre?: string
   label?: string
   isrcCodes?: string[]
   catalogNumber?: string
   ontologyMapping?: OntologyMappingInterface
}
