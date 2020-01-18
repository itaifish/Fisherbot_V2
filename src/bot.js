const Discord = require('discord.js');
const Logger = require('./logger');
const fs = require('fs');
const config = require('../docs/deploy/config.json');

class Bot {

	constructor(prefix, delimiter) {
		this.id = Math.random().toString(36).substr(2, 9);
		this.prefix = prefix;
		this.delimiter = delimiter;
		this.commands = new Discord.Collection();
		this.cooldowns = new Discord.Collection();
		this.aliases = new Discord.Collection();
		this.commandMaps = new Discord.Collection();
		process.chdir(__dirname);//make sure to be in the right directory when dealing with relative paths
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		for(const file of commandFiles) {
			const command = require(`./commands/${file}`);
			for(const commandObj of command.commands) {
				this.commands.set(commandObj.name, commandObj);
				if(commandObj.aliases) {
					for(let alias of commandObj.aliases) {
						this.aliases.set(alias, commandObj.name);
					}
				}
			}
		}
	}

	createCommandMap(commandName, objectData) {
		this.commandMaps.set(commandName, objectData);
		return this.getCommandMap(commandName);
	}

	getCommandMap(commandName) {
		if(this.commandMaps.has(commandName)) {
			return this.commandMaps.get(commandName);
		}
		return null;
	}

	handleInput(messageObject) {
		if (!messageObject.content.startsWith(this.prefix) || messageObject.author.bot) {
			return;
		}
		const args = messageObject.content.slice(this.prefix.length).split(new RegExp(`${this.delimiter}+`));
		let commandName = args.shift().toLowerCase().replace(/^\s+/g, '');
		if(this.aliases.has(commandName)) {//have alias resolve to real name
			commandName = this.aliases.get(commandName);
		}
		if(!this.commands.has(commandName)){
			return;
		}
		const command = this.commands.get(commandName);
		if (command.guildOnly && messageObject.channel.type !== 'text') {
			return this.sendOutput(messageObject.channel, 'I can\'t execute that command inside DMs');
		}
		if((command.isAdmin || false)) {
			if(!messageObject.member.hasPermission('ADMINISTRATOR')) {
				return this.sendOutput(messageObject.channel, `ERR: ${commandName} requires admin permissions.`);
			}
		}
		//Deal with cooldowns for spam
		if(!this.cooldowns.has(commandName)) {
			this.cooldowns.set(commandName, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = this.cooldowns.get(commandName);
		const cooldownAmnt = (command.cooldown || config.defaultCooldown) * 1000;
		if(cooldownAmnt != 0 && timestamps.has(messageObject.author.id)) {
			const expirationTime = timestamps.get(messageObject.author.id) + cooldownAmnt;
			if(now < expirationTime) {
				const timeRemaining = (expirationTime - now)/1000;
				return this.sendOutput(messageObject.channel, `Spammer detected! Please wait ${timeRemaining.toFixed(1)} second(s) to use ${commandName} again.`);
			}
		}
		timestamps.set(messageObject.author.id, now);
		setTimeout(() => timestamps.delete(messageObject.author.id), cooldownAmnt);
		//Run command Method
		try {
			this.commands.get(commandName).method(messageObject, args, this);
		} catch (err) {
			Logger.logMessage('ERROR', err);
			this.sendOutput(messageObject.channel, "I had trouble executing that command. Please refer to your admin for more information.");
		}

		const messageLogString = `${messageObject.author.username}[${parseInt(messageObject.author.id, 10).toString(36)}] (${messageObject.embeds.length} embeded data): ${messageObject.cleanContent}`;
		Logger.logMessage('DEBUG', messageLogString);
	}

	sendOutput(channel, messageString, embedObj=null, callBackFunctionOnMessage=null) {
		let sendFunction;
		if(embedObj) {
			sendFunction = () => channel.send(embedObj);
		} else {
			sendFunction = () => channel.send(messageString);
		}

		sendFunction(messageString).then((messageSent) => {
			const messageLogString = `${messageSent.author.username}[${parseInt(messageSent.author.id, 10).toString(36)}] (${messageSent.embeds.length} embeded data): ${messageSent.cleanContent}`;
			Logger.logMessage('DEBUG', messageLogString);
			if(callBackFunctionOnMessage) {
				callBackFunctionOnMessage(messageSent);
			}
		}).catch((err) => {
			Logger.logMessage('ERROR', err);
		});
	}

	sendImage(channel, imageAttachment) {
		channel.send('', imageAttachment);
		Logger.logMessage('DEBUG', `Sending image ${imageAttachment.toString('base64')}`);
	}

	reply(message, messageString) {
		message.reply(messageString).then((messageSent)=> {
			const messageLogString = `${messageSent.author.username}[${parseInt(messageSent.author.id, 10).toString(36)}] (${messageSent.embeds.length} embeded data): ${messageSent.cleanContent}`;
			Logger.logMessage('DEBUG', messageLogString);
		}).catch((err) => {
			Logger.logMessage('ERROR', err);
		});
	}

	initMessage() {
		Logger.logMessage('INFO','Ready, ID: ' + this.id);
	}
}

module.exports = Bot;
