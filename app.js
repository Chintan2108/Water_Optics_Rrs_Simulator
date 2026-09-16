/* Water Optics Lab — educational forward model, version 1.0.
 * No preset spectra or constituent-to-color lookup is used.
 * Published data and all author-chosen approximations are documented in
 * index.html, README.md, and data/SOURCES.md. Units are SI unless noted.
 */
'use strict';

// BEGIN REFERENCE TABLE
// Columns: nm, aw (m^-1), normalized phytoplankton shape, CIE x/y/z, D65.
// CIE © CIE 2019, CC BY-SA 4.0; sampled from original 1 nm tables.
// See data/SOURCES.md. Generated reproducibly by prepare-data.py.
const OPTICAL_TABLE = [[400,0.00663,0.6501240694789083,0.01431,0.000396,0.06785001,82.7549],[405,0.0053,0.707196029776675,0.02319,0.00064,0.1102,87.1204],[410,0.00473,0.7766749379652607,0.04351,0.00121,0.2074,91.486],[415,0.00444,0.837468982630273,0.07763,0.00218,0.3713,92.4589],[420,0.00454,0.8833746898263027,0.13438,0.004,0.6456,93.4318],[425,0.00478,0.9069478908188587,0.21477,0.0073,1.0390501,90.057],[430,0.0049499999999999995,0.9578163771712159,0.2839,0.0116,1.3856,86.6823],[435,0.0053,0.9851116625310175,0.3285,0.01684,1.62296,95.7736],[440,0.00635,1.0,0.34828,0.023,1.74706,104.865],[445,0.007509999999999999,0.9590570719602979,0.34806,0.0298,1.7826,110.936],[450,0.00922,0.9205955334987594,0.3362,0.038,1.77211,117.008],[455,0.00962,0.8833746898263027,0.3187,0.048,1.7441,117.41],[460,0.00979,0.8684863523573201,0.2908,0.06,1.6692,117.812],[465,0.010110000000000001,0.8461538461538461,0.2511,0.0739,1.5281,116.336],[470,0.0106,0.8238213399503722,0.19536,0.09098,1.28764,114.861],[475,0.0114,0.7828784119106701,0.1421,0.1126,1.0419,115.392],[480,0.0127,0.7468982630272953,0.09564,0.13902,0.8129501,115.923],[485,0.0136,0.7133995037220844,0.05795001,0.1693,0.6162,112.367],[490,0.015,0.6799007444168734,0.03201,0.20802,0.46518,108.811],[495,0.0173,0.6290322580645161,0.0147,0.2586,0.3533,109.082],[500,0.0204,0.5707196029776676,0.0049,0.323,0.272,109.354],[505,0.025599999999999998,0.5062034739454095,0.0024,0.4073,0.2123,108.578],[510,0.0325,0.44665012406947896,0.0093,0.503,0.1582,107.802],[515,0.039599999999999996,0.3957816377171216,0.0291,0.6082,0.1117,106.296],[520,0.0409,0.3548387096774194,0.06327,0.71,0.07824999,104.79],[525,0.0417,0.3188585607940447,0.1096,0.7932,0.05725001,106.239],[530,0.0434,0.2903225806451613,0.1655,0.862,0.04216,107.689],[535,0.0452,0.26302729528535984,0.2257499,0.9148501,0.02984,106.047],[540,0.0474,0.24069478908188585,0.2904,0.954,0.0203,104.405],[545,0.05109999999999999,0.21836228287841192,0.3597,0.9803,0.0134,104.225],[550,0.056499999999999995,0.19851116625310175,0.4334499,0.9949501,0.008749999,104.046],[555,0.05959999999999999,0.17369727047146402,0.5120501,1.0,0.005749999,102.023],[560,0.0619,0.15384615384615385,0.5945,0.995,0.0039,100.0],[565,0.0642,0.13895781637717122,0.6784,0.9786,0.002749999,98.1671],[570,0.06949999999999999,0.13151364764267992,0.7621,0.952,0.0021,96.3342],[575,0.0772,0.12903225806451613,0.8425,0.9154,0.0018,96.0611],[580,0.0896,0.13151364764267992,0.9163,0.87,0.001650001,95.788],[585,0.11,0.13647642679900746,0.9786,0.8163,0.0014,92.2368],[590,0.1351,0.13895781637717122,1.0263,0.757,0.0011,88.6856],[595,0.16720000000000002,0.13895781637717122,1.0567,0.6949,0.001,89.3459],[600,0.2224,0.13399503722084366,1.0622,0.631,0.0008,90.0062],[605,0.2577,0.13647642679900746,1.0456,0.5668,0.0006,89.8026],[610,0.2644,0.141439205955335,1.0026,0.503,0.00034,89.5991],[615,0.2678,0.1513647642679901,0.9384,0.4412,0.00024,88.6489],[620,0.2755,0.16129032258064516,0.8544499,0.381,0.00019,87.6987],[625,0.28340000000000004,0.1674937965260546,0.7514,0.321,0.0001,85.4936],[630,0.2916,0.17617866004962782,0.6424,0.265,4.999999e-05,83.2886],[635,0.30119999999999997,0.184863523573201,0.5419,0.217,3e-05,83.4939],[640,0.3108,0.19106699751861042,0.4479,0.175,2e-05,83.6992],[645,0.325,0.19727047146401988,0.3608,0.1382,1e-05,81.863],[650,0.33999999999999997,0.20595533498759305,0.2835,0.107,0.0,80.0268],[655,0.371,0.22828784119106701,0.2187,0.0816,0.0,80.1207],[660,0.41000000000000003,0.2853598014888338,0.1649,0.061,0.0,80.2146],[665,0.42900000000000005,0.37841191066997526,0.1212,0.04458,0.0,81.2462],[670,0.439,0.4689826302729529,0.0874,0.032,0.0,82.2778],[675,0.44799999999999995,0.49875930521091816,0.0636,0.0232,0.0,80.281],[680,0.46499999999999997,0.4516129032258065,0.04677,0.017,0.0,78.2842],[685,0.486,0.33374689826302734,0.0329,0.01192,0.0,74.0027],[690,0.516,0.20595533498759305,0.0227,0.00821,0.0,69.7213],[695,0.559,0.12158808933002481,0.01584,0.005723,0.0,70.6652],[700,0.624,0.07444168734491316,0.01135916,0.004102,0.0,71.6091],[705,0.7314999999999999,0.04515116573543177,0.008110916,0.002929,0.0,72.979],[710,0.839,0.027385566340305884,0.005790346,0.002091,0.0,74.349],[715,1.004,0.016610185618989814,0.004109457,0.001484,0.0,67.9765],[720,1.169,0.01007458684143519,0.002899327,0.001047,0.0,61.604],[725,1.484,0.006110545803267901,0.00204919,0.00074,0.0,65.7448],[730,1.799,0.003706233377260344,0.001439971,0.00052,0.0,69.8856],[735,2.0895,0.0022479441753586976,0.0009999493,0.0003611,0.0,72.4863],[740,2.3800000000000003,0.0013634470636774824,0.0006900786,0.0002492,0.0,75.087],[745,2.425,0.0008269724470155563,0.0004760213,0.0001719,0.0,69.3398],[750,2.4699999999999998,0.0005015841438525162,0.0003323011,0.00012,0.0,63.5927],[755,2.51,0.00030422616167226303,0.0002348261,8.48e-05,0.0,55.0054],[760,2.55,0.00018452249454092002,0.0001661505,6e-05,0.0,46.4182],[765,2.5300000000000002,0.000111918550345725,0.000117413,4.24e-05,0.0,56.6118],[770,2.5100000000000002,6.788203217527418e-05,8.307527e-05,3e-05,0.0,66.8054],[775,2.435,4.117253375790325e-05,5.870652e-05,2.12e-05,0.0,65.0941],[780,2.36,2.497240406222173e-05,4.150994e-05,1.499e-05,0.0,63.3828],[785,2.26,1.514652871046979e-05,2.935326e-05,1.06e-05,0.0,63.8434],[790,2.16,9.186834051117586e-06,2.067383e-05,7.4657e-06,0.0,64.304],[795,2.115,5.572096517694834e-06,1.455977e-05,5.2578e-06,0.0,61.8779],[800,2.07,3.379647376859915e-06,1.025398e-05,3.7029e-06,0.0,59.4519]];
// END REFERENCE TABLE

const CONFIG = Object.freeze({
  chl: { label: 'Chlorophyll-a', unit: 'μg/L', max: 100, scale: 0.1, step: 0.01, hint: 'Absorbs blue and red; represents total phytoplankton.' },
  pc: { label: 'Phycocyanin', unit: 'μg/L', max: 100, scale: 0.1, step: 0.01, hint: 'Cyanobacterial pigment; absorption near 620 nm.' },
  cdom: { label: 'CDOM / Gelbstoff', unit: 'm⁻¹ at 440 nm', max: 5, scale: 0.01, step: 0.001, hint: 'Dissolved color; strongest absorption in the blue.' },
  tss: { label: 'Suspended sediment · TSS', unit: 'g/m³', max: 100, scale: 0.1, step: 0.01, hint: 'Non-algal solids; both scattering and absorption.' }
});
const PRESETS = Object.freeze({
  ocean: { chl: 0.15, pc: 0, cdom: 0.01, tss: 0.05, water: 'marine' },
  bloom: { chl: 15, pc: 0, cdom: 0.08, tss: 0.3, water: 'marine' },
  cyano: { chl: 25, pc: 40, cdom: 0.3, tss: 2, water: 'fresh' },
  cdom: { chl: 0.5, pc: 0, cdom: 4, tss: 0.3, water: 'fresh' },
  sediment: { chl: 2, pc: 0, cdom: 0.3, tss: 35, water: 'marine' }
});
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const sliderToValue = (position, config) => config.scale * Math.expm1(position / 1000 * Math.log1p(config.max / config.scale));
const valueToSlider = (value, config) => 1000 * Math.log1p(value / config.scale) / Math.log1p(config.max / config.scale);

/** Pure, deterministic forward model. No DOM or rendering dependencies. */
function simulate(input) {
  const s = {};
  for (const [key, config] of Object.entries(CONFIG)) {
    if (!Number.isFinite(input[key]) || input[key] < 0 || input[key] > config.max) throw new RangeError(`Invalid ${key}`);
    s[key] = input[key];
  }
  if (!['fresh', 'marine'].includes(input.water)) throw new RangeError('Choose fresh or marine water');
  return OPTICAL_TABLE.map(([wavelength, aw, phyShape, xbar, ybar, zbar, daylight]) => {
    const aph = s.chl * 0.04 * phyShape;
    // Literature-used peak; Gaussian width is an explicit teaching approximation.
    const apc = s.pc * 0.007 * Math.exp(-0.5 * ((wavelength - 620) / 18) ** 2);
    const ag = s.cdom * Math.exp(-0.018 * (wavelength - 440));
    const ased = 0.041 * s.tss * Math.exp(-0.0123 * (wavelength - 443));
    const bbw = (input.water === 'fresh' ? 0.00111 : 0.00144) * (wavelength / 500) ** -4.32;
    // Biomass coefficient/exponent are assumptions, not universal constants.
    // PC-bearing cells are already represented by total Chl; no double scattering.
    const bbph = 0.0006 * s.chl ** 0.8 * (550 / wavelength);
    const bbsed = 0.01 * s.tss * (550 / wavelength) ** 0.5;
    const a = aw + aph + apc + ag + ased;
    const bb = bbw + bbph + bbsed;
    const u = bb / (a + bb);
    const rrs = 0.089 * u + 0.1245 * u * u;
    const Rrs = 0.52 * rrs / (1 - 1.7 * rrs);
    return { wavelength, aw, aph, apc, ag, ased, bbw, bbph, bbsed, a, bb, u, rrs, Rrs, xbar, ybar, zbar, daylight };
  });
}

const srgbEncode = v => v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
/** CIE tristimulus integration with fixed exposure, never normalized per mixture. */
function spectrumToColor(spectrum) {
  let X = 0, Y = 0, Z = 0, whiteY = 0;
  spectrum.forEach((p, i) => {
    const trapezoidWeight = (i === 0 || i === spectrum.length - 1) ? 2.5 : 5;
    const E = p.daylight * trapezoidWeight;
    const radianceFactor = Math.PI * p.Rrs;
    X += E * radianceFactor * p.xbar;
    Y += E * radianceFactor * p.ybar;
    Z += E * radianceFactor * p.zbar;
    whiteY += E * p.ybar;
  });
  X /= whiteY; Y /= whiteY; Z /= whiteY;
  const exposure = 3;
  const raw = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.2040 * Y + 1.057 * Z].map(v => v * exposure);
  const linear = raw.map(v => clamp(v, 0, 1));
  const rgb = linear.map(v => Math.round(255 * srgbEncode(v)));
  return { X, Y, Z, linear, rgb, clipped: raw.some(v => v < 0 || v > 1), hex: '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('') };
}

/** Color words describe the computed RGB, never the concentration or preset. */
function colorName(color) {
  const [r, g, b] = color.rgb.map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (max < 0.13) return 'Very dark water';
  if (d < 0.045) return 'Muted gray water';
  let hue = d === 0 ? 0 : max === r ? ((g - b) / d + (g < b ? 6 : 0)) * 60 : max === g ? ((b - r) / d + 2) * 60 : ((r - g) / d + 4) * 60;
  const tone = hue < 20 || hue >= 335 ? 'reddish brown' : hue < 60 ? 'amber-brown' : hue < 90 ? 'olive' : hue < 165 ? 'green' : hue < 205 ? 'blue-green' : hue < 275 ? 'blue' : 'violet-blue';
  return max < 0.30 ? `Dark ${tone} water` : tone.charAt(0).toUpperCase() + tone.slice(1) + ' water';
}

function classify(s, spectrum) {
  const blue = spectrum.find(p => p.wavelength === 440);
  const green = spectrum.find(p => p.wavelength === 550);
  const otherAbs = blue.ag + blue.ased;
  const pigmentAbs = blue.aph + blue.apc;
  const case2 = (otherAbs > pigmentAbs && otherAbs > 0.02) || (s.tss >= 0.5 && green.bbsed > green.bbph + green.bbw);
  const absorber = [['CDOM', blue.ag], ['sediment', blue.ased], ['phytoplankton', blue.aph], ['phycocyanin', blue.apc]].sort((a, b) => b[1] - a[1])[0];
  const state = s.pc >= 5 ? 'cyano' : s.tss >= 5 ? 'sediment' : s.cdom >= 0.5 ? 'cdom' : s.chl >= 3 ? 'bloom' : (s.chl < 0.5 && s.cdom < 0.05 && s.tss < 0.2) ? 'ocean' : 'mixed';
  return { blue, green, case2, absorber, state };
}

const COUNTERPARTS = {
  ocean: { title: 'Subtropical open ocean', text: 'Low pigment and particle loads leave molecular-water scattering prominent. Blue light escapes more readily than red light. Think of the low-chlorophyll interiors of subtropical gyres.', links: [['NASA · Ocean chlorophyll', 'https://science.nasa.gov/earth/earth-observatory/global-maps/chlorophyll/'], ['Phytoplankton absorption study', 'https://doi.org/10.1029/95JC00463']] },
  bloom: { title: 'Productive shelf waters', text: 'A phytoplankton-rich mixture suggests productive coastal or shelf waters. Blue and red absorption leave a relative green window; a red-edge maximum may emerge at high biomass.', links: [['NASA · Shetland phytoplankton', 'https://www.earthobservatory.nasa.gov/images/154458/a-spectacle-of-color-off-the-shetland-islands'], ['Pigment variability study', 'https://doi.org/10.1029/95JC00463']] },
  cyano: { title: 'Lake Erie in bloom season', text: 'Elevated PC is analogous to cyanobacteria-rich inland waters. Look for reduced reflectance around 620 nm alongside chlorophyll features. Pigment concentration does not determine toxin concentration.', links: [['NASA · Lake Erie blooms', 'https://science.nasa.gov/earth/earth-observatory/lake-erie-blooms-153282/'], ['Lake Erie bloom study', 'https://doi.org/10.1073/pnas.1216006110']] },
  cdom: { title: 'Rio Negro, Amazon basin', text: 'Dissolved organic compounds strongly remove blue light. With little particle backscattering, the water-leaving signal becomes very dark and may appear tea-colored. Color alone cannot quantify total dissolved carbon.', links: [['NASA · Rio Negro', 'https://science.nasa.gov/earth/earth-observatory/rio-negro-amazonia-brazil-7169/'], ['Rio Negro carbon study', 'https://doi.org/10.1016/j.scitotenv.2020.139193']] },
  sediment: { title: 'Mississippi River plume', text: 'Suspended sediment returns more light toward the surface. This absorbing sediment mixture suppresses blue light and favors a yellow-brown appearance. Mineral composition can change that color substantially.', links: [['NASA · Louisiana sediment plume', 'https://science.nasa.gov/earth/earth-observatory/sediment-plume-off-the-louisiana-coast-91822/'], ['Particle scattering study', 'https://doi.org/10.4319/lo.2003.48.2.0843']] },
  mixed: { title: 'Coastal mixing zones', text: 'Estuaries combine phytoplankton, dissolved color and suspended particles. Several different mixtures can yield similar visible colors, even while their spectra differ.', links: [['NASA · Coastal ocean optics', 'https://earthobservatory.nasa.gov/features/OceanProductivity/page1.php'], ['Coastal absorption study', 'https://doi.org/10.1029/2001JC000882']] }
};

function relevance(s, type) {
  const ecology = s.pc >= 5 ? ['A cyanobacterial pigment signal motivates bloom sampling. Toxicity requires separate measurements; bloom decay can affect oxygen.', 'Where should pigment and toxin samples be collected together?'] : s.chl >= 3 ? ['Phytoplankton biomass influences food webs and potential primary production; light limitation and physiology also matter.', 'Does increasing biomass also increase available light for production?'] : s.cdom >= 0.5 ? ['CDOM limits blue-light availability and connects terrestrial organic matter with aquatic food webs.', 'How does a darker light environment alter the productive layer?'] : s.tss >= 5 ? ['Suspended sediment changes the light environment and may stress submerged plants or benthic habitats.', 'Where might sediment resuspension reduce habitat light?'] : ['A low-pigment optical signal is consistent with low biomass; productivity still depends on nutrients, light and physiology.', 'Can clear water still support important carbon cycling?'];
  const geography = s.cdom >= 0.5 ? ['Map terrestrial dissolved-color transport and changes in river–lake connectivity. CDOM is only the colored fraction of dissolved organic matter.', 'How do flood pulses move dissolved carbon through a watershed?'] : s.pc >= 5 || s.chl >= 3 ? ['Track bloom extent, persistence and transport. Repeated observations reveal spatial patterns; color alone is not a health-risk map.', 'Where do bloom patches repeatedly develop and move?'] : ['Map water masses, plume boundaries and seasonal transport to connect local processes with regional carbon and sediment cycles.', 'Which changes follow runoff, currents or resuspension?'];
  const cs = s.tss >= 5 ? ['Turbid water has nonzero near-infrared Rrs, challenging “black-pixel” atmospheric correction. Sediment composition makes inversion ambiguous.', 'Can your model separate aerosol radiance from water-leaving NIR radiance?'] : s.cdom >= 0.5 ? ['A weak blue water signal is vulnerable to atmospheric-correction residuals. CDOM and pigments both absorb blue light, making inversion non-unique.', 'How much does a small radiance error change the inferred constituents?'] : s.pc >= 5 ? ['The 620 nm pigment feature needs suitable spectral bands. Overlapping absorbers and model mismatch make concentration retrieval nonlinear.', 'Would broad RGB bands preserve the PC absorption feature?'] : ['Water-leaving radiance is a small part of the satellite signal. Different mixtures can produce similar colors, and training data must span the relevant optical states.', 'Can multiple constituent combinations explain the same RGB color?'];
  const agriculture = s.pc >= 5 || s.chl >= 3 ? ['Nutrient losses can promote blooms in receiving waters. A bloom signal can guide catchment investigation but cannot identify a farm or quantify fertilizer runoff.', 'Do bloom changes follow nutrient-delivery and rainfall events?'] : s.tss >= 5 ? ['Sediment plumes can help locate erosion and evaluate soil-retention measures when paired with rainfall, discharge and field observations.', 'Do cover crops or riparian buffers reduce sediment delivery?'] : s.cdom >= 0.5 ? ['Dissolved color can reflect organic soils, wetlands and drainage pathways. Dark color alone does not establish pollution or irrigation suitability.', 'Which drainage pathways carry colored organic matter?'] : ['A low optical signal is a baseline for tracking runoff-related change. Clear-looking water does not establish nutrient levels or irrigation safety.', 'How does the receiving water respond after a major storm?'];
  const geology = s.tss >= 5 ? ['Particle size, mineralogy and iron content change scattering and absorption per unit sediment mass. They affect erosion, transport and deposition interpretations.', 'Would carbonate and iron-rich clay have the same spectrum at equal TSS?'] : s.cdom >= 0.5 ? ['Soils and catchment geology influence drainage chemistry and dissolved organic matter transport; CDOM can obscure weak mineral-particle signals.', 'How do soil horizons and drainage pathways affect water color?'] : ['A weak suspended-mineral signal does not rule out sediment transport at depth. Surface spectra sample the optically visible upper water column.', 'What sediment processes could be invisible to this surface measurement?'];
  return [['Ecologist', ...ecology], ['Geographer / spatial scientist', ...geography], ['Computer scientist / Geo-AI', ...cs], ['Agriculture', ...agriculture], ['Geologist', ...geology]];
}

function spectrumCSV(samples, state) {
  const keys = ['wavelength','aw','aph','apc','ag','ased','bbw','bbph','bbsed','a','bb','u','rrs','Rrs'];
  const headers = ['wavelength_nm','aw_m-1','aph_m-1','apc_m-1','acdom_m-1','ased_m-1','bbw_m-1','bbph_m-1','bbsed_m-1','a_total_m-1','bb_total_m-1','u','rrs_below_sr-1','Rrs_above_sr-1','chl_ug_L','pc_ug_L','cdom440_m-1','sediment_g_m3','water_type'];
  const rows = samples.map(p => [...keys.map(k => p[k]), state.chl, state.pc, state.cdom, state.tss, state.water].join(','));
  return headers.join(',') + '\n' + rows.join('\n') + '\n';
}

// Learning activities reuse the forward model; no spectra or answers are painted in.
const COLOR_CHOICES = ['Blue / blue-green', 'Green / olive', 'Amber / brown', 'Very dark', 'Other hue'];
function colorFamily(color) {
  const name = colorName(color).toLowerCase();
  if (name === 'very dark water') return 'Very dark';
  if (name.includes('blue')) return 'Blue / blue-green';
  if (name.includes('green') || name.includes('olive')) return 'Green / olive';
  if (name.includes('brown')) return 'Amber / brown';
  return 'Other hue';
}
function makeChallenge(index, random = Math.random) {
  const base = Object.values(PRESETS)[index % Object.keys(PRESETS).length];
  const state = { ...base };
  for (const key of Object.keys(CONFIG)) state[key] = Number((base[key] * (0.8 + 0.4 * random())).toFixed(key === 'cdom' ? 3 : 2));
  const spectrum = simulate(state), color = spectrumToColor(spectrum);
  return { state, spectrum, color, answer: colorFamily(color), guess: null, revealed: false };
}
function freezeSpectrum(state) {
  const spectrum = simulate(state);
  return { state: { ...state }, spectrum, color: spectrumToColor(spectrum), axisMax: Math.max(0.001, ...spectrum.map(p => p.Rrs * 1.12)) };
}
function opticalBudget(spectrum, wavelength) {
  const p = spectrum.find(p => p.wavelength === wavelength);
  if (!p) throw new RangeError('Choose a sampled wavelength from 400 to 800 nm.');
  return { point: p, absorption: [['Water',p.aw],['Phytoplankton',p.aph],['Phycocyanin',p.apc],['CDOM',p.ag],['Sediment',p.ased]], backscattering: [['Water',p.bbw],['Phytoplankton-associated particles',p.bbph],['Sediment',p.bbsed],['CDOM (neglected)',0],['PC (cells included in Chl-a)',0]] };
}
const CONCEPTS = [
  { title: 'If only CDOM increases, what happens in this model?', options: ['Blue absorption increases; reflectance decreases.', 'Backscattering increases because CDOM is a particle.', 'The spectrum stays the same.'], correct: 0, explanation: 'CDOM adds exponentially decreasing absorption toward longer wavelengths. It adds no backscattering here. With bb fixed, increasing a decreases u = bb/(a + bb), and therefore Rrs. Fixed display exposure preserves the darkening.', source: 'https://doi.org/10.1029/2001JC000882', experiment: { chl: 1, pc: 0, cdom: 0.02, tss: 0.2, water: 'fresh' }, instruction: 'Reference frozen. Increase only CDOM from 0.02 toward 2 m⁻¹. Compare the blue wavelengths and brightness.' },
  { title: 'Which feature would extra PC most directly strengthen?', options: ['A peak in absorption near 620 nm.', 'A peak in backscattering at 800 nm.', 'A direct optical measurement of toxins.'], correct: 0, explanation: 'The PC term is centered at 620 nm. At fixed Chl-a, added PC reduces Rrs near this band. This model does not add a second set of cells or a second scattering contribution.', source: 'https://doi.org/10.4319/lo.2005.50.1.0237', experiment: { chl: 20, pc: 0, cdom: 0.2, tss: 1, water: 'fresh' }, instruction: 'Reference frozen. Increase only PC from 0 toward 40 μg/L and inspect the change near 620 nm.' },
  { title: 'Does this sediment slider change only backscattering?', options: ['Yes—sediment never absorbs light.', 'No—it adds both absorption and backscattering.', 'It changes pure-water absorption.'], correct: 1, explanation: 'This absorbing sediment mixture contributes to both a and bb. Mineralogy and particle size change their mass-specific coefficients in nature, so equal TSS does not guarantee equal color.', source: 'https://doi.org/10.1029/2001JC000882', experiment: { chl: 1, pc: 0, cdom: 0.1, tss: 0, water: 'marine' }, instruction: 'Reference frozen. Increase only TSS toward 30 g/m³. Open optical contributions to watch absorption and backscattering rise together.' },
  { title: 'Can one RGB color uniquely identify a constituent mixture?', options: ['Yes—every mixture has its own unique color.', 'No—RGB compresses a whole spectrum into three values.', 'Yes—if the color is green.'], correct: 1, explanation: 'Color integration reduces a spectrum to three tristimulus values. Different spectra can give similar colors. Additional wavelengths, measurements and assumptions help constrain constituent retrieval; color alone is not a unique solution.', source: 'https://cie.co.at/datatable/cie-1931-colour-matching-functions-2-degree-observer' },
  { title: 'Does high PC establish that a bloom is toxic?', options: ['Yes—PC and toxin concentration are identical.', 'No—pigment and toxin measurements are different.', 'Only when the water looks dark green.'], correct: 1, explanation: 'PC is a pigment marker, not a toxin assay. Cyanobacterial biomass and bloom appearance cannot determine toxin concentration; separate measurements are needed.', source: 'https://science.nasa.gov/earth/earth-observatory/lake-erie-blooms-153282/' }
];

// Export pure functions for reproducible verification without a browser.
if (typeof module !== 'undefined' && module.exports) module.exports = { simulate, spectrumToColor, spectrumCSV, classify, colorName, sliderToValue, valueToSlider, CONFIG, PRESETS, OPTICAL_TABLE, colorFamily, makeChallenge, freezeSpectrum, opticalBudget, CONCEPTS };

if (typeof document !== 'undefined') boot();
async function boot() {
  // CDN preferred; local vendored fallback keeps the complete folder usable offline.
  if (!window.Chart) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'vendor/chart.umd.js'; script.onload = resolve; script.onerror = resolve;
      document.head.append(script);
    });
  }
  const $ = id => document.getElementById(id);
  let current = { ...PRESETS.ocean }, samples, currentColor, chart;
  let baseline = null, learning = false, round = null, savedExplore = null;
  let challengeIndex = Math.floor(Math.random() * 5), challengeCount = 0, conceptIndex = 0, conceptChecked = false;
  const controls = {};
  for (const [key, config] of Object.entries(CONFIG)) {
    const card = document.createElement('div'); card.className = 'slider-card';
    card.innerHTML = `<label for="${key}-range">${config.label}</label><span class="unit">${config.unit}</span><div class="number-row"><input id="${key}-number" type="number" min="0" max="${config.max}" step="${config.step}" inputmode="decimal" aria-label="${config.label}, ${config.unit}" aria-describedby="${key}-hint"><span class="unit">${config.unit}</span></div><input id="${key}-range" type="range" min="0" max="1000" step="1" aria-describedby="${key}-hint"><div class="range-labels"><span>0</span><span>${config.max} ${config.unit}</span></div><p class="hint" id="${key}-hint">${config.hint}</p>`;
    $('sliders').append(card);
    controls[key] = { range: $(`${key}-range`), number: $(`${key}-number`) };
    controls[key].range.addEventListener('input', e => {
      const raw = sliderToValue(Number(e.target.value), config);
      current[key] = Number(raw.toFixed(key === 'cdom' ? 3 : 2));
      controls[key].number.value = current[key];
      updateRange(key); setCustom(); update();
    });
    controls[key].number.addEventListener('input', e => {
      const value = e.target.valueAsNumber;
      if (!Number.isFinite(value) || value < 0 || value > config.max) {
        e.target.setCustomValidity(`Enter a number from 0 to ${config.max}.`);
        e.target.setAttribute('aria-invalid', 'true');
        return;
      }
      e.target.setCustomValidity(''); e.target.removeAttribute('aria-invalid');
      current[key] = value; updateRange(key); setCustom(); update();
    });
    controls[key].number.addEventListener('change', e => {
      if (!e.target.validity.valid) { e.target.value = current[key]; e.target.setCustomValidity(''); e.target.removeAttribute('aria-invalid'); }
    });
  }
  function updateRange(key) {
    controls[key].range.value = valueToSlider(current[key], CONFIG[key]);
    controls[key].range.setAttribute('aria-valuetext', `${current[key]} ${CONFIG[key].unit}`);
  }
  function sync() {
    for (const key of Object.keys(CONFIG)) {
      controls[key].number.value = current[key]; controls[key].number.setCustomValidity(''); controls[key].number.removeAttribute('aria-invalid'); updateRange(key);
    }
    $('water-type').value = current.water;
  }
  function setCustom() {
    document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    $('scenario-name').textContent = 'Your mixture · not a field measurement';
  }
  function setPreset(key) {
    current = { ...PRESETS[key] }; sync();
    document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === key)));
    $('scenario-name').textContent = 'Illustrative scenario · not a field measurement'; update();
  }
  $('presets').addEventListener('click', e => { const key = e.target.closest('button')?.dataset.preset; if (key) setPreset(key); });
  $('reset').addEventListener('click', () => setPreset('ocean'));
  $('water-type').addEventListener('change', e => { current.water = e.target.value; setCustom(); update(); });

  const bandPlugin = {
    id: 'spectralBands', beforeDatasetsDraw(c) {
      const { ctx, chartArea: area, scales: { x } } = c;
      if (!area) return;
      ctx.save(); ctx.fillStyle = '#f2f4f6'; ctx.fillRect(x.getPixelForValue(700), area.top, area.right - x.getPixelForValue(700), area.bottom - area.top);
      ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (const [nm, label] of [[440, 'Chl-a'], [620, 'PC'], [675, 'Chl-a']]) {
        const px = x.getPixelForValue(nm); ctx.strokeStyle = '#b9cbd2'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(px, area.top + 17); ctx.lineTo(px, area.bottom); ctx.stroke(); ctx.fillStyle = '#667e88'; ctx.fillText(label, px, area.top + 2);
      }
      ctx.restore();
    }
  };
  if (window.Chart) {
    chart = new Chart($('spectrum'), {
      type: 'line', data: { datasets: [{ label: 'Rrs', data: [], borderColor: '#0782a1', backgroundColor: '#0782a10b', fill: true, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, tension: 0 }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, parsing: false,
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        plugins: { legend: { display: false }, tooltip: { displayColors: false, callbacks: {
          title: items => `${items[0].parsed.x} nm`, label: item => `${item.datasetIndex === 1 ? 'Baseline' : 'Current'} Rrs = ${item.parsed.y.toFixed(6)} sr⁻¹`,
          afterLabel: item => { const p = (item.datasetIndex === 1 ? baseline.spectrum : samples)[item.dataIndex]; return [`a = ${p.a.toFixed(4)} m⁻¹`, `bb = ${p.bb.toFixed(4)} m⁻¹`]; }
        } } },
        scales: {
          x: { type: 'linear', min: 400, max: 800, title: { display: true, text: 'Wavelength (nm)', color: '#526871' }, grid: { display: false }, ticks: { stepSize: 50, color: '#526871', font: { size: 11 } } },
          y: { min: 0, title: { display: true, text: 'Rrs (sr⁻¹)', color: '#526871' }, grid: { color: '#eaf0f2' }, ticks: { color: '#526871', maxTicksLimit: 6, callback: v => Number(v).toFixed(3), font: { size: 11 } } }
        }
      }, plugins: [bandPlugin]
    });
  }
  $('fixed-scale').addEventListener('change', () => update());

  const surface = createWaterSurface($('water'), $('motion'));
  function update() {
    samples = simulate(current); currentColor = spectrumToColor(samples);
    if (chart) {
      chart.data.datasets[0].data = samples.map(p => ({ x: p.wavelength, y: p.Rrs }));
      chart.data.datasets.length = 1;
      if (baseline) {
        chart.data.datasets.push({ label: 'Frozen baseline', data: baseline.spectrum.map(p => ({ x: p.wavelength, y: p.Rrs })), borderColor: '#906b91', borderDash: [6,4], borderWidth: 2, pointRadius: 0, fill: false, tension: 0 });
        baseline.axisMax = Math.max(baseline.axisMax, ...samples.map(p => p.Rrs * 1.12));
      }
      chart.options.scales.y.max = baseline ? baseline.axisMax : $('fixed-scale').checked ? 0.06 : undefined;
      chart.update('none');
      const clipped = !baseline && $('fixed-scale').checked && samples.some(p => p.Rrs > 0.06);
      $('chart-status').textContent = baseline ? 'Solid: current · dashed: frozen baseline. Shared axis stays fixed, expanding only if needed to fit the data.' : clipped ? 'Some values exceed the locked scale. Unlock to inspect the complete spectrum.' : $('fixed-scale').checked ? 'Vertical scale locked for comparison. Dashed lines mark pigment absorption bands.' : 'Vertical axis rescales automatically. Dashed lines mark pigment absorption bands.';
    } else {
      $('chart-status').textContent = 'Chart library unavailable. The model is running; expand the spectrum data table below.';
    }
    const peak = samples.reduce((a, b) => b.Rrs > a.Rrs ? b : a);
    $('peak-readout').textContent = `Peak: ${peak.wavelength} nm · ${peak.Rrs.toFixed(4)} sr⁻¹`;
    $('swatch').style.backgroundColor = currentColor.hex; $('hex').textContent = currentColor.hex.toUpperCase();
    $('color-description').textContent = colorName(currentColor);
    $('water').setAttribute('aria-label', `Illustrative rippled surface. Spectrum-derived color: ${colorName(currentColor)}, ${currentColor.hex}.`);
    surface.setColor(currentColor.linear);
    updateContext();
    if ($('data-details').open) updateData();
    updateLearningVisibility(); updateComparison();
    if ($('optical-budget').open) updateBudget();
  }
  function updateContext() {
    const c = classify(current, samples), p = c.green;
    $('case-title').textContent = c.case2 ? 'Case 2-like · complex mixture' : 'Case 1-like · oceanic / biological';
    $('case-text').textContent = c.case2 ? `Independent CDOM or sediment has substantial optical influence. At 440 nm, CDOM + sediment absorption is ${(c.blue.ag + c.blue.ased).toFixed(3)} m⁻¹ versus ${(c.blue.aph + c.blue.apc).toFixed(3)} m⁻¹ for pigments. See the rule below.` : `This mixture meets the teaching rule for weak independent CDOM/sediment influence or phytoplankton dominance. ${current.pc >= 5 ? 'Elevated PC still makes a generic chlorophyll-only inversion unreliable.' : 'Natural Case 1 waters require covariation between phytoplankton and their associated material.'}`;
    const sedimentBoost = p.bbsed / p.bb > 0.5;
    $('dominance-title').textContent = p.bb >= p.a ? 'Backscattering exceeds absorption' : sedimentBoost ? 'Absorption-led, sediment-brightened' : 'Absorption exceeds backscattering';
    const driver = c.absorber[1] > 0.002 ? `${c.absorber[0]} is the largest non-water blue absorber.` : 'Non-water absorption is weak; water strongly removes red light.';
    $('dominance-text').textContent = `At 550 nm, a = ${p.a.toFixed(3)} m⁻¹ and bb = ${p.bb.toFixed(4)} m⁻¹. ${driver} ${sedimentBoost ? 'Sediment supplies most backscattering, returning more light even while absorption can remain larger.' : 'Absorption removes photons; backscattering returns a fraction toward the surface.'}`;
    $('ratio-label').textContent = 'Reflectance balance u at 550 nm'; $('ratio-value').textContent = p.u.toFixed(3);
    $('ratio-bar').style.width = `${100 * p.u}%`;
    const counterpart = COUNTERPARTS[c.state];
    const concurrent = [];
    if (current.pc >= 5 && c.state !== 'cyano') concurrent.push('PC');
    if (current.tss >= 5 && c.state !== 'sediment') concurrent.push('sediment');
    if (current.cdom >= 0.5 && c.state !== 'cdom') concurrent.push('CDOM');
    if (current.chl >= 3 && !['cyano', 'bloom'].includes(c.state)) concurrent.push('Chl-a');
    $('geo-title').textContent = counterpart.title;
    $('geo-text').textContent = counterpart.text + (concurrent.length ? ` Your mixture also has elevated ${concurrent.join(' and ')}, so this single counterpart is incomplete.` : '');
    $('geo-links').replaceChildren(...counterpart.links.map(([label, url]) => { const a = document.createElement('a'); a.href = url; a.textContent = label + ' ↗'; return a; }));
    $('why-body').replaceChildren(...relevance(current, c.state).map(row => { const tr = document.createElement('tr'); row.forEach((text, i) => { const cell = document.createElement(i === 0 ? 'th' : 'td'); if (i === 0) { cell.scope = 'row'; cell.style.cssText = 'background:white;color:#122f3c;font-size:14px;width:21%'; } cell.textContent = text; tr.append(cell); }); return tr; }));
    const notes = [];
    if (current.pc > 0 && current.chl < 0.1) notes.push('PC with almost no Chl-a is an artificial pigment-isolation experiment: living PC-bearing cyanobacteria also contain chlorophyll.');
    if (current.chl > 25 || current.pc > 80 || current.tss > 50) notes.push('Extreme mixture: fixed pigment shapes, particle coefficients and the simple reflectance relation are qualitative extrapolations here.');
    if (currentColor.clipped) notes.push('The calculated color exceeds the sRGB display gamut; one or more channels are clipped. The spectrum is unchanged.');
    $('validity-note').hidden = !notes.length; $('validity-note').textContent = notes.join(' ');
  }
  function updateData() {
    $('spectrum-data').replaceChildren(...samples.map(p => { const tr = document.createElement('tr'); [p.wavelength, p.a.toFixed(6), p.bb.toFixed(6), p.Rrs.toFixed(7)].forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.append(td); }); return tr; }));
  }
  $('data-details').addEventListener('toggle', () => { if ($('data-details').open) updateData(); });
  $('download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([spectrumCSV(samples, current)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'water-optics-spectrum.csv';
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
  function updateComparison() {
    $('clear-baseline').hidden = !baseline;
    $('baseline-info').hidden = !baseline;
    $('freeze').textContent = baseline ? 'Replace frozen baseline' : 'Freeze this spectrum';
    $('fixed-scale').disabled = !!baseline;
    $('scale-label').textContent = baseline ? 'Scale managed by comparison' : 'Lock vertical scale (0–0.06)';
    if (!baseline) { $('comparison-status').textContent = 'Keep a dashed reference curve, then change one constituent to compare.'; return; }
    const b = baseline.state;
    $('baseline-swatch').style.background = baseline.color.hex;
    $('baseline-description').textContent = `Frozen: Chl-a ${b.chl} μg/L · PC ${b.pc} μg/L · CDOM ${b.cdom} m⁻¹ · TSS ${b.tss} g/m³ · ${b.water === 'fresh' ? 'freshwater' : 'seawater'}. ${colorName(baseline.color)}.`;
    const changes = Object.keys(CONFIG).filter(k => current[k] !== b[k]).map(k => CONFIG[k].label);
    if (current.water !== b.water) changes.push('water baseline');
    $('comparison-status').textContent = changes.length ? `Changed: ${changes.join(', ')}. ${changes.length > 1 ? 'Several inputs changed; isolate one to test cause and effect.' : 'One input changed—compare its spectral effect.'}` : 'Baseline captured. Change one constituent; the dashed curve and reference swatch stay fixed.';
  }
  $('freeze').addEventListener('click', () => { baseline = freezeSpectrum(current); update(); });
  $('clear-baseline').addEventListener('click', () => { baseline = null; update(); });
  function updateBudget() {
    const nm = Number($('budget-wavelength').value), budget = opticalBudget(samples, nm), p = budget.point;
    $('budget-nm').textContent = `${nm} nm`;
    $('abs-total').textContent = `Total: ${p.a.toFixed(5)} m⁻¹`;
    $('bb-total').textContent = `Total: ${p.bb.toFixed(5)} m⁻¹`;
    function rows(id, terms, total) {
      $(id).replaceChildren(...terms.map(([name,value]) => {
        const row = document.createElement('div'); row.className = 'budget-row';
        const label = document.createElement('div'), nameEl = document.createElement('span'), valueEl = document.createElement('span');
        nameEl.textContent = name; valueEl.textContent = `${value.toExponential(3)} m⁻¹ · ${(100*value/total).toFixed(1)}%`;
        label.append(nameEl,valueEl);
        const track = document.createElement('div'), bar = document.createElement('div'); track.className = 'budget-track'; track.setAttribute('aria-hidden','true'); bar.style.width = `${100*value/total}%`; track.append(bar); row.append(label,track); return row;
      }));
    }
    rows('abs-bars',budget.absorption,p.a); rows('bb-bars',budget.backscattering,p.bb);
    $('budget-balance').textContent = `At ${nm} nm: u = bb/(a + bb) = ${p.u.toFixed(5)} → Rrs = ${p.Rrs.toFixed(6)} sr⁻¹. These are the same terms used in the spectrum above.`;
  }
  $('budget-wavelength').addEventListener('input',updateBudget);
  $('optical-budget').addEventListener('toggle', () => { if ($('optical-budget').open) updateBudget(); });
  function choices(container, name, labels, onChange) {
    container.replaceChildren();
    const legend = document.createElement('legend'); legend.textContent = 'Choose one answer'; container.append(legend);
    labels.forEach((text,i) => { const label = document.createElement('label'); label.className = 'choice'; const input = document.createElement('input'); input.type = 'radio'; input.name = name; input.value = String(i); input.addEventListener('change',()=>onChange(i)); label.append(input,document.createTextNode(text)); container.append(label); });
  }
  function updateLearningVisibility() {
    const hidden = learning && !round.revealed;
    $('learning').hidden = !learning;
    $('appearance-content').hidden = hidden; $('appearance-hidden').hidden = !hidden;
    // Hide all obvious clues, including screen-reader content, until the reveal.
    [document.querySelector('.scenario-bar'),$('constituents'),document.querySelector('.context'),document.querySelector('.why'),$('model'),$('comparison'),$('optical-budget')].forEach(el => { el.hidden = hidden; });
    $('concept-check').hidden = !learning || hidden;
    $('explore-mode').setAttribute('aria-pressed',String(!learning)); $('learn-mode').setAttribute('aria-pressed',String(learning));
    $('mode-description').textContent = learning ? 'Predict, reveal, then experiment. Your Explore mixture is saved.' : 'Explore freely, or try a spectrum-to-color challenge.';
  }
  function nextChallenge() {
    round = makeChallenge(challengeIndex++); challengeCount++;
    current = { ...round.state }; baseline = null; $('fixed-scale').checked = false;
    $('prediction-feedback').hidden = true; $('prediction-feedback').textContent = '';
    $('reveal').disabled = true; $('reveal').textContent = 'Reveal water & explanation';
    choices($('prediction-options'),'prediction',COLOR_CHOICES,i=> { round.guess = COLOR_CHOICES[i]; $('reveal').disabled = false; });
    $('challenge-count').textContent = `Challenge ${challengeCount}`;
    sync(); setCustom(); update();
  }
  function setMode(next) {
    if (next === learning) return;
    if (next) {
      savedExplore = { state: { ...current }, baseline, fixed: $('fixed-scale').checked, preset: document.querySelector('[data-preset][aria-pressed="true"]')?.dataset.preset, label: $('scenario-name').textContent };
      learning = true; nextChallenge(); renderConcept();
    } else {
      learning = false; current = { ...savedExplore.state }; baseline = savedExplore.baseline; $('fixed-scale').checked = savedExplore.fixed;
      sync(); setCustom();
      if (savedExplore.preset) document.querySelector(`[data-preset="${savedExplore.preset}"]`).setAttribute('aria-pressed','true');
      $('scenario-name').textContent = savedExplore.label; update();
    }
  }
  $('learn-mode').addEventListener('click',()=>setMode(true)); $('explore-mode').addEventListener('click',()=>setMode(false));
  $('next-challenge').addEventListener('click',nextChallenge);
  $('reveal').addEventListener('click',()=> {
    if (!round.guess || round.revealed) return;
    round.revealed = true;
    $('prediction-options').querySelectorAll('input').forEach(el=>el.disabled=true);
    $('reveal').disabled = true; $('reveal').textContent = 'Water revealed';
    const peak = round.spectrum.reduce((a,b)=>a.Rrs>b.Rrs?a:b);
    const feedback = $('prediction-feedback'); feedback.hidden = false;
    feedback.textContent = `${round.guess === round.answer ? 'Good prediction.' : 'Compare your prediction with the model.'} You chose ${round.guess.toLowerCase()}; the calculated family is ${round.answer.toLowerCase()} (${colorName(round.color).toLowerCase()}). The largest modeled Rrs is at ${peak.wavelength} nm, but color depends on the whole visible spectrum weighted by daylight and human vision—not just its highest point. This answer refers to the starting mixture. Now freeze it and change one slider to explore.`;
    update();
  });
  function renderConcept() {
    const q = CONCEPTS[conceptIndex]; conceptChecked = false;
    $('concept-title').textContent = q.title; $('concept-feedback').hidden = true; $('concept-feedback').textContent = '';
    $('check-concept').disabled = true; $('try-concept').hidden = true;
    choices($('concept-options'),'concept',q.options,()=> { $('check-concept').disabled = false; });
  }
  $('check-concept').addEventListener('click',()=> {
    const selected = $('concept-options').querySelector('input:checked'); if (!selected || conceptChecked) return;
    conceptChecked = true; const q = CONCEPTS[conceptIndex];
    const feedback = $('concept-feedback'); feedback.hidden = false;
    feedback.textContent = `${Number(selected.value) === q.correct ? 'Correct. ' : 'Not quite. '} ${q.explanation} `;
    const a = document.createElement('a'); a.href = q.source; a.textContent = 'Scientific reference ↗'; feedback.append(a);
    $('concept-options').querySelectorAll('input').forEach(el=>el.disabled=true); $('check-concept').disabled = true; $('try-concept').hidden = !q.experiment;
  });
  $('next-concept').addEventListener('click',()=> { conceptIndex = (conceptIndex+1)%CONCEPTS.length; renderConcept(); });
  $('try-concept').addEventListener('click',()=> {
    const q = CONCEPTS[conceptIndex]; if (!q.experiment) return;
    current = { ...q.experiment }; baseline = freezeSpectrum(current); sync(); setCustom(); update();
    $('concept-feedback').textContent = `${q.explanation} ${q.instruction}`;
    $('constituents').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
  sync(); update();
  // Small inspection API for teaching, QA and downstream experiments.
  window.WaterOptics = { simulate, spectrumToColor, classify, presets: PRESETS, getState: () => ({ ...current }), getSpectrum: () => samples.map(p => ({ ...p })) };
}

/** Procedural wave-normal illustration. Its light modulation never enters Rrs.
 * Broad + short gravity-wave-like components make the patch read as water.
 * Color is supplied only by the spectrumToColor result.
 */
function createWaterSurface(canvas, button) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const width = 420, height = 265; canvas.width = width; canvas.height = height;
  const frame = ctx.createImageData(width, height);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches, visible = true, color = [0.01, 0.02, 0.04], raf = 0, last = 0, phase = 0;
  // An sRGB lookup avoids expensive exponentiation for every pixel and frame.
  const lut = Uint8Array.from({ length: 4097 }, (_, i) => Math.round(255 * srgbEncode(i / 4096)));
  const waves = [[10, 20, .11, .18], [-18, 31, .065, -.22], [33, 48, .035, .29], [-44, 72, .02, -.35], [70, 105, .012, .42], [122, 157, .006, -.5]];
  function draw(t) {
    for (let y = 0; y < height; y++) {
      const vy = y / height;
      for (let x = 0; x < width; x++) {
        const vx = x / width; let nx = 0, ny = 0;
        for (const [kx, ky, amplitude, speed] of waves) {
          const angle = kx * vx + ky * vy + 1.5 * Math.sin(vx * 5 + vy * 7) + t * speed;
          const slope = Math.cos(angle) * amplitude; nx += slope * kx / 20; ny += slope * ky / 25;
        }
        const normal = 1 / Math.sqrt(1 + nx * nx + ny * ny);
        const highlight = Math.max(0, (-nx * .3 - ny * .5 + 1) * normal / Math.sqrt(1.34));
        const glint = Math.pow(Math.min(highlight, 1), 90) * .08 + Math.pow(highlight, 10) * .008;
        const shade = .65 + .32 * normal + .28 * nx;
        const offset = (y * width + x) * 4;
        for (let k = 0; k < 3; k++) frame.data[offset + k] = lut[Math.round(clamp(color[k] * shade + glint, 0, 1) * 4096)];
        frame.data[offset + 3] = 255;
      }
    }
    ctx.putImageData(frame, 0, 0);
  }
  function tick(now) {
    raf = 0;
    if (paused || !visible || document.hidden) return;
    if (now - last > 65) { phase += Math.min(now - last, 100) / 1000; draw(phase); last = now; }
    raf = requestAnimationFrame(tick);
  }
  function schedule() { if (!raf && !paused && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function updateButton() { button.textContent = paused ? 'Play ripples' : 'Pause ripples'; button.setAttribute('aria-pressed', String(paused)); }
  button.addEventListener('click', () => { paused = !paused; updateButton(); schedule(); });
  reducedMotion.addEventListener('change', e => { paused = e.matches; updateButton(); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }).observe(canvas);
  updateButton();
  return { setColor: next => { color = next; draw(phase); schedule(); } };
}
