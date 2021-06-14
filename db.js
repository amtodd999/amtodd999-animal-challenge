const {Sequelize} = require('sequelize');

const db = new Sequelize("postgres://postgres:KristynaBV!80!@localhost:5432/animal-server");

module.exports = db;