const Discord = require('discord.js');
const Logger = require('./logger');
const Bot = require('./bot');
const config = require('../docs/deploy/config.json');
const client = new Discord.Client();
let singletonBot = null;

client.once('ready', () => {
	if(singletonBot == null) {
		singletonBot = new Bot(client, config.prefix, config.delimiter);
	}
	singletonBot.initMessage();
});

client.on('message', message => {
	if(singletonBot != null) {
		singletonBot.handleInput(message);
	}
});

client.on('messageReactionAdd', (messageReaction, user) => {
	const message = messageReaction.message;
	const emoji = messageReaction.emoji;
	singletonBot.handleReact(message, emoji, user);
});

client.on('error', error => {
	Logger.logMessage('ERROR', error);
});

//possible additional exit inputs
// [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
//  process.on(eventType, cleanUpServer.bind(null, eventType));
// })
process.on('SIGINT', () => {
	Logger.closeLogStream();
	process.exit();
});

const token = config.token;
client.login(token);