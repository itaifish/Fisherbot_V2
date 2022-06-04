const fs = require('fs');
const util = require('util');
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
            method: async function (message, args, bot) {
                const vChannel = message.member.voice.channel;
                if(!vChannel) {
                    return bot.sendOutput(message.channel, `Please join a voice channel first`);
                }
                //Only ever load the clips once
                const clipsLocation = `../resources/audio/chester`;
                if(!this.clips) {
                    const readdirFunc = util.promisify(fs.readdir);
                    process.chdir(global.appRoot);//move to root directory
                    if(!fs.existsSync(clipsLocation)) {
                        Logger.logMessage('WARN', `Unable to find any clips in location "${clipsLocation}"`);
                        return bot.sendOutput(message.channel, `I can't find any chester clips :(`);
                    }
                    try {
                        const fileData = await readdirFunc(clipsLocation);
                        this.clips = fileData;
                    } catch(err) {
                        Logger.logMessage('ERROR', err);
                        return;
                    }
                }
                const chosenSong = this.clips[Utility.getRandomInt(0, this.clips.length-1)];
                const songPath = Path.resolve(global.appRoot, clipsLocation, chosenSong);
                Logger.logMessage('DEBUG', `Playing song at path ${songPath}`);
                const result = bot.voiceManager.playClip(songPath, message);
                if(typeof result == 'string') {
                    return bot.sendOutput(message.channel, result);
                }
            }
        }
    ]
}