const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Starts the sleepover!'),
	async execute(interaction, sm) {
        let channel = interaction.channel;

		await interaction.reply({ content: 'The sleepover is starting!' });

        let so = sm.createSleepover(interaction);

        if (so === null) {
            channel.send('A sleepover failed to start.')
        }
	},
};
