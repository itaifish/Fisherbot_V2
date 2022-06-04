const config = require("../../docs/deploy/config.json");
const Utility = require("../helpers/utility");


const msToTime = (ms) => {
    const pad = (n, z = 2) => ("00" + n).slice(-z);
    return Math.floor(ms / 3.6e6 | 0) + ":" + pad((ms % 3.6e6) / 6e4 | 0) + ":" + pad((ms % 6e4) / 1000 | 0);
};

module.exports = {
    commands: [
        {
            get name() { return "remindme";},
            get description() {
                return `Sends the user a future reminder, or a reminder at a certain date. Use '${config.prefix}${this.name}${config.delimiter}details' for more information.`;
            },
            get example() { return `${config.prefix}${this.name}${config.delimiter}5 mins, do the laundry`;},
            guildOnly: false,
            cooldown: config.defaultCooldown,
            method: function(message, args, bot) {
                if(args.length === 0) {
                    bot.sendOutput(message.channel, `The ${this.name} command requires 2 arguments. Please see ${config.prefix}help${config.delimiter}${this.name} for details`);
                    return;
                }
                if(args.length === 1) {
                    // if ask for details
                    if((/^detail[s?]$/g).test(args[0].trim().toLowerCase())) {
                        const details =
                            `Usage: ${config.prefix}${this.name}${config.delimiter}timePeriod${config.delimiter}reminderMessage
                                Time Period can be any of the following:
                                    x Seconds, Second, Secs, Sec, S, seconds, second, secs, sec, s
                                    x Minutes, Minute, Mins, Min, M, minutes, minute, mins, min, m
                                    x Hours, Hour, Hrs, Hr, H, hours, hour, hrs, hr, h
                                    x Days, Day, days, day `;
                        bot.sendOutput(message.channel, details);
                        return;
                    }
                    else {
                        bot.sendOutput(message.channel, `The ${this.name} command requires 2 arguments. Please see ${config.prefix}help${config.delimiter}${this.name} for details`);
                        return;
                    }
                }
                let output = "";
                const evaluation = Utility.parseHumanTime(args[0]);
                if(evaluation.evaluatedMs <= 0) {
                    bot.sendOutput(message.channel, `I am unable to understand ${args[0]} as a time, or it is 0. Please enter a valid time longer than 0 seconds.`);
                    return;
                }
                if(evaluation.unparsedString.length > 0) {
                    output += `Note: Unable to parse the '${evaluation.unparsedString}' part of the input\n`;
                }
                output += "Setting a timer for " + msToTime(evaluation.evaluatedMs);
                setTimeout(() => bot.reply(message, args[1]), evaluation.evaluatedMs);
                bot.sendOutput(message.channel, output);
            },
        },
    ],
};