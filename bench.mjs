import b from "benchmark"
import classnames from "classnames"
import classcat from "classcat"
import clsx from "clsx"
import {fcn} from './dist/lib/fcn.js'
import {cltf} from './t.mjs'

const {Suite} = b

function bench(name, selCall, cltfCall, calcArgs) {
  console.log(`\n# ${name}`);
  new Suite()
    .add('classcat*   ', () => classcat([calcArgs()]))
    .add('classnames  ', () => classnames.apply(classnames, calcArgs()))
    .add('clsx        ', () => clsx.apply(clsx, calcArgs()))
    .add('fcn         ', () => fcn(selCall()))
    .add('cltf        ', cltfCall)
    .on('cycle', e => console.log('  ' + e.target))
    .run();
}

bench(
  'Strings',
  () => s => s.foo.bar.baz.bax.bux,
  () => cltf`foo ba baz bax bux`,
  () => ['foo', '', 'bar', 'baz', 'bax', 'bux']
);

bench(
  'Objects',
  () => s => s.foo(true).bar(true).bax(true).bux(false),
  () => cltf`foo${true} bar${true} bax${true} bux${false}`,
  () => [{ foo: true, bar: true, bax: true, bux: false },
  ]
);
/*
bench(
  'Arrays',
  ['foo', 'bar'],
  ['baz', 'bax', 'bux']
);

bench(
  'Nested Arrays',
  ['foo', ['bar']],
  ['baz', ['bax', ['bux']]]
);

bench(
  'Nested Arrays w/ Objects',
  ['foo', { bar:true, bax:true, bux:false }],
  ['bax', { bax:false, bux:true }]
);

bench(
  'Mixed',
  'foo', 'bar',
  { bax:true, bux:false },
  ['baz', { bax:false, bux:true }]
);

bench(
  'Mixed (Bad Data)',
  'foo', 'bar',
  undefined, null, NaN,
  () => {},
  { bax:true, bux:false, 123:true },
  ['baz', { bax:false, bux:true, abc:null }, {}]
);
*/
