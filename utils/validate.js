module.exports.checkCommandModule = (cmdName, cmdModule) => {
  if (!cmdModule.hasOwnProperty('execute'))
    throw new Error(`${cmdName} o modulo do commando não possui 'execute'`);
  if (!cmdModule.hasOwnProperty('description'))
    throw new Error(`${cmdName} o moduleo do comando não possui 'description`);
  if (!cmdModule.hasOwnProperty('aliases'))
    throw new Error(`${cmdName} o modulo do comando não possui 'aliases'`);
  return true;
}

module.exports.checkProperties = (cmdName, cmdModule) => {
  if (typeof cmdModule.execute !== 'function')
    throw new Error(`comando ${cmdName}: execute is not a function`);
  if (typeof cmdModule.description !== 'string')
    throw new Error(`comando ${cmdName}: description is not a string`);
  if (!Array.isArray(cmdModule.aliases))
    throw new Error(`comando ${cmdName}: aliases is not an Array`);
  return true;
}