export const MAP_BOUNDS = Object.freeze({
  north: 6,
  south: -11,
  west: 95,
  east: 141,
});

export const CITIES = Object.freeze([
  { name: 'Pekanbaru',  province: 'RIAU',   lat: 0.51,   lng: 101.45, label: 'top' },
  { name: 'Padang',     province: 'SUMBAR', lat: -0.95,  lng: 100.35, label: 'bottom' },
  { name: 'Medan',      province: 'SUMUT',  lat: 3.59,   lng: 98.67,  label: 'right' },
  { name: 'Palembang',  province: 'SUMSEL', lat: -2.98,  lng: 104.75, label: 'left' },

  { name: 'Jakarta',    province: 'DKI',    lat: -6.21,  lng: 106.85, label: 'top' },
  { name: 'Bandung',    province: 'JABAR',  lat: -6.91,  lng: 107.61, label: 'right' },
  { name: 'Surabaya',   province: 'JATIM',  lat: -7.25,  lng: 112.75, label: 'right' },

  { name: 'Denpasar',   province: 'BALI',   lat: -8.65,  lng: 115.22, label: 'right' },
  { name: 'Kupang',     province: 'NTT',    lat: -10.18, lng: 123.61, label: 'right' },

  { name: 'Pontianak',  province: 'KALBAR', lat: -0.03,  lng: 109.33, label: 'right' },
  { name: 'Balikpapan', province: 'KALTIM', lat: -1.27,  lng: 116.83, label: 'right' },

  { name: 'Makassar',   province: 'SULSEL', lat: -5.15,  lng: 119.43, label: 'right' },
  { name: 'Manado',     province: 'SULUT',  lat: 1.47,   lng: 124.84, label: 'bottom' },

  { name: 'Ambon',      province: 'MALUKU', lat: -3.7,   lng: 128.18, label: 'right' },
  { name: 'Sorong',     province: 'PBD',    lat: -0.88,  lng: 131.25, label: 'top' },
  { name: 'Jayapura',   province: 'PAPUA',  lat: -2.53,  lng: 140.72, label: 'left' },
]);
