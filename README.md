insure
=====
*v0.0.3*

Unobtrusive lightweight development type-checking framework

What is it?
=

Designed to reduce the number of type errors while developing with no changes to existing code other than 
the addition of type checking conditions where needed. No preprocessor or superset language dependencies 
required due to dynamic runtime type-checking, with the bonus of checking real-life state which implicates 
true support for the dynamic runtime nature of JavaScript. All this while maintaining minimal performance 
overhead due to the ability to dynamically disable itself in production environments without requiring the
removal of type-checking conditions. This enables the ability to retain all type-checking in development 
environments while having it disabled in production.

It has exchangeable support for both node.js and the browser.

Insure can easily be extended with custom assertion tests which can be used to add as much power as
needed for a specific project, and may extend well beyond standard type-checking while still centrally
powered by insure.

Automatically supports inverted tests and or-clauses for built-in and user added assertion tests with no
explicit configuration or changes needed. Add the check once for the default case and get all other 
functionality automatically.

Note: This is a work in progress with some key implementations remaining.

Installation
=

Node.js
-
`npm install insure`

Browser
-
Include the script for development:
`<script src="build/insure.min.js" />`

Or for production (with all checks disabled):
`<script src="build/insure.prod.shell.min.js" />`

Usage
=
For node.js use `var insure = require('insure')`, on browsers insure is available on the global `window.insure` object.

Enable type-checking
-
Once the development version of insure is included it is by default enabled.The production version is always disabled.

Define type checks
-

```javascript
function(x, y, z) {
    insure(x, y, z).must(insure.string);

    // x, y and z are all strings
}

function(x, y, z) {
    insure(x, y, z).either(insure.boolean, insure.number);

    // x, y and z are each either a boolean or number
}

function(x, y) {
    insure(x).must(insure.boolean);
    insure(y).must(insure.number);
    
    // x is a boolean while y is a number
}
```

Handle type errors
-
Type errors are automatically thrown by insure with an informative error message at the time of the insure-call.
This means you must respect these thrown errors withing any throw/catch-blocks containing a function call with
insure-checks. Swallowing these errors defeats the purpose of type-checking, instead disable insure when type-checks
are supposed to fall through. Also keep in mind that asynchronous calls to functions containing insure-checks will 
cause type-errors to throw as unhandled exceptions and not delivered in any possible callbacks. If this behavior
is required it must be done manually with a try/catch wrapper, this may be supported natively in future versions.

Disable type-checking
-
To globally disable all type-checking either call `insure.disable()` or switch to the production script.
All type checks can be left in source as they will immediately fall through when insure is disabled.



Todo
=

* More built-in assertions
* Tests
* Enhanced asynchronous support
* bower package