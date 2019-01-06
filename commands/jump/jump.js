const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class JumpCommand extends Command {

    constructor(client){

        super(client,{

            name : "jump",
            group : "jump",
            memberName : "jump",
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

        if(!args) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não escolheu a música");

            return message.channel.send(richEmbed);

        }

        let index = parseInt(args);

        if(isNaN(index)) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Insira número válido");

            return message.channel.send(richEmbed);

        }

        let currentPlaylist = servers[message.guild.id].currentPlaylist;
        let playlist = servers[message.guild.id].playlist.find(obj => {
            return obj.name === currentPlaylist;
        });
        
        if(index < 1 || index > playlist.queue.length) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não existe essa faixa de música");

            return message.channel.send(richEmbed);

        }
          
        playlist.status = "jumping";
        playlist.currentIndex = index-1;    
        
        if(playlist.dispatcher)
            await playlist.dispatcher.end();       
        play(message.guild.voiceConnection, message, playlist.queue[index-1].url);     
              
    }

}

module.exports = JumpCommand;