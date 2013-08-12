var quack = require('./src/quack');

quack
	.ensure('string', [1, 2]).either(quack.isString, quack.isTrueArray).not.isNull().exists()
	.ensure(true).isBoolean()

quack.ensure('string').not.isNull();
quack.ensure('strinng').either(quack.not.isNull, quack.isNumber);


quack.ensure('string').not.isNull().isString().either(quack.isNumber, quack.not.isNull);
quack.ensure()
