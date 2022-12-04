require('dotenv').config()
const { Client, Partials, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions
	],
  partials: [
    Partials.User, 
    Partials.Message, 
    Partials.Channel, 
    Partials.Reaction, 
    Partials.GuildMembers
  ]
});
const { registerEvents, registerCommands } = require('./utils/registry');

client.slash = new Collection();
client.commands = new Collection();
client.cooldowns = new Collection();

(async () => {
  await registerEvents(client, '../eventos');
  await registerCommands(client, '../comandos');
})();
  
client.login(process.env.TOKEN);
