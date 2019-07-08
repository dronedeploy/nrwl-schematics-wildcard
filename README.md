 # nrwl-schematics-wildcard
 
 This repo was created to allow wildcards (`*` - deep imports) in `allow` properties of `nx-enforce-module-boundaries` rule.
 
## Description

Current version (7.8.7) of `nrwl/nx` used in Angular2 doesn't allow to use deep imports. Forking and changing `nrwl/nx` monorepo needs to build each package (builders, nx, schematics) and publish them on npm, so we created this repo with builded part (`@nrwl/schematics@7.8.7`) of `@nrwl/nx` (https://github.com/nrwl/nx/tree/7.8.x) monorepo.

This is not an ideal solution, although considering the fact that version 7 does not get so many improvements anymore, we can use this solution temporarily until angular2 is updated.

Changed code exist in @nrwl/nx version >= 8 so this repo can be deleted after `angular2` project is updated to Angular 8 (and @nrwl packages to >= 8)

## Code changes

`src/tslint/nxEnforceModuleBoundaries.js`:

_Line #90_
```javascript
if (this.allow.some(a => matchImportWithWildcard(a, imp))) {
```

_Lines #260 - #267_
```javascript
function matchImportWithWildcard(
  // This may or may not contain wildcards ("*")
  allowableImport,
  extractedImport
) {
    const regex = new RegExp('^' + allowableImport.split('*').join('.*') + '$');
    return regex.test(extractedImport);
}
```

## Links
* https://github.com/nrwl/nx/issues/1373
* https://github.com/nrwl/nx/commit/82898f7d212b4801288998d5fe5ac04ca84d67ca