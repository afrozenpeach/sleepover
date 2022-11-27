const { ChannelType } = require("discord.js");
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

    async clean(interaction) {
        let name = interaction.options.getString('name') ?? 'The Sleepover';

        let categories = interaction.guild.channels.cache.filter(el => el.type === ChannelType.GuildCategory && el.name === name);

        for (const p of categories) {
            for (const c of p[1].children.cache) {
                if (c[1].type === ChannelType.GuildVoice) {
                    await c[1].delete();
                }
            }

            if (p[1].children.cache.size === 0) {
                await p[1].delete();
            }
        }

        await interaction.editReply('Finished cleaning!');
    }
}