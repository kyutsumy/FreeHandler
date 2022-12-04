const util = require('util');
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'eval',
  slash: true,
  description: 'não serve para nada assim como você | [dono]',
  category: 'dono',
  aliases: ['e', 'evaluate'],
  usage: ['{prefix}{cmd} (código)'],
  args: true,
  example: ['> pegando o id da guilda\n\`\`\`js\n{prefix}{cmd} message.guild.id\`\`\`'],
  minArgs: 0,
  maxArgs: 0,
  cooldown: 5,
  botperms: 0,
  userperms: 0,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'valor',
      description: 'valor que sera codificado',
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],
	execute: async ({ client, message, interaction, args }) => {
    if (interaction) {
      if (!['OWNER ID'].some(a => interaction.user.id === a)) {
	      return interaction.reply('Você não pode usar este comando!')
      }
      try {
        let { options } = interaction;
        let codigo = options.getString('valor')
        let resulSlash = util.inspect(eval(codigo)).slice(0, 1900);
        await interaction.reply(`\`\`\`js\n${resulSlash}\`\`\``)
      } catch (erro) {
        let typeSlash = typeof(resulSlash)
        if (typeSlash === 'undefined') typeSlash = "indefinido"
     
     return interaction.reply(`\`\`\`js\n${erro}\`\`\``)        
      }      
    }
      
    if (message) {
      if (!['OWNER ID'].some(a => message.author.id === a)) {
	      return message.channel.send(' Você não pode usar este comando ')
      }
      try {
        let codigo = args.join(" ");
        let resultCmd = util.inspect(eval(codigo)).slice(0, 1900);
        await message.reply(`\`\`\`js\n${resultCmd}\`\`\``)
      } catch (erro) { 
        let typeCmd = typeof(resultypeCmd)
        if (typeCmd === 'undefined') typeCmd = "indefinido"
     
        return message.channel.send(`\`\`\`js\n${erro}\`\`\``) 
      }
    }
	},
};

