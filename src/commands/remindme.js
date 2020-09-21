const config = require('../../docs/deploy/config.json');

const parseHumanTime = (timeToParse) => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    let totalTime = 0;
    
    const regexes = [
            [/[0-9]+[\s]*[Dd]((ay)s?)?/g, day],
            [/[0-9]+[\s]*[Hh]((ours?)|(rs?))?/g, hour],
            [/[0-9]+[\s]*[Mm]((in(ute)?s?))?/g, minute],
            [/[0-9]+[\s]*[Ss]((ec(ond)?s?))?/g, second]
    ];
    for(let regex of regexes) {
        const matches = timeToParse.match(regex[0]);
        while(matches && matches.length > 0) {
            const numVal = matches.pop();
            timeToParse = timeToParse.replace(new RegExp(numVal), '');
            totalTime += parseInt(numVal.replace(/[a-zA-Z]+/g,''))*regex[1];
        }
    }

    return {
        evaluatedMs: totalTime, 
        unparsedString: timeToParse.trim()
    };
}

const msToTime = (ms) => {
  let pad = (n, z = 2) => ('00' + n).slice(-z);
  return Math.floor(ms/3.6e6|0) + ':' + pad((ms%3.6e6)/6e4 | 0) + ':' + pad((ms%6e4)/1000|0);
}

module.exports = {
    commands: [
        {
            get name() { return  'remindme'},
            get description(){
                return  `Sends the user a future reminder, or a reminder at a certain date. Use '${config.prefix}${this.name}${config.delimiter}details' for more information.`
            },
            get example() { return `${config.prefix}${this.name}${config.delimiter}5 mins, do the laundry`},
            guildOnly: false,
            cooldown: config.defaultCooldown,
            method: function (message, args, bot) {
                if(args.length === 0) {
                    bot.sendOutput(message.channel, `The ${this.name} command requires 2 arguments. Please see ${config.prefix}help${config.delimiter}${this.name} for details`);
                    return;
                }
                if(args.length === 1) {
                    if((/^detail[s?]$/g).test(args[0].trim().toLowerCase()) ) {//if ask for details
                        const details = 
                            `Usage: ${config.prefix}${this.name}${config.delimiter}timePeriod${config.delimiter}reminderMessage
                                Time Period can be any of the following:
                                    x Seconds, Second, Secs, Sec, S, seconds, second, secs, sec, s
                                    x Minutes, Minute, Mins, Min, M, minutes, minute, mins, min, m
                                    x Hours, Hour, Hrs, Hr, H, hours, hour, hrs, hr, h
                                    x Days, Day, days, day `;
                        bot.sendOutput(message.channel, details, true);
                        return;
                    } else {
                        bot.sendOutput(message.channel, `The ${this.name} command requires 2 arguments. Please see ${config.prefix}help${config.delimiter}${this.name} for details`);
                        return;
                    }
                }
                let output = '';
                const evaluation = parseHumanTime(args[0]);
                if(evaluation.evaluatedMs <= 0) {
                    bot.sendOutput(message.channel, `I am unable to understand ${args[0]} as a time, or it is 0. Please enter a valid time longer than 0 seconds.`);
                    return;
                }
                if(evaluation.unparsedString.length > 0) {
                    output += `Note: Unable to parse the '${evaluation.unparsedString}' part of the input\n`;
                }
                output += `Setting a timer for ` + msToTime(evaluation.evaluatedMs);
                setTimeout(() => bot.reply(message, args[1]), evaluation.evaluatedMs);
                bot.sendOutput(message.channel,output);
            }
        }
    ]
}