// .prettierrc.js
module.exports = {
  // Specify the line length that the printer will wrap on
  printWidth: 100,

  // Specify the number of spaces per indentation-level
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Use semicolons at the end of statements
  semi: true,

  // Use single quotes instead of double quotes
  singleQuote: true,

  // Change when properties in objects are quoted
  quoteProps: 'as-needed',

  // Use single quotes instead of double quotes in JSX
  jsxSingleQuote: false,

  // Print trailing commas wherever possible in multi-line comma-separated syntactic structures
  trailingComma: 'es5',

  // Print spaces between brackets in object literals
  bracketSpacing: true,

  // Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
  bracketSameLine: false,

  // Include parentheses around a sole arrow function parameter
  arrowParens: 'always',

  // Format only files recognized by Prettier, leave unknown files untouched
  requirePragma: false,

  // Insert @format pragma into file's first docblock comment
  insertPragma: false,

  // Specify the global whitespace sensitivity for HTML, Vue, Angular, and Handlebars
  htmlWhitespaceSensitivity: 'css',

  // Maintain existing line endings (mixed values within one file are normalized by looking at what's used after the first line)
  endOfLine: 'lf',

  // Control whether Prettier formats quoted code embedded in the file
  embeddedLanguageFormatting: 'auto',

  // Enforce single attribute per line in HTML, Vue and JSX
  singleAttributePerLine: false,
};
