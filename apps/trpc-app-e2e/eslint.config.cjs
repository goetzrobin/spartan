const cypress = require('eslint-plugin-cypress/flat');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [cypress.configs['recommended'], ...baseConfig];
