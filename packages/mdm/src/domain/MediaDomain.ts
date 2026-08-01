/**
 * Standard Audio / Video Disk Formats
 */
export enum MediaDiskFormat {
   VINYL_7IN = 'vinyl_7in',
   VINYL_10IN = 'vinyl_10in',
   VINYL_12IN = 'vinyl_12in',
   CD = 'compact_disc',
   SACD = 'super_audio_cd',
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
 * Standardized and Extensible Media Disk Specification Interface
 */
export interface IMediaDiskSpec extends Record<string, unknown> {
   format: MediaDiskFormat | string
   durationSec: number
   trackCount: number
   rpm?: VinylRpm | number
   genre?: string
   label?: string
   isrcCodes?: string[]
   catalogNumber?: string
}
