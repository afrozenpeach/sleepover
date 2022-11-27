const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Starts the sleepover!')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The category name to create the sleepover under.')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option
                .setName('admins')
                .setDescription('If true, the creator of a room gets admin permissions to that room.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('announcement')
                .setDescription('The announcement to make when the sleepover starts.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction, sm) {
		await interaction.reply({ content: `${interaction.options.getString('name') ?? 'The sleepover'} is starting!`, ephemeral: true });

        let so = sm.createSleepover(interaction);

        if (so === null) {
            await interaction.editReply(`${interaction.options.getString('name') ?? 'The sleepover'} failed to start.`)
        }
	},
};
