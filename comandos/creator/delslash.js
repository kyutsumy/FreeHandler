const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'delslash',
  slash: false,
  description: 'deleta um SlashCommand | [dono]',
  category: 'dono',
  aliases: ['slashdel', 'slashdelete'],
  usage: [
    '{prefix}{cmd} [all]',
    '{prefix}{cmd} [guildID]'
  ],
  args: true,
  example: [
    '> **Deleta de todas as guildas**\n\`\`\`js\n{prefix}{cmd} all\`\`\`',
    '> **Deleta de uma guilda específica**\n\`\`\`js\n{prefix}{cmd} {guildId}\`\`\`'
  ],
  minArgs: 0,
  maxArgs: 0,
  cooldown: 5,
  botperms: [''],
  userperms: [''],
  type: '',
  execute: async ({ client, message, interaction, args }) => {
    if (message) {
      if (!['OWNER ID'].some(a => message.author.id === a)) {
        return message.channel.send(client.langs.eval.aviso)
      }
      
      let check = args[0]
      
      if (check.toLowerCase() === "all") {
        await client.application.commands.set([]).then(() => {
          message.channel.send('Todos os slashCommands foram apagados!')
        });
      } else {
        let guild = await client.guilds.fetch(args[0]).catch(() => null);
        if (!guild) {
          return message.reply('Servidor não encontrado!')
        }
        
        await guild.commands.set([]).then(info => {
          console.log(info)
          message.channel.send(`SlashCommands de \`${guild.name}\` foram deletados`)
        });
      }
    }
  },
};
