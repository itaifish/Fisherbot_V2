class Utility {

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static parseHumanTime(timeToParse) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        let totalTime = 0;

        const regexes = [
            [/[0-9]+[\s]*[Dd]((ay)s?)?/g, day],
            [/[0-9]+[\s]*[Hh]((ours?)|(rs?))?/g, hour],
            [/[0-9]+[\s]*[Mm]((in(ute)?s?))?/g, minute],
            [/[0-9]+[\s]*[Ss]((ec(ond)?s?))?/g, second],
        ];
        for(const regex of regexes) {
            const matches = timeToParse.match(regex[0]);
            while(matches && matches.length > 0) {
                const numVal = matches.pop();
                timeToParse = timeToParse.replace(new RegExp(numVal), "");
                totalTime += parseInt(numVal.replace(/[a-zA-Z]+/g, "")) * regex[1];
            }
        }

        return {
            evaluatedMs: totalTime,
            unparsedString: timeToParse.trim(),
        };
    }
}

module.exports = Utility;
