const path = require('path')
const ScriptRule = require('counsel-script')
const CopyRule = require('counsel-copy')
const fs = require('fs')

module.exports = {
  rules: [
    new ScriptRule({
      devDependencies: ['npm-run-all', 'husky'],
      name: 'precommit',
      scriptName: 'precommit',
      scriptCommand: 'run-p check lint test',
      scriptCommandVariants: ['*']
    }),

    // validate!
    new ScriptRule({
      name: 'check',
      scriptName: 'check',
      scriptCommand: 'counsel check',
      scriptCommandVariants: ['*']
    }),

    // lint!
    new ScriptRule({
      name: 'lint',
      devDependencies: [
        'eslint',
        'eslint-config-airbnb',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react'
      ],
      scriptName: 'lint',
      scriptCommand: 'eslint src/**/*.js test/**/*.js',
      scriptCommandVariants: ['*']
    }),
    new CopyRule({
      src: path.resolve(__dirname, '.eslintrc.js'),
      dest: './eslintrc.js'
    }),

    // test and coverage!
    new ScriptRule({
      scriptName: 'copy-eslint-config',
      name: 'test',
      devDependencies: ['nyc', 'tape'],
      scriptName: 'test',
      scriptCommand: 'nyc --reporter=lcov node test/',
      scriptCommandVariants: ['*']
    }),

    // readme
    (function () {
      /* istanbul ignore next */
      return {
        name: 'enforce-readme',
        apply () {},
        check (counsel) {
          const readmeFilename = path.resolve(counsel.targetProjectRoot, 'README.md')
          if (!fs.existsSync(readmeFilename)) {
            throw new Error(`README.md not found at: ${readmeFilename}`)
          }
        }
      }
    })()
  ]
}
