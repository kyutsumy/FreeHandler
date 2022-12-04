const { ApplicationCommandType } = require('discord.js');

module.exports = {
   name: "ping",
   aliases: ['ms'],
   slash: true,
   description: "retorna o ping da bot | [outros]",
   type: ApplicationCommandType.ChatInput,
   execute: async ({ client, message, interaction, args }) => {
     if (message) {
       message.reply(`${client.ws.ping} ms!`)
     }
     if (interaction) {
      interaction.reply({ 
         content: `${client.ws.ping} ms!` 
        }); 
     }
   },
};
