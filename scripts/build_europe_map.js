/**
 * Génère js/europe-map-data.js à partir du GeoJSON Natural Earth (Europe).
 * Exécution : node scripts/build_europe_map.js
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { geoMercator, geoPath } = require("d3-geo");

const ROOT = path.join(__dirname, "..");
const GEOJSON = path.join(ROOT, "scripts", ".cache", "ne_50m_admin_0_countries.geojson");
const OUT = path.join(ROOT, "js", "europe-map-data.js");
const NE_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";

function ensureGeojson() {
  if (fs.existsSync(GEOJSON)) return;
  fs.mkdirSync(path.dirname(GEOJSON), { recursive: true });
  execSync(`curl -sL "${NE_URL}" -o "${GEOJSON}"`, { stdio: "inherit" });
}

ensureGeojson();
const raw = JSON.parse(fs.readFileSync(GEOJSON, "utf8"));

const EUROPE = new Set(["Europe"]);
const features = raw.features.filter((f) => EUROPE.has(f.properties.REGION_UN));

const fc = { type: "FeatureCollection", features };

const w = 1000;
const h = 520;
const projection = geoMercator()
  .rotate([-10, 0, 0])
  .fitExtent(
    [
      [8, 8],
      [w - 8, h - 8],
    ],
    fc
  );
const pathGen = geoPath(projection);

const isoToFlag = {
  AL: "🇦🇱",
  AD: "🇦🇩",
  AT: "🇦🇹",
  BY: "🇧🇾",
  BE: "🇧🇪",
  BA: "🇧🇦",
  BG: "🇧🇬",
  HR: "🇭🇷",
  CY: "🇨🇾",
  CZ: "🇨🇿",
  DK: "🇩🇰",
  EE: "🇪🇪",
  FI: "🇫🇮",
  FR: "🇫🇷",
  DE: "🇩🇪",
  GR: "🇬🇷",
  HU: "🇭🇺",
  IS: "🇮🇸",
  IE: "🇮🇪",
  IT: "🇮🇹",
  LV: "🇱🇻",
  LI: "🇱🇮",
  LT: "🇱🇹",
  LU: "🇱🇺",
  MT: "🇲🇹",
  MD: "🇲🇩",
  MC: "🇲🇨",
  ME: "🇲🇪",
  NL: "🇳🇱",
  MK: "🇲🇰",
  NO: "🇳🇴",
  PL: "🇵🇱",
  PT: "🇵🇹",
  RO: "🇷🇴",
  RUS: "🇷🇺",
  SM: "🇸🇲",
  RS: "🇷🇸",
  SK: "🇸🇰",
  SI: "🇸🇮",
  ES: "🇪🇸",
  SE: "🇸🇪",
  CH: "🇨🇭",
  TR: "🇹🇷",
  UA: "🇺🇦",
  GBR: "🇬🇧",
  VAT: "🇻🇦",
  XK: "🇽🇰",
};

/** Capitales (lon, lat) — noms en français */
const capitals = [
  { iso: "AL", name: "Tirana", city: "Tirana", lon: 19.819, lat: 41.327 },
  { iso: "AD", name: "Andorre", city: "Andorre-la-Vieille", lon: 1.5218, lat: 42.5063 },
  { iso: "AT", name: "Autriche", city: "Vienne", lon: 16.3738, lat: 48.2082 },
  { iso: "BY", name: "Biélorussie", city: "Minsk", lon: 27.5615, lat: 53.9045 },
  { iso: "BE", name: "Belgique", city: "Bruxelles", lon: 4.3517, lat: 50.8503 },
  { iso: "BA", name: "Bosnie-Herzégovine", city: "Sarajevo", lon: 18.4131, lat: 43.8563 },
  { iso: "BG", name: "Bulgarie", city: "Sofia", lon: 23.3219, lat: 42.6977 },
  { iso: "HR", name: "Croatie", city: "Zagreb", lon: 15.9819, lat: 45.815 },
  { iso: "CY", name: "Chypre", city: "Nicosie", lon: 33.3823, lat: 35.1856 },
  { iso: "CZ", name: "Tchéquie", city: "Prague", lon: 14.4378, lat: 50.0755 },
  { iso: "DK", name: "Danemark", city: "Copenhague", lon: 12.5683, lat: 55.6761 },
  { iso: "EE", name: "Estonie", city: "Tallinn", lon: 24.7536, lat: 59.437 },
  { iso: "FI", name: "Finlande", city: "Helsinki", lon: 24.9384, lat: 60.1699 },
  { iso: "FR", name: "France", city: "Paris", lon: 2.3522, lat: 48.8566 },
  { iso: "DE", name: "Allemagne", city: "Berlin", lon: 13.405, lat: 52.52 },
  { iso: "GR", name: "Grèce", city: "Athènes", lon: 23.7275, lat: 37.9838 },
  { iso: "HU", name: "Hongrie", city: "Budapest", lon: 19.0402, lat: 47.4979 },
  { iso: "IS", name: "Islande", city: "Reykjavik", lon: -21.8954, lat: 64.1466 },
  { iso: "IE", name: "Irlande", city: "Dublin", lon: -6.2603, lat: 53.3498 },
  { iso: "IT", name: "Italie", city: "Rome", lon: 12.4964, lat: 41.9028 },
  { iso: "LV", name: "Lettonie", city: "Riga", lon: 24.1052, lat: 56.9496 },
  { iso: "LI", name: "Liechtenstein", city: "Vaduz", lon: 9.5209, lat: 47.141 },
  { iso: "LT", name: "Lituanie", city: "Vilnius", lon: 25.2797, lat: 54.6872 },
  { iso: "LU", name: "Luxembourg", city: "Luxembourg", lon: 6.1296, lat: 49.6113 },
  { iso: "MT", name: "Malte", city: "La Valette", lon: 14.5146, lat: 35.8989 },
  { iso: "MD", name: "Moldavie", city: "Chișinău", lon: 28.8577, lat: 47.0105 },
  { iso: "MC", name: "Monaco", city: "Monaco", lon: 7.4167, lat: 43.7384 },
  { iso: "ME", name: "Monténégro", city: "Podgorica", lon: 19.2594, lat: 42.4304 },
  { iso: "NL", name: "Pays-Bas", city: "Amsterdam", lon: 4.9041, lat: 52.3676 },
  { iso: "MK", name: "Macédoine du Nord", city: "Skopje", lon: 21.4314, lat: 41.9981 },
  { iso: "NO", name: "Norvège", city: "Oslo", lon: 10.7522, lat: 59.9139 },
  { iso: "PL", name: "Pologne", city: "Varsovie", lon: 21.0122, lat: 52.2297 },
  { iso: "PT", name: "Portugal", city: "Lisbonne", lon: -9.1393, lat: 38.7223 },
  { iso: "RO", name: "Roumanie", city: "Bucarest", lon: 26.1025, lat: 44.4268 },
  { iso: "RUS", name: "Russie", city: "Moscou", lon: 37.6173, lat: 55.7558 },
  { iso: "SM", name: "Saint-Marin", city: "Saint-Marin", lon: 12.4578, lat: 43.9424 },
  { iso: "RS", name: "Serbie", city: "Belgrade", lon: 20.4489, lat: 44.7866 },
  { iso: "SK", name: "Slovaquie", city: "Bratislava", lon: 17.1077, lat: 48.1486 },
  { iso: "SI", name: "Slovénie", city: "Ljubljana", lon: 14.5058, lat: 46.0569 },
  { iso: "ES", name: "Espagne", city: "Madrid", lon: -3.7038, lat: 40.4168 },
  { iso: "SE", name: "Suède", city: "Stockholm", lon: 18.0686, lat: 59.3293 },
  { iso: "CH", name: "Suisse", city: "Berne", lon: 7.4474, lat: 46.948 },
  { iso: "TR", name: "Turquie", city: "Ankara", lon: 32.8597, lat: 39.9334 },
  { iso: "UA", name: "Ukraine", city: "Kiev", lon: 30.5234, lat: 50.4501 },
  { iso: "GBR", name: "Royaume-Uni", city: "Londres", lon: -0.1276, lat: 51.5074 },
  { iso: "VAT", name: "Vatican", city: "Vatican", lon: 12.4534, lat: 41.9029 },
  { iso: "XK", name: "Kosovo", city: "Pristina", lon: 21.1655, lat: 42.6629 },
];

const countries = [];
for (const f of features) {
  const p = f.properties;
  const a3 = p.ADM0_A3;
  const a2 = p.ISO_A2;
  if (a3 === "-99" || !a3) continue;
  const d = pathGen(f);
  if (!d) continue;
  const nameFr = p.NAME_FR || p.NAME;
  const flag = isoToFlag[a3] || isoToFlag[a2] || "🏳️";
  countries.push({
    iso: a3,
    iso2: a2,
    name: nameFr,
    flag,
    d,
  });
}

const capitalsOut = capitals.map((c) => {
  const xy = projection([c.lon, c.lat]);
  return {
    id: "cap-" + c.iso.toLowerCase(),
    iso: c.iso,
    name: c.name,
    city: c.city,
    flag: isoToFlag[c.iso] || "🏳️",
    lon: c.lon,
    lat: c.lat,
    cx: xy[0],
    cy: xy[1],
  };
});

const header = `/* Généré par scripts/build_europe_map.js — ne pas éditer à la main */
(function (global) {
  global.GEORANK_EUROPE_MAP = `;
const footer = `;
})(typeof window !== "undefined" ? window : globalThis);
`;

const data = {
  viewBox: [0, 0, w, h],
  ocean: "#9ec9ea",
  land: "#2d6b3a",
  border: "#ffffff",
  countries,
  capitals: capitalsOut,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header + JSON.stringify(data, null, 0) + footer, "utf8");
console.log("Wrote", OUT, "countries:", countries.length, "capitals:", capitalsOut.length);
