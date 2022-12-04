module.exports = {
  name: 'error',
  once: true,
  async execute(err, client) {
    console.log(err);
    /*
    client.channels.cache.get("id do canal").send(`Ocorreu um erro:\`\`\`js\n${err.message}\`\`\``)*/
  },
};
