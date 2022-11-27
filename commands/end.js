const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Ends the sleepover(s)!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the sleepover to end.')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option
                .setName('timelimit')
                .setDescription('The number of minutes to allow for current discussions to end before cleaning up.')
                .setRequired(false)
        ),
	async execute(interaction, sm) {
		await interaction.reply({ content: `${interaction.options.getString('name') ?? 'sleepover'} is ending!`, ephemeral: true });

        sm.removeSleepover(interaction);
	},
};
