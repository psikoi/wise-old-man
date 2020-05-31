const express = require('express');
const controller = require('./record.controller');

const api = express.Router();

api.get('/', controller.get);
api.get('/leaderboard', controller.leaderboard);

module.exports = api;
