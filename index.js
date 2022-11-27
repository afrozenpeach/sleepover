const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');
const SleepoverManager = require('./modules/sleepover-manager');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const sm = new SleepoverManager();

client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}

	commands.push(command.data.toJSON());
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    for (const g of c.guilds.cache) {
        updateGuild(token, g[1], clientId, commands);
    }
});

// Log in to Discord with your client's token
client.login(token);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, sm);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    if (oldState.channelId !== newState.channelId) {
        let sleepovers = sm.getSleepovers(newState.guild.id);

        if (sleepovers.length > 0) {
            try {
                sleepovers.forEach(s => {
                    if (newState.channelId === s.getLobbyChannel().id) {
                        s.createRoom(newState.member);
                    }

                    if (oldState.channel?.permissionOverwrites.cache.filter(po => po.type === 1 && po.id === oldState.member.id && oldState.channelId !== s.getDoghouseChannel().id).size > 0) {
                        oldState.channel.delete();
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
});

client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);

    updateGuild(token, guild, clientId, commands);
})

function updateGuild(token, guild, clientId, commands) {
    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(token);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${guild.name}'s ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guild.id),
                { body: commands },
            );

            console.log(`Successfully reloaded ${guild.name}'s ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}