quack
=====

Unobtrusive lightweight development type-checking framework

What is it?
=

Designed to reduce the number of type errors while developing with no changes to existing code other than 
the addition of type checking conditions where needed. No preprocessor or superset language dependencies 
required due to dynamic runtime type-checking, with the bonus of checking real-life state which implicates 
true support for the dynamic runtime nature of JavaScript. All this while maintaining minimal performance 
overhead due to the ability to dynamically disable itself in production environments without requiring the
removal of type-checking conditions. This ensures the ability to retain all type-checking in development 
environments while having it disabled in production.

It has exchangeable support for both node.js and the browser with optional AMD support.

Quack can easily be extended with custom assertion tests which can be used to add as much power as 
needed for a specific project, and may extend well beyond standard type-checking while still centrally
powered by quack.

Note: This is a work in progress with some key implementations remaining.

Todo
=

* Informative error messages on type errors
* More built-in assertions
* Better inversion-technique with support within either()
* Documentation
* Tests
* Separation of core to enable exclusion of large parts of the source for production environments with no code changes
