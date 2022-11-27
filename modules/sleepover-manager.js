const Sleepover = require("./sleepover");

module.exports = class SleepoverManager {
    constructor() {
        this.sleepovers = [];
    }

    createSleepover(interaction) {
        let guildMatch = this.sleepovers.filter(el => {
            return el.getGuild().id !== interaction.guild.id;
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
            if (el.getGuild().id === interaction.guild.id) {
                el.endSleepover();
            }

            return el.getGuild().id !== interaction.guild.id;
        });
    }

    getSleepovers(guildId) {
        return this.sleepovers.filter(el => {
            return el.getGuild().id === guildId;
        })
    }
}