const express = require('express');
const app = express();
const port = 1337;

app.get('/', (req, res) => res.send('up and running'));

app.listen(port, () => console.log(`Moonify listening at http://localhost:${port}`));

const Discord = require("discord.js");
const client = new Discord.Client();
const btcValue = require('btc-value');
btcValue.setApiKey('your api key');
const prefix = "$"

const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("discord webhook, sends message when bot gets added or removed from a server");

hook.setUsername('Moonify Updates');
hook.setAvatar("https://imgur.com/cP36C5K.png");

client.on("ready", () => {
  console.log("ready")
  client.user.setActivity(`to the moon! - $help`);
});


client.on("guildCreate", guild => {
  hook.send(`:white_check_mark: I have been added to **${guild.name}** with **${guild.memberCount} users**`)
});

client.on("guildDelete", guild => {
  hook.send(`:x: I have been removed from **${guild.name}**`)
});

client.on("message", async message => { 
    if(message.author.bot) return;
    
    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "price") {
      btcValue({isDecimal: true}).then(value => {
        const embed = new Discord.MessageEmbed()
              .setColor("#FF7F50")
              .setAuthor(`BITCOIN PRICE`)
              .setTitle(`$`+ value)
              .setTimestamp()
        message.channel.send(embed);
      })}
      
    if(command == "value") {
        const bvalue = Number(args[0])
        if(!bvalue) {
          return message.channel.send("Provide a valid number!")
        }
            btcValue({quantity: bvalue, isDecimal: true}).then(value => {
            const embed = new Discord.MessageEmbed()
              .setColor("#FF7F50")
              .setAuthor(`price of ${bvalue} Bitcoins`)
              .setTitle(`$`+ value)
              .setTimestamp()
            message.channel.send(embed);
          })}
    
    if(command == "help") {
      const embed = new Discord.MessageEmbed()
              .setColor("#FF7F50")
              .setTitle(`Help`)
              .setDescription("List of all commands")
              .addField("price", "Display the current bitcoin price")
              .addField("value [number]", "Display the value of [number] Bitcoins")
              .addField("hour", "Display the change of the BTC value in the last hour")
              .addField("day", "Display the change of the BTC value in the last day")
              .addField("week", "Display the change of the BTC value in the last week")
              .addField("stats", "returns the botstats of Moonify")
              .addField("invite", "returns the invite link of Moonify")
              .setFooter("Moonify V1.3")
            message.channel.send(embed);
          }

    if(command == "weekly") {
      btcValue.getPercentageChangeLastWeek().then(week => {
            if(Number(week) > 0) {
              var weekly = "00FF00"
            }
            if(Number(week) < 0) {
              var weekly = "FF0000"
            }           
      const weekembed = new Discord.MessageEmbed()
              .setColor(`#${weekly}`)
              .setTitle(`Change of the BTC value in the last week`)
              .setDescription(`${week}%`)
            message.channel.send(weekembed);
          })};

      if(command == "hourly") {
        btcValue.getPercentageChangeLastHour().then(hour => {
          if(Number(hour) > 0) {
            var hourly = "00FF00"
          }
          if(Number(hour) < 0) {
            var hourly = "FF0000"
          }
          
    const hourembed = new Discord.MessageEmbed()
            .setColor(`#${hourly}`)
            .setTitle(`Change of the BTC value in the last hour`)
            .setDescription(`${hour}%`)
          message.channel.send(hourembed);
        })};

      if(command == "daily") {
        btcValue.getPercentageChangeLastDay().then(day => {
          if(Number(day) > 0) {
            var daily = "00FF00"
          }
          if(Number(day) < 0) {
            var daily = "FF0000"
          }      
    const dayembed = new Discord.MessageEmbed()
            .setColor(`#${daily}`)
            .setTitle(`Change of the BTC value in the last 24h`)
            .setDescription(`${day}%`)
          message.channel.send(dayembed);
        })};

      if(command == "invite") {
        const embed = new Discord.MessageEmbed()
        .setTitle("Click Me")
        .setURL("bot invite link")
        .setFooter("Moonify V1.3")
        message.channel.send(embed)
      }

      if(command == "stats") {
        const embed = new Discord.MessageEmbed()
        .setTitle("Moonify Stats")
        .addField("Servers", client.guilds.cache.size)
        .addField("Users", client.users.cache.size)
        message.channel.send(embed)

      }
});
client.login("your bot token");
