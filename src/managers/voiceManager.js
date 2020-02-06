const Path = require('path');
const Logger = require(Path.resolve(global.appRoot, 'helpers/logger'));

class VoiceManager {
	
	constructor(bot) {
		this.bot = bot;
	}

	async playClip(clipUrl, message, commandName=null) {
		const voiceChannel = message.member.voice.channel;
		if(voiceChannel) {
			const connection = await voiceChannel.join();
			const dispatcher = connection.play(clipUrl);

			const endPlayFunction = () => {
				connection.disconnect();
				this.bot.interactableMessages.deleteMessage(message.channel.id, commandName);//delete old interactable message
			}
			//#region interaction
			if(commandName) { //if commandname is passed, the message should be interactible
				const reacts = ['⏯', '⏹️'];
				const messageInteractionFunction = (message, emote) => {
					if(!dispatcher) {
						message.delete(0);
					}
					switch(emote.toString()){
						case '⏯':
							if(!dispatcher.paused){
								dispatcher.pause(true);
							}else{
								dispatcher.resume();
							}
						break;
						case '⏹️':
							endPlayFunction();
						break;
					}
				}
				const callBackFunc = async (messageSent) => {
					try {
						for(const react of reacts) {
							await messageSent.react(react);
						}
						this.bot.interactableMessages.deleteMessage(message.channel.id, commandName);//delete old interactable message
						this.bot.interactableMessages.setMessage(messageSent.channel.id, messageSent, commandName, messageInteractionFunction);
					} catch(err) {
						messageSent.delete(0);
						this.bot.sendOutput(messageSent.channel, `An Error Occured. Please try again.`);
						Logger.logMessage('ERROR', err);
					}
				};
				this.bot.sendOutput(message.channel, `Playing clip ${commandName}`, null, callBackFunc);
			}
			//#endregion

			dispatcher.on('start', () => {
				//Logger.logMessage('DEBUG', 'start');
			});
			dispatcher.on('error', (err)=> {
				Logger.logMessage('ERROR', err);
				endPlayFunction();
			});
			dispatcher.on('finish', () => {
				endPlayFunction();
			});
		} else {
			return `Please Join a Voice Channel to use that command`;
		}
	}
}

module.exports = VoiceManager;