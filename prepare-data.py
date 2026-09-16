"""Rebuild app.js reference table from the bundled originals (no network).
Only needed by maintainers. Deployment requires no Python or build step.
"""
from pathlib import Path
import csv
import hashlib
import json
import math
import re

ROOT = Path(__file__).resolve().parent

def optical(name):
    rows = []
    for line in (ROOT / 'data' / name).read_text(encoding='latin1').splitlines():
        parts = line.split()
        try:
            if len(parts) == 2:
                rows.append(tuple(map(float, parts)))
        except ValueError:
            pass
    assert rows and all(rows[i][0] < rows[i+1][0] for i in range(len(rows)-1))
    return rows

def interpolate(rows, x):
    for (x1,y1), (x2,y2) in zip(rows, rows[1:]):
        if x1 <= x <= x2:
            return y1 + (y2-y1)*(x-x1)/(x2-x1)
    raise ValueError(f'Outside source support: {x}')

pope, smith, phy = [optical(f) for f in ['pope97.txt','smith81.txt','bricaud95.txt']]
# Use Pope/Fry only through 700 nm even though the OMLC file has extra rows.
water = [(x,y*100) for x,y in pope if 400 <= x <= 700] + [(x,y*100) for x,y in smith if 710 <= x <= 800]
for name, expected in [('CIE_xyz_1931_2deg.csv','17cca777db64b17170f06f67ce9d3ab7'),('CIE_std_illum_D65.csv','03d4eb9b837c60671627c946fb534deb')]:
    assert hashlib.md5((ROOT/'data'/name).read_bytes()).hexdigest() == expected, f'CIE checksum mismatch: {name}'
def csvdict(name):
    return {float(row[0]): list(map(float,row[1:])) for row in csv.reader((ROOT/'data'/name).open())}
cmf = csvdict('CIE_xyz_1931_2deg.csv')
d65 = csvdict('CIE_std_illum_D65.csv')
reference = interpolate(phy,440)
table = []
for wavelength in range(400,801,5):
    shape = interpolate(phy,wavelength)/reference if wavelength<=700 else interpolate(phy,700)/reference*math.exp(-(wavelength-700)/10)
    table.append([wavelength, interpolate(water,wavelength), shape, *cmf[wavelength], d65[wavelength][0]])
assert len(table) == 81 and all(len(r)==7 and all(math.isfinite(v) and v>=0 for v in r) for r in table)
app = ROOT/'app.js'
block = '// BEGIN REFERENCE TABLE\n// Columns: nm, aw (m^-1), normalized phytoplankton shape, CIE x/y/z, D65.\n// CIE © CIE 2019, CC BY-SA 4.0; sampled from original 1 nm tables.\n// See data/SOURCES.md. Generated reproducibly by prepare-data.py.\nconst OPTICAL_TABLE = ' + json.dumps(table, separators=(',',':')) + ';\n// END REFERENCE TABLE'
app.write_text(re.sub(r'// BEGIN REFERENCE TABLE.*?// END REFERENCE TABLE',lambda _:block,app.read_text(),flags=re.S))
print('Embedded 81 verified spectral reference rows; CIE checksums match.')
