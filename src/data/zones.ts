export type Continent = 'Eastern Kingdoms' | 'Kalimdor' | 'Outland' | 'Northrend' | 'TBC';

export interface Zone {
  id: string;          // Unique identifier
  name: string;        // Display name
  continent: Continent;
  imageFile: string;   // Filename in the continent's folder
  level?: string;      // Level range (optional)
  faction?: 'Alliance' | 'Horde' | 'Neutral';
}

export const ZONES: Zone[] = [
  // Eastern Kingdoms
  {
    id: 'elwynn-forest',
    name: 'Elwynn Forest',
    continent: 'Eastern Kingdoms',
    imageFile: 'elwynn_forest.jpg',
    level: '1-10',
    faction: 'Alliance'
  },
  {
    id: 'westfall',
    name: 'Westfall',
    continent: 'Eastern Kingdoms',
    imageFile: 'westfall.jpg',
    level: '10-20',
    faction: 'Alliance'
  },
  {
    id: 'dun-morogh',
    name: 'Dun Morogh',
    continent: 'Eastern Kingdoms',
    imageFile: 'dunmorogh.jpg',
    level: '1-10',
    faction: 'Alliance'
  },
  {
    id: 'tirisfal-glades',
    name: 'Tirisfal Glades',
    continent: 'Eastern Kingdoms',
    imageFile: 'tirisfal-glades.jpg',
    level: '1-10',
    faction: 'Horde'
  },
  {
    id: 'silverpine-forest',
    name: 'Silverpine Forest',
    continent: 'Eastern Kingdoms',
    imageFile: 'silverpine-forest.jpg',
    level: '10-20',
    faction: 'Horde'
  },
  {
    id: 'burning-steppes',
    name: 'Burning Steppes',
    continent: 'Eastern Kingdoms',
    imageFile: 'burning-steppes.jpg',
    level: '10-20',
    faction: 'Horde'
  },
  {
    id: 'silvermoon-city',
    name: 'Silvermoon City',
    continent: 'TBC',
    imageFile: 'silvermoon-city.jpg',
    level: '10-20',
    faction: 'Horde'
  },
  {
    id: 'arathi-highlands',
    name: 'Arathi Highlands',
    continent: 'Eastern Kingdoms',
    imageFile: 'Arathi_Highlands.jpg',
    level: '25-30',
    faction: 'Neutral'
  },
  {
    id: 'hinterlands',
    name: 'Hinterlands',
    continent: 'Eastern Kingdoms',
    imageFile: 'hinterlands.jpg',
    level: '25-30',
    faction: 'Neutral'
  },
  {
    id: 'stormwind',
    name: 'Stormwind City',
    continent: 'Eastern Kingdoms',
    imageFile: 'stormwind-city.jpg',
    level: '25-30',
    faction: 'Neutral'
  },
  {
    id: 'hillsbrad-foothills',
    name: 'Hillsbrad Foothills',
    continent: 'Eastern Kingdoms',
    imageFile: 'hillsbrad.jpg',
    level: '20-25',
    faction: 'Neutral'
  },
  {
    id: 'wetlands',
    name: 'Wetlands',
    continent: 'Eastern Kingdoms',
    imageFile: 'wetlands.jpg',
    level: '20-30',
    faction: 'Alliance'
  },
  {
    id: 'alterac-mountains',
    name: 'Alterac Mountains',
    continent: 'Eastern Kingdoms',
    imageFile: 'Alterac_Mountains.jpg',
    level: '30-40',
    faction: 'Neutral'
  },
  {
    id: 'stranglethorn-vale',
    name: 'Stranglethorn Vale',
    continent: 'Eastern Kingdoms',
    imageFile: 'stranglethorn-vale.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'duskwood',
    name: 'Duskwood',
    continent: 'Eastern Kingdoms',
    imageFile: 'duskwood.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'undercity',
    name: 'Undercity',
    continent: 'Eastern Kingdoms',
    imageFile: 'undercity.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'redridge-mountains',
    name: 'Redridge Mountains',
    continent: 'Eastern Kingdoms',
    imageFile: 'redridge.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'swampofsorrows',
    name: 'Swamp of Sorrows',
    continent: 'Eastern Kingdoms',
    imageFile: 'swamp-of-sorrows.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'westernplaguelands',
    name: 'Western Plaguelands',
    continent: 'Eastern Kingdoms',
    imageFile: 'western-plaguelands.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'epl',
    name: 'Eastern Plaguelands',
    continent: 'Eastern Kingdoms',
    imageFile: 'epl.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'searinggorge',
    name: 'Searing Gorge',
    continent: 'Eastern Kingdoms',
    imageFile: 'searing-gorge.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'blastedlands',
    name: 'Blasted Lands',
    continent: 'Eastern Kingdoms',
    imageFile: 'blasted-lands.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'bloodmyst-isle',
    name: 'Bloodmyst Isle',
    continent: 'TBC',
    imageFile: 'bloodmyst-isle.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'azuremyst-isle',
    name: 'Azuremyst Isle',
    continent: 'TBC',
    imageFile: 'azuremyst-isle.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'brm',
    name: 'Blackrock Mountain',
    continent: 'Eastern Kingdoms',
    imageFile: 'brm.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'lochmodan',
    name: 'Loch Modan',
    continent: 'Eastern Kingdoms',
    imageFile: 'loch-modan.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'deadwindpass',
    name: 'Deadwind Pass',
    continent: 'Eastern Kingdoms',
    imageFile: 'deadwind-pass.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  // KALIMDOR
  {
    id: 'ashenvale',
    name: 'Ashenvale',
    continent: 'Kalimdor',
    imageFile: 'ashenvale.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'azshara',
    name: 'Azshara',
    continent: 'Kalimdor',
    imageFile: 'azshara.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'barrens',
    name: 'The Barrens',
    continent: 'Kalimdor',
    imageFile: 'barrens.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'darkshore',
    name: 'Darkshore',
    continent: 'Kalimdor',
    imageFile: 'darkshore.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'desolace',
    name: 'Desolace',
    continent: 'Kalimdor',
    imageFile: 'desolace.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'durotar',
    name: 'Durotar',
    continent: 'Kalimdor',
    imageFile: 'durotar.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'dustwallow-marsh',
    name: 'Dustwallow Marsh',
    continent: 'Kalimdor',
    imageFile: 'dustwallow-marsh.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'felwood',
    name: 'Felwood',
    continent: 'Kalimdor',
    imageFile: 'felwood.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'feralas',
    name: 'Feralas',
    continent: 'Kalimdor',
    imageFile: 'feralas.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'moonglade',
    name: 'Moonglade',
    continent: 'Kalimdor',
    imageFile: 'moonglade.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'mulgore',
    name: 'Mulgore',
    continent: 'Kalimdor',
    imageFile: 'mulgore.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'orgrimmar',
    name: 'Orgrimmar',
    continent: 'Kalimdor',
    imageFile: 'orgrimmar.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'silithus',
    name: 'Silithus',
    continent: 'Kalimdor',
    imageFile: 'silithus.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'stonetalon-mountains',
    name: 'Stonetalon Mountains',
    continent: 'Kalimdor',
    imageFile: 'stonetalon-mountains.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'tanaris',
    name: 'Tanaris',
    continent: 'Kalimdor',
    imageFile: 'tanaris.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'thousand-needles',
    name: 'Thousand Needles',
    continent: 'Kalimdor',
    imageFile: 'thousand-needles.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'ungoro-crater',
    name: `Un'Goro Crater`,
    continent: 'Kalimdor',
    imageFile: 'ungoro.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  {
    id: 'winterspring',
    name: `Winterspring`,
    continent: 'Kalimdor',
    imageFile: 'winterspring.jpg',
    level: '30-45',
    faction: 'Neutral'
  },
  // TBC Zones
  {
    id: 'hellfire-peninsula',
    name: 'Hellfire Peninsula',
    continent: 'TBC',
    imageFile: 'hellfire-peninsula.jpg',
    level: '58-63',
    faction: 'Neutral'
  },
  {
    id: 'zangarmarsh',
    name: 'Zangarmarsh',
    continent: 'TBC',
    imageFile: 'zangarmarsh.jpg',
    level: '60-64',
    faction: 'Neutral'
  },
  {
    id: 'terokkar-forest',
    name: 'Terokkar Forest',
    continent: 'TBC',
    imageFile: 'terokkar-forest.jpg',
    level: '62-65',
    faction: 'Neutral'
  },
  {
    id: 'nagrand',
    name: 'Nagrand',
    continent: 'TBC',
    imageFile: 'nagrand.jpg',
    level: '64-67',
    faction: 'Neutral'
  },
  {
    id: 'blades-edge-mountains',
    name: "Blade's Edge Mountains",
    continent: 'TBC',
    imageFile: 'blades-edge-mountains.jpg',
    level: '65-68',
    faction: 'Neutral'
  },
  {
    id: 'isle-of-quel-danas',
    name: "Isle of Quel'Danas",
    continent: 'TBC',
    imageFile: `isle-of-quel'danas.jpg`,
    level: '65-68',
    faction: 'Neutral'
  },
  {
    id: 'netherstorm',
    name: 'Netherstorm',
    continent: 'TBC',
    imageFile: 'netherstorm.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
  {
    id: 'shadowmoon-valley',
    name: 'Shadowmoon Valley',
    continent: 'TBC',
    imageFile: 'shadowmoon-valley.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
  {
    id: 'the-exodar',
    name: 'The Exodar',
    continent: 'TBC',
    imageFile: 'the-exodar.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
  {
    id: 'ghostlands',
    name: 'Ghostlands',
    continent: 'TBC',
    imageFile: 'ghostlands.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
  {
    id: 'eversong-woods',
    name: 'Eversong Woods',
    continent: 'TBC',
    imageFile: 'eversong-woods.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
  {
    id: 'darna',
    name: 'Darnassus',
    continent: 'TBC',
    imageFile: 'darnassus.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
  {
    id: 'shattrath-city',
    name: 'Shattrath City',
    continent: 'TBC',
    imageFile: 'shattrath-city.jpg',
    level: '67-70',
    faction: 'Neutral'
  },
];

// Helper functions
export const getZonesByContinent = (continent: Continent): Zone[] => {
  return ZONES.filter(zone => zone.continent === continent);
};

export const getZoneNames = (): string[] => {
  return ZONES.map(zone => zone.name);
};

export const getZoneById = (id: string): Zone | undefined => {
  return ZONES.find(zone => zone.id === id);
};

export const getZoneByName = (name: string): Zone | undefined => {
  return ZONES.find(zone => zone.name.toLowerCase() === name.toLowerCase());
};

// Helper function to get zones by faction
export const getZonesByFaction = (faction: Zone['faction']): Zone[] => {
  return ZONES.filter(zone => zone.faction === faction)
}

// Helper function to get zone details
export const getZoneDetails = (zoneName: string): Zone | undefined => {
  return ZONES.find(zone => zone.name === zoneName)
} 