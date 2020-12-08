const Discord = require("discord.js");
const Canvas = require("canvas");
const Path = require("path");
const Logger = require(Path.resolve(global.appRoot, "helpers/logger"));
const config = require("../../docs/deploy/config.json");
const memeData = require("../../resources/images/memes/memes.json");

module.exports = {
	commands: [
		{
			get name() {
				return "meme";
			},
			get description() {
				return `Generate a meme from prebuilt templates and text. Use '${config.prefix}${this.name}${config.delimiter}details' for more information.`;
			},
			get example() {
				return `${config.prefix}${this.name}${config.delimiter}boyfriend${config.delimiter}Using a Discord Bot${config.delimiter}Itai${config.delimiter}Making a meme in GIMP`;
			},
			guildOnly: false,
			aliases: [],
			cooldown: config.defaultCooldown,
			method: async function(message, args, bot) {
				if (args.length <= 1) {
					if (args[0] && args[0].trim().toLowerCase() == "details") {
						let output = "";
						for (const memeName of Object.keys(memeData)) {
							output += `${memeName}: ${memeData[memeName].textAreas.length} arguments\n`;
						}
						output += `\nExample: ${this.example}\nThe order of text will always be left to right, top to bottom`;
						return bot.sendOutput(message.channel, output);
					}
					else {

						return bot.sendOutput(
							message.channel,
							`Unknown arguments. Please use ${config.prefix}${this.name}${config.delimiter}details for more information.`,
						);
					}
				}
				const memeToUse = args[0].trim().toLowerCase();
				if (memeData[memeToUse]) {
					const memeToUseData = memeData[memeToUse];
					if (args.length != memeToUseData.textAreas.length + 1) {
						bot.sendOutput(
							message.channel,
							`${memeToUse} requires exactly ${
								memeToUseData.textAreas.length + 1
							} arguments, you had ${args.length}`,
						);
						return;
					}
					const memeBackground = await Canvas.loadImage(
						Path.resolve(
							global.appRoot,
							`../resources/images/memes/${memeToUseData.url}`,
						),
					).catch((err) => {
						Logger.logMessage("ERROR", err);
					});
					const canvas = Canvas.createCanvas(
						memeToUseData.width,
						memeToUseData.height,
					);
					const ctx = canvas.getContext("2d");
					ctx.drawImage(memeBackground, 0, 0, canvas.width, canvas.height);
					ctx.fillStyle = "white";
					ctx.textAlign = "center";
					ctx.font = `${memeToUseData.textSize}px sans-serif`;
					const isHorizontal =
            memeToUseData.textAreas.length >= 2 &&
            memeToUseData.textAreas[0][1] == memeToUseData.textAreas[1][1];
					for (let i = 0; i < memeToUseData.textAreas.length; i++) {
						ctx.strokeStyle = "black";
						ctx.lineWidth = memeToUseData.textSize / 4;
						const x = memeToUseData.textAreas[i][0];
						const y = memeToUseData.textAreas[i][1];
						let maxWidth = 2 * Math.min(canvas.width - x, x);
						// if horizontal meme
						if (isHorizontal) {
							const nextX = memeToUseData.textAreas[i + 1]
								? memeToUseData.textAreas[i + 1][0]
								: canvas.width + canvas.width - x;
							maxWidth = nextX - x;
						}
						ctx.strokeText(args[1 + i], x, y, maxWidth);
						ctx.fillText(args[1 + i], x, y, maxWidth);
					}

					const attachment = new Discord.MessageAttachment(
						canvas.toBuffer(),
						"meme.png",
					);
					const callBack = () => {
						message.delete({ timeout: 5000 });
					};
					bot.sendImage(message.channel, attachment, callBack);
				}
				else {
					bot.sendOutput(message.channel, `Unable to find meme: ${memeToUse}`);
				}
			},
		},
	],
};
