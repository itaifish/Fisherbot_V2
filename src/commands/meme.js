const Discord = require('discord.js');
const Canvas = require('canvas');
const Path = require('path');
const Logger = require(Path.resolve(global.appRoot, 'helpers/logger'));
const config = require('../../docs/deploy/config.json');
const memeData = require('../../resources/images/memes/memes.json');

const drawMeme = async (meme, text, scale=1) => {
    const memeBackground = await Canvas.loadImage(Path.resolve
        (global.appRoot,`../resources/images/memes/${meme.url}`))
    .catch(
        (err) => {
            Logger.logMessage('ERROR', err);
    });
    const canvas = Canvas.createCanvas(meme.width, meme.height);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.drawImage(memeBackground, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = "center";
    ctx.font = `${meme.textSize}px sans-serif`;
    const isHorizontal = (meme.textAreas.length >= 2 && meme.textAreas[0][1] == meme.textAreas[1][1]);
    for(let i = 0; i < meme.textAreas.length; i++) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = meme.textSize/(4);
        const x = meme.textAreas[i][0];
        const y = meme.textAreas[i][1];
        let maxWidth = 2*Math.min(canvas.width - x, x);
        //if horizontal meme
        if(isHorizontal) {
            const nextX = (meme.textAreas[i+1] ? meme.textAreas[i+1][0] : canvas.width + canvas.width - x);
            maxWidth =  (nextX - x);
        }
        ctx.strokeText(text[1+i], x, y, maxWidth);
        ctx.fillText(text[1+i], x, y, maxWidth);
    }
    return canvas;
}

module.exports = {
    commands: [
        {
            get name(){ return 'meme'},
            get description(){ 
                return `Generate a meme from prebuilt templates and text. Use '${config.prefix}${this.name}${config.delimiter}details' for more information.`;
            },
            get example(){ 
                return  `${config.prefix}${this.name}${config.delimiter}boyfriend${config.delimiter}Using a Discord Bot${config.delimiter}Itai${config.delimiter}Making a meme in GIMP`
            },
            guildOnly: false,
            aliases: [],
            cooldown: config.defaultCooldown,
            method: async function (message, args, bot) {
                if(args.length <= 1) {
                    if(args[0] && args[0].trim().toLowerCase() == 'details') {
                        const scale = 0.5;
                        let memeName = Object.keys(memeData)[0];
                        //for(let memeName of Object.keys(memeData)) {
                            const args = Array.from(Array(memeData[memeName].textAreas.length).keys());
                            const canvas = await drawMeme(memeData[memeName], args, scale);
                            const memeAttachment = new Discord.MessageAttachment(canvas.toBuffer(), `${memeName}.png`);
                            bot.sendOutput(message.channel, `${memeName}`, memeAttachment);
                        //}
                        return;
                    } else {
                        return bot.sendOutput(message.channel, `Unknown arguments. Please use ${config.prefix}${this.name}${config.delimiter}details for more information.`);
                    }
                }
                const memeToUse = args[0].trim().toLowerCase();
                if(memeData[memeToUse]) {
                    const memeToUseData = memeData[memeToUse];
                    if(args.length != memeToUseData.textAreas.length+1) {
                        bot.sendOutput(message.channel, `${memeToUse} requires exactly ${memeToUseData.textAreas.length + 1} arguments, you had ${args.length}`);
                        return;
                    }
                    const canvas = await drawMeme(memeToUseData, args);
                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `meme.png`);
                    const callBack = () => {
                        message.delete(0);
                    };
                    bot.sendImage(message.channel, attachment, callBack);
                } else {
                    bot.sendOutput(message.channel, `Unable to find meme: ${memeToUse}`);
                }
            }
        }
    ]
}