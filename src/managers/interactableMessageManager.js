const Discord = require('discord.js');

class InteractableMessageManager {
	
	constructor() {
		this.guildUniqueMessageAndInteractions = new Discord.Collection();
		this.guildUniqueCommandMessageMap = new Discord.Collection();
	}

	setMessage(guildChannelId, message, commandNameKey, messageInteractionFunction) {
		const interactWithMessageFunc = (emote)=>(messageInteractionFunction(message, emote));
		if(!this.guildUniqueMessageAndInteractions.has(guildChannelId)) {
			this.guildUniqueMessageAndInteractions.set(guildChannelId, new Discord.Collection());
			this.guildUniqueCommandMessageMap.set(guildChannelId, new Discord.Collection());
		}
		this.guildUniqueMessageAndInteractions.get(guildChannelId).set(message.id, interactWithMessageFunc);
		this.guildUniqueCommandMessageMap.get(guildChannelId).set(commandNameKey, message.id);
	}

	hasCommand(guildChannelId, commandNameKey) {
		if(!this.guildUniqueMessageAndInteractions.has(guildChannelId)) {
			return false;
		}
		const messageId = this.guildUniqueCommandMessageMap.get(guildChannelId).get(commandNameKey); 
		return this.guildUniqueMessageAndInteractions.get(guildChannelId).has(messageId);
	}

	hasMessage(guildChannelId, message) {
		if(!this.guildUniqueMessageAndInteractions.has(guildChannelId)) {
			return false;
		}
		return this.guildUniqueMessageAndInteractions.get(guildChannelId).has(message.id);
	}

	interactWithMessage(guildChannelId, message, emote) {
		if(!this.guildUniqueMessageAndInteractions.has(guildChannelId)) {
			return false;
		}
		const interactWithMessageFunc = this.guildUniqueMessageAndInteractions.get(guildChannelId).get(message.id);
		return interactWithMessageFunc(emote);
	}

	deleteMessage(guildChannelId, commandNameKey) {
		if(!this.guildUniqueMessageAndInteractions.has(guildChannelId)) {
			return;
		}
		const messageId = this.guildUniqueCommandMessageMap.get(guildChannelId).get(commandNameKey); 
		this.guildUniqueMessageAndInteractions.get(guildChannelId).delete(messageId);
		this.guildUniqueCommandMessageMap.get(guildChannelId).delete(commandNameKey);
	}
	
}

module.exports = InteractableMessageManager;