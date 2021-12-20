const Mock = require('mockjs');

const user = require('./user');
const menu = require('./menu');

const mocks = [
  ...user,
  ...menu
];

module.exports = { mocks }