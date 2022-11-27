const { ChannelType } = require("discord.js");

module.exports = class Sleepover {
    constructor(interaction) {
        this.guild = interaction.guild;
        this.announcementsChannel = interaction.channel;
        this.sleepoverCategory = null;
        this.lobbyChannel = null;

        this.startSleepover();
    }

    getGuild() {
        return this.guild;
    }

    startSleepover() {
        let so = this;

        this.guild.channels.create({
            name: 'Sleepover',
            reason: 'The sleepover has started',
            type: ChannelType.GuildCategory
        }).then(soc => {
            so.sleepoverCategory = soc;

            so.sleepoverCategory.children.create({
                name: 'The Lobby',
                reason: 'The sleepover has started',
                type: ChannelType.GuildVoice
            }).then(sol => {
                so.lobbyChannel = sol;

                so.announcementsChannel.send('The sleepover has started!');
            });
        }).catch(() => {
            so.announcementsChannel.send('The sleepover failed.');
        });

        return this;
    }

    endSleepover() {
        let so = this;

        this.guild.channels.delete(this.lobbyChannel, 'The sleepover has ended').then(async () => {
            so.sleepoverCategory.children.cache.forEach(async c => {
                await c.delete('The sleepover has ended')
            });

            so.guild.channels.delete(this.sleepoverCategory, 'The sleepover has ended');
        });

        this.announcementsChannel.send('The sleepover has ended!');
    }

    getLobbyChannel() {
        return this.lobbyChannel;
    }

    createRoom(member) {
        this.sleepoverCategory.children.create({
            name: member.nickname ?? member.user.username,
            reason: 'The sleepover has started',
            type: ChannelType.GuildVoice
        }).then(c => {
            member.voice.setChannel(c);

            c.permissionOverwrites.create(member, {ManageChannels: true});
        })
    }
}