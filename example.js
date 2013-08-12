var quack = require('./src/quack');

quack
	.ensure('string', [1, 2]).either(quack.isString, quack.isTrueArray).and.not.isNull().and.exists()
	.ensure(true).isBoolean()

quack.ensure('string').not.isNull();
quack.ensure('strinng').either(quack.not.isNull, quack.isNumber);


quack.ensure('string').not.isNull().and.isString().and.either(quack.isNumber, quack.not.isNull);


function test(x, y, z) {
	quack
		.ensure(x).isNumber()
		.ensure(y).not.isNull().and.isBoolean()
		.ensure(z).either(quack.isString, quack.isBoolean);

	console.log('arguments are all okay!');
}

test(3, true, 'hello'); // Okay
test(3, true, false);   // Okay
test(3, true, 10);      // error!
