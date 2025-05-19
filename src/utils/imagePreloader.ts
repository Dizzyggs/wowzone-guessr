import type { Zone } from '../data/zones';

/**
 * Preloads a batch of images in the background
 * @param zones Array of zones to preload images for
 * @param batchSize Number of images to preload at once
 */
export const preloadImages = (zones: Zone[], batchSize: number = 3) => {
  // Take only the specified batch size
  const zonesToPreload = zones.slice(0, batchSize);

  zonesToPreload.forEach(zone => {
    const img = new Image();
    img.src = `/zone_images/${zone.continent}/${zone.imageFile}`;
  });
};

/**
 * Creates the full image path for a zone
 * @param zone Zone object
 * @returns Full image path
 */
export const getZoneImagePath = (zone: Zone): string => {
  return `/zone_images/${zone.continent}/${zone.imageFile}`;
}; 