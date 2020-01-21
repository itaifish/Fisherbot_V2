const fs = require('fs');
const config = require('../../docs/deploy/config.json');
const Utility = require('../helpers/utility');
const Path = require('path');
const Logger = require(Path.resolve(global.appRoot, 'helpers/logger'));

module.exports = {
    commands: [
        {
            get name() { return  'chester'},
            description: "Plays a random chester clip",
            isAdmin: false,
            get example() { return `${config.prefix}${this.name}`},
            guildOnly: true,
            aliases: ['gaydan','b_eggs','headass'],
            cooldown: 1,
            method: function (message, args, bot) {
                const vChannel = message.member.voice.channel;
                if(!vChannel) {
                    return bot.sendOutput(message.channel, `Please join a voice channel first`);
                }
                process.chdir(global.appRoot);//move to root directory
                const chesterClipLocation = `../resources/clips/chester`;
                if(!fs.existsSync(chesterClipLocation)) {
                    Logger.logMessage('WARN', `Unable to find any clips in location "${chesterClipLocation}"`);
                    return bot.sendOutput(message.channel, `I can't find any chester clips :(`);
                }
                fs.readdir(chesterClipLocation, (err, files) => {
                    if(err) {
                        Logger.logMessage('ERROR', err);
                        return bot.sendOutput(message.channel, `I had trouble loading the chester clips, please try again`);
                    } else {
                        const chosenSong = files[Utility.getRandomInt(0, files.length-1)];
                        const songPath = Path.resolve(global.appRoot, chesterClipLocation, chosenSong);
                        Logger.logMessage('DEBUG', `Playing song at path ${songPath}`);
                        const result = bot.voiceManager.playClip(songPath, message);
                        if(typeof result == 'string') {
                            return bot.sendOutput(message.channel, result);
                        }
                    }
                });
            }
        }
    ]
}