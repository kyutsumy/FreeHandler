const c = require('ansi-colors');
const fs = require('fs').promises;
const path = require('path');
const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { checkCommandModule, checkProperties } = require('./validate');
const commandStatus = [
    [`${c.bold('Comando')}`, `${c.bold('Status')}`, `${c.bold('Args')}`]
], eventStatus = [
    [`${c.bold('Evento')}`, `${c.bold('Status')}`, `${c.bold('Once')}`]
];

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: '9' }).setToken(TOKEN);


async function registerEvents(client, dir) {
  let files = await fs.readdir(path.join(__dirname, dir));
  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if(stat.isDirectory())
    registerEvents(client, path.join(dir, file));
    else {
      if (file.endsWith(".js")) {
        let eventName = file.substring(0, file.indexOf(".js"));
        try {
          let eventModule = require(path.join(__dirname, dir, file));
          if (eventModule.once) {
            client.once(eventName, (...args) => eventModule.execute(...args, client));
            eventStatus.push(
              [`${c.red(`${eventName}`)}`, `${c.bgGreenBright('Sucesso')}`, `${eventModule.once}`]
            );
          } else {
            client.on(eventName, (...args) => eventModule.execute(...args, client));
            eventStatus.push(
              [`${c.red(`${eventName}`)}`, `${c.bgGreenBright('Sucesso')}`, `${eventModule.once}`]
            );
          }
        }
        catch (err) {
          console.log(err);
          eventStatus.push(
            [`${c.white(`${eventName}`)}`, `${c.bgRedBright('Falha')}`, '']
          );
        }
      }
    }
  }
}


async function registerCommands(client, dir) {
  let files = await fs.readdir(path.join(__dirname, dir));
  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory())
      registerCommands(client, path.join(dir, file));
    else {
      if (file.endsWith(".js")) {
        let cmdName = file.substring(0, file.indexOf(".js"));
        try {
          let cmdModule = require(path.join(__dirname, dir, file));
          if (checkCommandModule(cmdName, cmdModule)) {
            if (checkProperties(cmdName, cmdModule)) {
              client.commands.set(cmdName, cmdModule);
              commandStatus.push(
                [`${c.cyan(`${cmdName}`)}`, `${c.bgGreenBright('Sucesso')}`, `${cmdModule.args}`]
              )
            }
          }
        }
        catch (err) {
          console.log(err);
          commandStatus.push(
            [`${c.white(`${cmdName}`)}`, `${c.bgRedBright('Falha')}`, '']
          );
        }
      }
    }
  }
  const slashArray = []
  const slash = await globPromise(
    `${process.cwd()}/comandos/*/*.js`
  );
  
  slash.map((value) => {
    let file = require(value)
    
    if (file.slash) {
      client.slash.set(file.name, file)
      
      slashArray.push({
        name: file.name,
        description: file.description,
        type: file.type,
        options: file.options ? file.options : null,
        default_permission: file.default_permission ? file.default_permission : null,
        default_member_permissions: file.default_member_permissions ? PermissionsBitField.resolve(file.default_member_permissions).toString() : null
      });
    }
  })
  
			try {
				await rest.put(
					process.env.GUILD_ID ?
					Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID) :
					Routes.applicationCommands(CLIENT_ID), 
					{ body: slashArray }
				);
			} catch (error) {
				console.log(error);
			}
}

module.exports = {
  eventStatus, 
  commandStatus,
  registerEvents,
  registerCommands
};
