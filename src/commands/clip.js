const fs = require("fs");
const util = require("util");
const Path = require("path");
const config = require("../../docs/deploy/config.json");
const Logger = require(Path.resolve(global.appRoot, "helpers/logger"));

module.exports = {
    commands: [
        {
            get name() { return "clip";},
            get description() { return `Plays a clip. Use ${config.prefix}${this.name}${config.delimiter}list for the list of clips.`;},
            isAdmin: false,
            get example() { return `${config.prefix}${this.name}${config.delimiter}diamonds`;},
            guildOnly: true,
            aliases: ["play", "clips"],
            cooldown: 10,
            method: async function(message, args, bot) {
                const clipsLocation = "../resources/audio/clips";
                // Only ever load the clips once
                if(!this.clips) {
                    const readdirFunc = util.promisify(fs.readdir);
                    // move to root directory
                    process.chdir(global.appRoot);
                    if(!fs.existsSync(clipsLocation)) {
                        Logger.logMessage("WARN", `Unable to find any clips in location "${clipsLocation}"`);
                        return bot.sendOutput(message.channel, "I can't find any chester clips :(");
                    }
                    try {
                        const fileData = await readdirFunc(clipsLocation);
                        this.clips = fileData;
                    }
                    catch(err) {
                        Logger.logMessage("ERROR", err);
                        return;
                    }
                }
                const clipsname = args[0].trim().toLowerCase();
                if(clipsname != "list") {
                    const vChannel = message.member.voice.channel;
                    if(!vChannel) {
                        return bot.sendOutput(message.channel, "Please join a voice channel first");
                    }
                    let uriName = null;
                    const fileTypes = [".mp3", ".wav"];
                    for(let i = 0; i < this.clips.length; i++) {
                        for(let j = 0; j < fileTypes.length; j++) {
                            if(this.clips[i] == `${clipsname}${fileTypes[j]}`) {
                                uriName = this.clips[i];
                                // leave for loop
                                i = this.clips.length;
                                break;
                            }
                        }
                    }

                    if(uriName) {
                        Logger.logMessage("DEBUG", `\n\n\n\FOUND URINAME: ${uriName}`);
                        const songPath = Path.resolve(global.appRoot, clipsLocation, uriName);
                        Logger.logMessage("DEBUG", `Playing song at path ${songPath}`);
                        const result = bot.voiceManager.playClip(songPath, message, this.name);
                        if(typeof result == "string") {
                            return bot.sendOutput(message.channel, result);
                        }
                    }
                    else {
                        Logger.logMessage("DEBUG", this.clips);
                        return bot.sendOutput(message.channel, `Unable to find clip '${clipsname}'. Use ${config.prefix}${this.name}${config.delimiter}list for the list of clips.`);
                    }
                }
                else {
                    bot.sendOutput(message.channel, this.clips);
                }
            },
        },
    ],
};