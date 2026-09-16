# Water Optics Lab

A single-page educational water-optics simulator, ready for GitHub Pages. Open `index.html` to use it. No server, account, API key, installation, or build step is needed.

## Deploy on GitHub Pages

1. Copy **the contents of this folder**, including `vendor/`, into a GitHub repository root. Alternatively, place the contents in that repository's `docs/` directory.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your branch (usually `main`), then select **/(root)** or **/docs** to match step 1. Save.
4. Open the Pages URL provided by GitHub when deployment completes.

For the current Pages publishing options, see [GitHub’s official guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

All local asset URLs are relative, so repository-subpath sites work. `.nojekyll` is included. The app has no analytics or backend and sends no entered concentrations anywhere. External study links need internet.

## Files

- `index.html` — application, explanatory methods, scientific links, accessible controls.
- `style.css` — responsive layout, styling, focus states and reduced-motion support.
- `app.js` — forward model, embedded reference tables, CIE color integration, chart, surface illustration, context and CSV export.
- `vendor/chart.umd.js` — Chart.js 4.4.8 local fallback. The page first tries the pinned CDN version as requested; if unavailable it loads this file. Keep this folder for offline use.
- `data/` — downloaded optical/color references and attribution metadata. No live data requests are needed at runtime.
- `prepare-data.py` — optional maintainer tool that reproducibly embeds the bundled optical reference data into `app.js`; verifies the CIE checksums.
- `tests/model.test.cjs` — optical/model regression checks using Node's built-in test runner.

## The scientific contract

The app **calculates**, rather than draws or invents, every Rrs value using:

```
a = aw + aph + apc + acdom + ased
bb = bbw + bbph + bbsed
u = bb / (a + bb)
rrs = 0.089*u + 0.1245*u*u
Rrs = 0.52*rrs / (1 - 1.7*rrs)
```

Rrs is above-surface water-leaving remote-sensing reflectance in sr^-1. rrs is the below-surface quantity. The coefficients and conversion are documented in IOCCG's QAA-v6; this is the **forward relation**, not the inverse QAA algorithm.

This does **not** make the model a validated concentration-to-spectrum predictor. The fixed phytoplankton template, PC Gaussian width, biomass backscattering, sediment properties, molecular-water approximations and geometry impose real limitations. Their exact equations and attribution appear in the app's expandable methods section and in `data/SOURCES.md`. No empirical accuracy or uncertainty interval is claimed. Presets are invented *concentration scenarios*, clearly labeled as illustrative, never claimed to be field measurements.

### Constituents and units

- Chl-a: 0–100 μg/L (numerically mg/m³), representing total phytoplankton chlorophyll, including cyanobacteria.
- PC: 0–100 μg/L, extra pigment absorption at fixed total Chl-a. Cells are not added again for scattering. Very low Chl with PC is flagged as an artificial isolation experiment.
- CDOM: 0–5 m^-1 absorption at 440 nm, **not a mass concentration**. Gelbstoff is the same component.
- TSS: 0–100 g/m³ (numerically mg/L). For optical bookkeeping this slider represents **non-algal suspended sediment**, not laboratory total solids inclusive of algae. No universal conversion from measured TSS to this model is implied.
- The freshwater/seawater selector changes only molecular backscattering. Presets select their stated baseline.

The reference phytoplankton shape is not a species-specific cyanobacteria spectrum. Accessory pigments and packaging can alter real bloom spectra. The PC Gaussian is a transparent approximation centered on the literature absorption band. Values above Chl 25, PC 80 or sediment 50 are explicitly flagged as qualitative extrapolations; other settings still are not validated predictions.

### Color and surface rendering

At 5 nm spacing, the app integrates πRrs × D65 × CIE 1931 observer functions from 400–800 nm. The integral is normalized by the daylight white-reference Y integral, transformed to linear sRGB, multiplied by a **fixed exposure of 3**, clipped, and sRGB-encoded. Increasing CDOM therefore darkens the same mixture instead of being canceled by per-spectrum brightness normalization. Below-400 nm light is omitted; the contribution to perceived visible color is small but not zero.

The circular swatch shows this spectrum-derived result. The canvas adds procedural wave-normal shading and small neutral highlights for an illustrative surface. It is not a calibrated radiative-transfer rendering of sky reflections, wind or sun glint. Neither the ripples nor the exposure changes Rrs. Motion can be paused and respects system reduced-motion settings.

### Interpretation

Case 1-like/Case 2-like labels use the transparent rules displayed in the app. Real Case 1 depends on **covariation** of phytoplankton and their associated material; four independent sliders cannot establish this. PC alone is not a Case 2 criterion.

Radiative balance compares **a with bb**, not total scattering b. High TSS can brighten water while absorption still exceeds backscattering. Geographic examples are qualitative analogies, with NASA and research links. Mixed high constituents are explicitly called out. The relevance table does not infer toxins, nutrient loads, pollution sources or irrigation safety from color.

## Verify or modify

With Node installed, run from this folder:

```
node --test tests/model.test.cjs
```

To regenerate the embedded table from the original files (Python 3, standard library only):

```
python3 prepare-data.py
```

The model functions are exported for Node tests and available through `window.WaterOptics` in the browser. CSV export includes concentrations, all absorption/backscattering terms, and both below- and above-surface reflectance. There is no chart interpolation or smoothing between the physically computed samples beyond straight line segments.

See `data/SOURCES.md` and `vendor/LICENSE.md` for source attributions and third-party notices.
