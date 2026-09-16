# Data provenance and modeling assumptions

Retrieved 2026-09-16. Original downloaded files are retained unchanged, including their headers. No raw source table is presented as a measured Rrs spectrum.

## Numerical reference data

1. `pope97.txt`: https://omlc.org/spectra/water/data/pope97.txt — R. M. Pope and E. S. Fry (1997), *Absorption spectrum (380–700 nm) of pure water. II. Integrating cavity measurements*, Applied Optics 36, 8710–8723, https://doi.org/10.1364/AO.36.008710. We use 400–700 nm only, multiply source cm^-1 by 100, and linearly interpolate.
2. `smith81.txt`: https://omlc.org/spectra/water/data/smith81.txt — R. C. Smith and K. S. Baker (1981), *Optical properties of the clearest natural waters (200–800 nm)*, Applied Optics 20, 177–184, https://doi.org/10.1364/AO.20.000177. We use 710–800 nm, convert cm^-1 to m^-1, and interpolate from Pope/Fry's 700 nm endpoint to Smith/Baker's 710 nm endpoint. This splice and the coarse 10 nm NIR table are approximations. OMLC compilation maintained by Scott Prahl.
3. `bricaud95.txt`: https://omlc.org/spectra/water/data/bricaud95.txt — tabulation attributed to A. Bricaud, M. Babin, A. Morel and H. Claustre (1995), https://doi.org/10.1029/95JC00463. **Used only as a normalized spectral shape.** The file's absorption column is divided by its 440 nm value; units cancel. The app independently assumes a*ph(440)=0.040 m²/mg and scales linearly with Chl. This avoids claiming that the file supplies the full A(λ), B(λ) parameterization. We do not apply or claim that complete model. Above 700 nm, the shape uses a chosen exponential tail with 10 nm e-folding length.
4. `CIE_xyz_1931_2deg.csv`: CIE 2019, *Colour-matching functions of CIE 1931 standard colorimetric observer*, https://doi.org/10.25039/CIE.DS.xvudnb9b, https://cie.co.at/datatable/cie-1931-colour-matching-functions-2-degree-observer. Download: https://files.cie.co.at/Publications-datasets/CIE_xyz_1931_2deg.csv. MD5: `17cca777db64b17170f06f67ce9d3ab7`.
5. `CIE_std_illum_D65.csv`: CIE 2019, *CIE standard illuminant D65*, https://doi.org/10.25039/CIE.DS.hjfjmt59, https://cie.co.at/datatable/cie-standard-illuminant-d65. Download: https://files.cie.co.at/Publications-datasets/CIE_std_illum_D65.csv. MD5: `03d4eb9b837c60671627c946fb534deb`.

CIE data © International Commission on Illumination (CIE), Vienna, Austria. Licensed under **CC BY-SA 4.0**, https://creativecommons.org/licenses/by-sa/4.0/. Original metadata files are included. Adaptation: sampled at 5 nm from 400–800 nm and embedded in the reference table in app.js, with the CIE-derived table remaining under CC BY-SA 4.0. No endorsement by CIE is implied. The downloaded full-resolution originals are unchanged.

## Equations and choices

- Gordon-type relation and above/below-surface conversion: IOCCG QAA-v6, https://www.ioccg.org/groups/Software_OCA/QAA_v6_2014209.pdf. g0=0.089, g1=0.1245; Rrs=0.52rrs/(1−1.7rrs).
- PC peak a*=0.007 m²/mg is a literature-used coefficient: *Remote sensing of freshwater cyanobacteria: An extended IOP Inversion Model of Inland Waters (IIMIW) for partitioning absorption coefficient and estimating phycocyanin*, https://www.sciencedirect.com/science/article/pii/S0034425714002223. **Gaussian profile σ=18 nm is author-chosen**, not a digitized measured PC spectrum. Simis et al. (2005), https://doi.org/10.4319/lo.2005.50.1.0237, documents the 620 nm feature and variability in PC-specific absorption. It is not appropriate to treat one coefficient as a universal physiological constant.
- CDOM fixed slope 0.018 nm^-1 is a representative choice within commonly used exponential descriptions, not a globally fitted constant. Coastal absorption variability: Babin et al. (2003), https://doi.org/10.1029/2001JC000882.
- Sediment absorption: a_sed=0.041*TSS*exp[−0.0123(λ−443)]. Representative non-algal particle parameterization discussed in Ruddick et al. (2006), https://doi.org/10.4319/lo.2006.51.2.1167, based on Babin et al. (2003). Different mineral assemblages require different coefficients.
- Molecular-water backscatter: bbw=b1(λ/500)^−4.32, b1=0.00111 m^-1 (freshwater) or 0.00144 m^-1 (marine), Morel-type relationship also documented by Gege (2012), https://elib.dlr.de/75266/1/Gege_2012_Ed.pdf.
- Phytoplankton-associated backscatter: **assumed** 0.0006*Chl^0.8*(550/λ). This is a representative teaching relationship, not a fit claimed from a cited dataset.
- Sediment backscatter: 0.01*TSS*(550/λ)^0.5. The 0.01 m²/g scale combines coastal b*=0.5 m²/g (Babin et al., 2003, https://doi.org/10.4319/lo.2003.48.2.0843) with **assumed** backscatter fraction 0.02. The spectral exponent 0.5 is also assumed. There is no claim that the study establishes a universal bb/TSS law.
- XYZ-to-linear-sRGB matrix uses the conventional D65 transform. Fixed exposure 3 is a display choice. Negative or >1 linear channels are clipped and reported. Surface shading is illustrative.

## Geographic counterparts

- Cyanobacteria: NASA, https://science.nasa.gov/earth/earth-observatory/lake-erie-blooms-153282/; Michalak et al. (2013), https://doi.org/10.1073/pnas.1216006110.
- Blackwater: NASA, https://science.nasa.gov/earth/earth-observatory/rio-negro-amazonia-brazil-7169/; Rio Negro photo-oxidation study (2020), https://doi.org/10.1016/j.scitotenv.2020.139193.
- Sediment: NASA, https://science.nasa.gov/earth/earth-observatory/sediment-plume-off-the-louisiana-coast-91822/; Babin particle-scattering study above.
- Productive shelf water: NASA, https://www.earthobservatory.nasa.gov/images/154458/a-spectacle-of-color-off-the-shetland-islands. The example supports a qualitative analogy only; this app does not model coccolith scattering or reproduce that image.
- Open ocean: NASA chlorophyll maps, https://science.nasa.gov/earth/earth-observatory/global-maps/chlorophyll/; Bricaud phytoplankton study above. The map palette itself is a data visualization, not a true-color photograph.
- Classification: IOCCG, https://ioccg.org/group/owt/. The app's numeric classification and geography thresholds are author-chosen teaching heuristics, not thresholds attributed to IOCCG.
