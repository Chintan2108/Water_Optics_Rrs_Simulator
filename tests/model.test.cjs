// Run: node --test tests/model.test.cjs. No npm dependencies.
const test = require('node:test');
const assert = require('node:assert/strict');
const { simulate, spectrumToColor, spectrumCSV, classify, PRESETS, CONFIG, OPTICAL_TABLE, sliderToValue, valueToSlider } = require('../app.js');
const close = (a,b,tol=1e-10) => assert.ok(Math.abs(a-b)<tol, `${a} != ${b}`);
test('source anchors, dimensions and unit conversions', () => {
  assert.equal(OPTICAL_TABLE.length,81);
  for (let i=0;i<81;i++) assert.equal(OPTICAL_TABLE[i][0],400+5*i);
  close(OPTICAL_TABLE[8][1],0.00635); // Pope/Fry 440 nm: 0.0000635 cm^-1.
  close(OPTICAL_TABLE[30][1],0.0565); // 550 nm.
  close(OPTICAL_TABLE[80][1],2.07); // Smith/Baker 800 nm.
  close(OPTICAL_TABLE[8][2],1); // Template normalization at 440 nm.
});
test('all corner combinations and presets are finite and physically bounded', () => {
  const states = Object.values(PRESETS);
  for(let mask=0;mask<16;mask++) for(const water of ['fresh','marine']) states.push(Object.fromEntries([...Object.keys(CONFIG).map((k,i)=>[k,(mask>>i)&1?CONFIG[k].max:0]),['water',water]]));
  for(const state of states) for(const p of simulate(state)) {
    for(const v of Object.values(p)) assert.ok(Number.isFinite(v)&&v>=0);
    assert.ok(p.u<1 && p.Rrs<0.2);
    close(p.a,p.aw+p.aph+p.apc+p.ag+p.ased);
    close(p.bb,p.bbw+p.bbph+p.bbsed);
    close(p.rrs,p.Rrs/(0.52+1.7*p.Rrs));
  }
});
test('CDOM absorbs without adding scattering and darkens fixed-exposure color', () => {
  const lo=simulate({...PRESETS.ocean,cdom:0}), hi=simulate({...PRESETS.ocean,cdom:3});
  hi.forEach((p,i)=>{assert.ok(p.Rrs<lo[i].Rrs);close(p.bb,lo[i].bb);});
  assert.ok(spectrumToColor(hi).Y<spectrumToColor(lo).Y);
  const blue=hi[8], green=hi[30]; assert.ok(blue.ag>green.ag);
});
test('PC has its maximum absorption at 620 nm, without double-counting cells', () => {
  const lo=simulate({...PRESETS.cyano,pc:0}),hi=simulate({...PRESETS.cyano,pc:40});
  const max=hi.reduce((a,b)=>a.apc>b.apc?a:b);assert.equal(max.wavelength,620);close(max.apc,0.28);
  hi.forEach((p,i)=>{close(p.bb,lo[i].bb);assert.ok(p.Rrs<=lo[i].Rrs);});
  assert.ok(hi[44].Rrs<lo[44].Rrs); // 620 nm.
});
test('sediment increases both optical terms and brightens representative low-particle water', () => {
  const lo=simulate({...PRESETS.ocean,tss:0}),hi=simulate({...PRESETS.ocean,tss:30});
  hi.forEach((p,i)=>{assert.ok(p.a>lo[i].a);assert.ok(p.bb>lo[i].bb);assert.ok(p.Rrs>lo[i].Rrs);});
});
test('pigment and water features are preserved without chart smoothing', () => {
  const p=simulate({...PRESETS.ocean,chl:10});
  assert.ok(p[8].aph>p[30].aph);assert.ok(p[55].aph>p[44].aph);
  assert.ok(p[80].aw>p[30].aw);
});
test('CIE daylight white integrates to approximately neutral sRGB', () => {
  const p=simulate(PRESETS.ocean).map(p=>({...p,Rrs:1/(Math.PI*3)}));
  const c=spectrumToColor(p);close(c.Y,1/3);
  assert.ok(Math.max(...c.rgb)-Math.min(...c.rgb)<=2);
  assert.ok(c.rgb.every(v=>v>=253));
});
test('freshwater baseline changes molecular scattering only', () => {
  const fresh=simulate({...PRESETS.ocean,water:'fresh'}), marine=simulate(PRESETS.ocean);
  fresh.forEach((p,i)=>{assert.ok(p.bbw<marine[i].bbw);close(p.a,marine[i].a);close(p.bbph,marine[i].bbph);});
});
test('classification is optical and zero constituents remain defined', () => {
  assert.equal(classify(PRESETS.ocean,simulate(PRESETS.ocean)).case2,false);
  assert.equal(classify(PRESETS.cdom,simulate(PRESETS.cdom)).case2,true);
  assert.equal(classify(PRESETS.sediment,simulate(PRESETS.sediment)).case2,true);
  const zero={chl:0,pc:0,cdom:0,tss:0,water:'fresh'};
  assert.ok(simulate(zero).every(p=>p.Rrs>0));
});
test('slider mappings round-trip low, intermediate and extreme values', () => {
  for(const c of Object.values(CONFIG)) for(const v of [0,0.001,0.1,1,c.max]) close(sliderToValue(valueToSlider(v,c),c),v);
});
test('model rejects non-finite and out-of-range inputs', () => {
  for(const chl of [-1,101,NaN,Infinity]) assert.throws(()=>simulate({...PRESETS.ocean,chl}),RangeError);
});

test('CSV contains all 81 samples, SI optical columns, and the exact selected concentrations', () => {
  const state=PRESETS.cyano, samples=simulate(state);
  const rows=spectrumCSV(samples,state).trim().split('\n').map(line=>line.split(','));
  assert.equal(rows.length,82);assert.equal(rows[0].length,19);
  for(let i=1;i<rows.length;i++) {
    assert.equal(rows[i].length,19);
    close(Number(rows[i][13]),samples[i-1].Rrs);
    close(Number(rows[i][14]),state.chl);
    assert.equal(rows[i][18],state.water);
  }
});
