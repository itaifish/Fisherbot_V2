const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

const token = fs.readFileSync('../docs/deploy/deploy_key', 'utf8');
client.login(token);