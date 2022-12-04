module.exports = {
	name: 'interactionCreate',
  once: false,
 async execute(interaction, client) {
 	 if (interaction.isCommand()) {
     const cmd = client.slash.get(interaction.commandName);
     if (!cmd)
       return interaction.followUp({ content: "ocorreu um erro!" });

     const args = [];

     for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
              if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
     }
     interaction.member = interaction.guild.members.cache.get(
         interaction.user.id
     );

     cmd.execute({ client, interaction, args });
   }
   if (interaction.isContextMenuCommand()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.slash.get(interaction.commandName);
      if (command) command.execute({ client, interaction });
   }
 },
};
