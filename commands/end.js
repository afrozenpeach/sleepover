const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Ends the sleepover!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction, sm) {
		await interaction.reply({ content: 'The sleepover is ending!' });

        sm.removeSleepover(interaction);
	},
};
