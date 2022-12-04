const { EmbedBuilder, Collection } = require('discord.js');
const { perms } = require('../../functions/config');
const { msToTime, timeStringToMS } = require('../../functions/utils');

/*const guildSchema = require('../../schemas/guild');*/

module.exports = {
	name: 'message',
	once: false,
	async execute(message, client) {
	
  if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	client.cor = "#8B6EFF";
	/*client.prefix = await prefix(message);*/
  client.msTime = msToTime;
	client.timeMs = timeStringToMS;
	
	if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {
		message.channel.send(`**${message.author}, prefixo: \`$\`**`)
	}
 
    /*let prefix2 = await guildSchema.findOne({
    	guild_id: message.guild.id
    });*/
    
    let prefix = "$" /*prefix2.prefixo;*/

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			cmd => cmd.aliases && cmd.aliases.includes(commandName)
		);

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('Eu so posso executar este comando em seu privado');
	}

	if (command.userperms) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || ![process.env.OWNER].includes(message.author.id) && !authorPerms.has(command.userperms)) {
			
			let prm = command.userperms.map(p => perms[p]).join(", ");

			return message.reply(`**Permissões necessários: \`${prm}\`**`);
		}
	}

	if (command.args && !args.length) {
		if (command.usage) {
			String.prototype.replaceAll = function(obj) {
		    var retStr = this;
		    for (var x in obj) {
			    retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
		    }
		    return retStr;
	    };
	    let variaveis = {
	    	'{cmd}': command.name,
	    	'{msg_id}': message.id,
	    	'{prefix}': prefix,
        '{author}': message.author.tag,
        '{guildId}': message.guild.id,
	    	'{channel}': message.channel,
	    	'{channel_id}': message.channel.id,
	    	'{channel_name}': message.channel.name
	    }
	    
	    let usage_1 = `**\`${command.usage.join('\`\n»\n\`')}\`**` || 'em construção';
	    let example_1 = command.example.join(`»\n`) || 'em construção';
	    let usage_2 = usage_1.replaceAll(variaveis) || 'em construção';
	    let example_2 = example_1.replaceAll(variaveis) || 'em construção';
			
		  let embeduso = new EmbedBuilder()
			.setColor(client.cor)
			.setTitle(`Faltou algo ai hein!`)
			.setDescription(`Não foi possível executar o comando **\`${command.name}\`** ${command.description || 'em construção'}\n\n${usage_2}`)
			.addFields(
			  { name: 'Uso correto', value: example_2
			  }
			)
		}

		return message.reply({ embeds: [embeduso] });
	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;

			let esc = timeLeft.toFixed(0);
			if (esc > 1) esc = 'segundos';
			if (esc < 2) esc = 'segundo';

			return message.reply(
				`**Precisa esperar \`${timeLeft.toFixed(
					0
				)} ${esc}\` para usar o comando \`${command.name}\` novamente!**`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		command.execute({ client, message, args }).catch(error => {
		  console.log(error)
    })
	},
};
