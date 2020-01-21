const config = require('../../docs/deploy/config.json');
const Discord = require('discord.js');
const Utility = require('../helpers/utility');

module.exports = {
    commands: [
        {
            get name() { return  'roll'},
            fileAlias: 'random',
            description: "Rolls a die with x sides, default 20",
            get example() { return `${config.prefix}${this.name}${config.delimiter}17\n\t${config.prefix}${this.name}`},
            guildOnly: false,
            cooldown: 0.5,
            aliases: 'random',
            method: function (message, args, bot) {
                const title = this.name[0].toUpperCase() + this.name.slice(1);
                const embedObj = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(title)
                    .setFooter('Value determined by texting Ben and asking him');
                let numSides = 20;
                let output = '';
                if(args.length > 0) {
                   const argVal = parseInt(args[0]); 
                    if(!argVal || argVal <= 1) {
                        output += `Unable to read ${args[0]}, defaulting to 20\n`;
                    }else {
                        numSides = argVal;
                    }
                }
                const result = Utility.getRandomInt(1, numSides);
                output += `Rolled d${numSides}: I got ${result}`;
                embedObj.setDescription(output);
                bot.sendOutput(message.channel, output, embedObj);
            }
        },
        {
            get name() { return  'flip'},
            fileAlias: 'random',
            description: "Flips a coin",
            get example() { return `${config.prefix}${this.name}`},
            guildOnly: false,
            cooldown: 0.5,
            method: function (message, args, bot) {
                const title = this.name[0].toUpperCase() + this.name.slice(1);
                let result = 'Heads';
                if(Math.random() > 0.5) {
                    result = 'Tails';
                }
                const embedObj = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(title)
                    .setFooter('Thankfully Max had a coin to borrow')
                    .setDescription(result);
                bot.sendOutput(message.channel, result, embedObj);
            }
        }
    ]
}