var quack = require('./src/quack');

quack
  .ensure('string', [1, 2]).either(quack.isString, quack.isTrueArray).not(quack.isNull).exists()
	.ensure(true).isBoolean()
