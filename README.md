insure
=====
*v0.0.2*

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

Todo
=

* More built-in assertions
* Documentation
* Tests
* bower package