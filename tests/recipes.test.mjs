import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

test('both entrypoints load data before shared application script', () => {
  for (const page of ['index.html','reseptit/index.html']) {
    const html=read(page);
    assert.match(html, /href="\/reseptit\/styles\.css"/);
    assert.doesNotMatch(html, /<style>/);
    assert.doesNotMatch(html, /mobile\.css/);
    const assets=[...html.matchAll(/<script defer src="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(assets.length, 9);
    assert.deepEqual(assets.slice(0,7), Array.from({length:7},(_,i)=>'/reseptit/data'+(i+1)+'.js'));
    assert.equal(assets[7],'/reseptit/app.js');
    assert.equal(assets[8],'/reseptit/hero.js');
    for(const a of assets)assert.doesNotThrow(()=>read(a.slice(1)));
  }
});

test('recipe data is loaded and has expected searchable records', () => {
  const sandbox={window:{}};
  for(let n=1;n<=7;n++)runInNewContext(read('reseptit/data'+n+'.js'),sandbox);
  const rows=sandbox.window.SIVUMAKU_DATA;
  assert.equal(rows.length,324);
  for (const row of rows) {
    assert.equal(typeof row.name,'string');
    assert.ok(row.name.trim());
    assert.ok(/^https:\/\//.test(row.href));
  }
  const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fi').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  const search=q=>rows.filter(row=>normalize(q).split(/\s+/).every(w=>normalize([row.name,row.group,row.subgroup,row.year].join(' ')).includes(w)));
  assert.ok(search('fish chips').length > 0, 'fish chips should return records');
  assert.equal(search('not-a-recipe-zzq').length,0);
});
