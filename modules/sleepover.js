const { ChannelType } = require("discord.js");

module.exports = class Sleepover {
    constructor(interaction) {
        this.guild = interaction.guild;
        this.announcementsChannel = interaction.channel;
        this.sleepoverCategory = null;
        this.lobbyChannel = null;
        this.doghouseChannel = null;
        this.overridePermissions = interaction.options.getBoolean('admins') ?? true;
        this.name = interaction.options.getString('name') ?? 'The Sleepover';
        this.announcement = interaction.options.getString('announcement') ?? `${this.name} has started!`;

        this.startSleepover(interaction);
    }

    getGuild() {
        return this.guild;
    }

    startSleepover(interaction) {
        let so = this;

        this.guild.channels.create({
            name: this.name,
            reason: `${this.name} has started`,
            type: ChannelType.GuildCategory
        }).then(soc => {
            so.sleepoverCategory = soc;

            so.sleepoverCategory.children.create({
                name: 'The Lobby',
                reason: `${this.name} has started!`,
                type: ChannelType.GuildVoice
            }).then(sol => {
                so.lobbyChannel = sol;

                so.sleepoverCategory.children.create({
                    name: 'The Dog House',
                    reason: `${this.name} has started!`,
                    type: ChannelType.GuildVoice
                }).then(async sod => {
                    so.doghouseChannel = sod;

                    so.doghouseChannel.permissionOverwrites.create(so.guild.roles.everyone, { 'Speak': false });

                    so.announcementsChannel.send(so.announcement);

                    await interaction.editReply(`${this.name} has started!`);
                })
            });
        }).catch(async () => {
            await interaction.editReply(`${this.name} failed to start!`);
        });

        return this;
    }

    endSleepover(interaction) {
        let so = this;

        this.guild.channels.delete(this.lobbyChannel, `${this.name} has ended!`).then(async () => {
            so.sleepoverCategory.children.cache.forEach(async c => {
                await c.delete(`${this.name} has ended!`)
            });

            so.guild.channels.delete(this.sleepoverCategory, `${this.name} has ended!`);
        });

        interaction.editReply(`${this.name} has ended!`);
    }

    getLobbyChannel() {
        return this.lobbyChannel;
    }

    getDoghouseChannel() {
        return this.doghouseChannel;
    }

    getName() {
        return this.name;
    }

    createRoom(member) {
        let so = this;

        this.sleepoverCategory.children.create({
            name: member.nickname ?? member.user.username,
            reason: `${this.name} has started!`,
            type: ChannelType.GuildVoice
        }).then(c => {
            member.voice.setChannel(c);

            c.permissionOverwrites.create(member, so.overridePermissions ? {'ManageChannels': true, 'MoveMembers': true} : {});

            this.doghouseChannel.permissionOverwrites.create(member, so.overridePermissions ? {'MoveMembers': true} : {});
        })
    }
}