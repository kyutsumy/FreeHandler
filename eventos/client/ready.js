const mongoose = require('mongoose');
const tableConfig = require('../../utils/tableConfig');
const { ActivityType } = require('discord.js');
const { eventStatus, commandStatus } = require('../../utils/registry');
const { createStream } = require('table');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {

    console.log(`Bot: ${client.user.tag}`);

    await loadTable(eventStatus, 50);
    console.log("\n")
    await loadTable(commandStatus, 50);

    let activities = [
    `Uma linda flor!`
    ],
      i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {
      type: ActivityType.Listening
    }), 7000);
    client.user
      .setStatus("online");

    // database
    /*mongoose.connect(process.env.MONGO_URI, {
	   useNewUrlParser: true,
	   useUnifiedTopology: true,
   }, (err) => {
     if (err) return console.log(`Erro ao conectar no database!\n${err}`)
     console.log(`\nMongoDB conectada!`)
   });*/
  },
};

function loadTable(arr, interval) {
  let fn, i = 0,
    stream = createStream(tableConfig);
  return new Promise((resolve, reject) => {
    fn = setInterval(() => {
      if (i === arr.length) {
        clearInterval(fn);
        resolve();
      } else {
        stream.write(arr[i]);
        i++;
      }
    }, interval);
  })
}