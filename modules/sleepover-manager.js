const Sleepover = require("./sleepover");

module.exports = class SleepoverManager {
    constructor() {
        this.sleepovers = [];
    }

    createSleepover(interaction) {
        let guildMatch = this.sleepovers.filter(el => {
            return el.getGuild().id === interaction.guild.id && el.getName() === (interaction.options.getString('name') ?? 'The Sleepover');
        })

        if (guildMatch.length > 0) {
            return null;
        } else {
            let so = new Sleepover(interaction);
            this.sleepovers.push(so);

            return so;
        }
    }

    removeSleepover(interaction) {
        this.sleepovers = this.sleepovers.filter(el => {
            if (el.getGuild().id === interaction.guild.id && (interaction.options.getString('name') ?? 'The Sleepover') === el.getName()) {
                el.endSleepover(interaction);

                return false;
            } else {
                return true;
            }
        });
    }

    getSleepovers(guildId) {
        return this.sleepovers.filter(el => {
            return el.getGuild().id === guildId;
        })
    }
}