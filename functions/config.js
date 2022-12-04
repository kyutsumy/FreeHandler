const prm = require('../perms.json');
/*const guildSchema = require('../schemas/guild');*/

/*async function prefix (message) {
	
	let pre = await guildSchema.findOne({
      guild_id: message.guild.id
    })
	
	let test = pre.prefixo
	return test;
}*/

async function perms (message) {
   let fim = prm
  return fim;
}

module.exports = {
	perms,
	/*prefix*/
}
