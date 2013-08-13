var ensure = require('./src/ensure');

var x = 3;
ensure(true, x).either(ensure.not.boolean, ensure.not.number);
ensure('string').must(ensure.string);