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

    /**
     * Utility function to handle running a callback more than (2^31 - 1)ms in the future.
     *
     * @param {() => void} cb The callback to run.
     * @param {number} ms How long in the future to run this callback. If this is larger than
     * MAX_SAFE_INTEGER, the callback will be run immediately.
     */
    static runInFuture(cb, ms) {
        const MAXIMUM_SETTIMEOUT_LENGTH = 0x7FFFFFFF;

        // TODO: If we need to set a timeout 285,616 years in the future, handle this.
        if (ms > Number.MAX_SAFE_INTEGER) {
            cb();
        }

        if (ms <= MAXIMUM_SETTIMEOUT_LENGTH) {
            setTimeout(cb, ms);
        } else {
            setTimeout(
                () => this.runInFuture(cb, ms - MAXIMUM_SETTIMEOUT_LENGTH),
                MAXIMUM_SETTIMEOUT_LENGTH
            );
        }
    }
}

module.exports = Utility;
