const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Cleans up after the sleepover(s)!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the sleepover to clean up.')
                .setRequired(true)
        ),
	async execute(interaction, sm) {
		await interaction.reply({ content: `${interaction.options.getString('name') ?? 'sleepover'} is being cleaned!`, ephemeral: true });

        sm.clean(interaction);
	},
};
