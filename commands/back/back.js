const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class BackCommand extends Command {

    constructor(client){

        super(client,{

            name : "back",
            group : "back",
            memberName : "back",
            description : ""

        });

    }

    async run (message, args){

        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não há canal de voz");
            return message.channel.send(richEmbed);
        
        }

        if(!message.guild.voiceConnection) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não estou no canal de voz");

            return message.channel.send(richEmbed);
        
        }
        
        if(!servers[message.guild.id]){
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não existe playlist");

            return message.channel.send(richEmbed);

        }

        let currentPlaylist = servers[message.guild.id].currentPlaylist;
        let playlist = servers[message.guild.id].playlist.find(obj =>  {
            return obj.name === currentPlaylist;
        });

        if(playlist.queue.length == 0) {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("A fila está vazia");

            return message.channel.send(richEmbed);

        }

        if(playlist.status != "playing") {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não estou tocando música");

            return message.channel.send(richEmbed);

        }
        
        if(playlist.currentIndex == 0) {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não ha músicas anteriores");

            return message.channel.send(richEmbed);

        }
        
        playlist.status = "returning";
        playlist.currentIndex--;        
        let index = playlist.currentIndex; 
        await playlist.dispatcher.end();        
        play(message.guild.voiceConnection, message, playlist.queue[index].url);   

    }

}

module.exports = BackCommand;