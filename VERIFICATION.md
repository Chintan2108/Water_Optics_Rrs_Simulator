# Verification record

2026-09-16

- 12 automated model/export tests passed (Node built-in test runner).
- Published water-absorption anchor values and cm^-1-to-m^-1 conversions checked.
- Original CIE observer and D65 files match their published MD5 checksums.
- All zero/max constituent corner combinations produce finite nonnegative optical terms and bounded reflectance.
- Absorption-only CDOM and PC perturbations, sediment perturbations, freshwater scattering baseline, and daylight-white color integration checked.
- Browser: all five presets update the spectrum, surface color, geography and context.
- Numeric controls synchronize with sliders; invalid negative input is flagged and does not contaminate the model. Keyboard End reaches the slider maximum.
- Fixed-axis toggle, 81-row spectrum table, freshwater dropdown, reset, and ripple pause/play verified.
- Desktop layout inspected at 1440 px; phone layout inspected at 390 px, with document width equal to viewport width (no page-level horizontal overflow).
- No browser JavaScript errors or warnings reported during interactive checks.
- CSV structure and exact numerical values verified by automated test. The in-app browser download-event monitor timed out, so file-saving behavior in that browser was not confirmed; the standard Blob/download implementation remains available in ordinary browsers.
- All local HTML asset links resolve. Chart.js is pinned to 4.4.8 with a complete local fallback and license. Offline behavior was checked by code inspection, not a disconnected browser run.

These are implementation and internal-consistency checks, not field validation of the bio-optical parameterization. No measured Rrs matchup or prediction-error claim is made.
