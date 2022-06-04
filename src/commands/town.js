const config = require("../../docs/deploy/config.json");
const Path = require("path");
const Logger = require(Path.resolve(global.appRoot, "helpers/logger"));

// TODO: if (member.roles.some(role => role.name === '<role name>')) { <-- better way to check if user has role

const getRoleIds = async (guild) => {
    const roles = ["In Town", "Out of Town"];
    const roleIds = [];
    for(const roleName of roles) {
        roleIds[roleName] = await new Promise((resolve, reject) => {
            guild.roles.fetch().then(guildRoles => {
                const idVal = guildRoles.cache.find(role => role.name === roleName);
                if(idVal) {
                    resolve(idVal.id);
                }
                else {
                    guild.createRole({
                        name: roleName,
                        hoist: true,
                        mentionable: true,
                    }).then(newRole => {
                        resolve(newRole.id);
                    }).catch((err) => {
                        Logger.logMessage("ERROR", err);
                        reject();
                    });
                }
            });
        });
    }
    return roleIds;
};

const replaceMemberRole = async (fromRole, toRole, message, bot) => {
    const roleIds = await getRoleIds(message.guild);
    const roleCache = message.member.roles.cache;
    if(roleCache.has(roleIds[toRole])) {
        bot.sendOutput(message.channel, `You are already '${toRole}'`);
        return;
    }
    else if(roleCache.has(roleIds[fromRole])) {
        message.member.roles.remove(roleIds[fromRole]).catch((err) => {
            Logger.logMessage("ERROR", err);
        });
    }
    message.member.roles.add(roleIds[toRole]).catch((err) => {
        Logger.logMessage("ERROR", err);
    });
    bot.sendOutput(message.channel, `You are now set to be '${toRole}'`);
};

module.exports = {
    commands: [
        {
            get name() { return "intown";},
            fileAlias: "town",
            description: "Sets the user to be in town",
            get example() { return `${config.prefix}${this.name}`;},
            guildOnly: true,
            aliases: ["in"],
            method: (message, args, bot) => {
                replaceMemberRole("Out of Town", "In Town", message, bot);
            },
        },
        {
            get name() { return "outtown";},
            fileAlias: "town",
            description: "Sets the user to be out of town",
            get example() { return `${config.prefix}${this.name}`;},
            guildOnly: true,
            aliases: ["out"],
            method: (message, args, bot) => {
                replaceMemberRole("In Town", "Out of Town", message, bot);
            },
        },
    ],
};