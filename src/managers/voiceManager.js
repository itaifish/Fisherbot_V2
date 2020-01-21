const Path = require('path');
const Logger = require(Path.resolve(global.appRoot, 'helpers/logger'));

class VoiceManager {
	
	constructor() {
		this.dispatcher = null;
	}

	async playClip(clipUrl, message) {
		const voiceChannel = message.member.voice.channel;
		if(voiceChannel) {
			const connection = await voiceChannel.join();
			const dispatcher = connection.play(clipUrl);
			dispatcher.on('start', () => {
				Logger.logMessage('DEBUG', 'start');
			});
			dispatcher.on('error', (err)=> {
				Logger.logMessage('ERROR', err);
			});
			dispatcher.on('finish', () => {
				connection.disconnect();
				Logger.logMessage('DEBUG', 'Finished');
			});
		} else {
			return `Please Join a Voice Channel to use that command`;
		}
	}
}

module.exports = VoiceManager;