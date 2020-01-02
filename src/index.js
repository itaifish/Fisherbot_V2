const Discord = require('discord.js');
const Logger = require('./logger');
const Bot = require('./bot');
const config = require('../docs/deploy/config.json');
const client = new Discord.Client();
let singletonBot = null;

client.once('ready', () => {
	if(singletonBot == null) {
		singletonBot = new Bot(config.prefix, config.delimiter);
	}
	singletonBot.initMessage();
});

client.on('message', message => {
	if(singletonBot != null) {
		singletonBot.handleInput(message);
	}
});

process.on('SIGINT', () => {
	Logger.closeLogStream();
	process.exit();
});

const token = config.token;
client.login(token);