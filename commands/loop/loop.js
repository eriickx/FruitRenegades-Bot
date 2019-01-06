const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class LoopCommand extends Command {

    constructor(client){

        super(client,{

            name : "loop",
            group : "loop",
            memberName : "loop",
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
        
        if(!servers[message.guild.id]) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Você não possui playlists");

            return message.channel.send(richEmbed);

        }

        let currentPlaylist = servers[message.guild.id].currentPlaylist;
        let playlist = servers[message.guild.id].playlist.find(obj => {
            return obj.name === currentPlaylist;
        });
        
        playlist.loop = !playlist.loop;

        if(playlist.loop) {

            let richEmbed = new RichEmbed()
                            .setColor("#ADD8E6")
                            .setTitle("Modo de repetição ativado");

            message.channel.send(richEmbed);

        }
        else {

            let richEmbed = new RichEmbed()
                            .setColor("#ADD8E6")
                            .setTitle("Modo de repetição desativado");

            message.channel.send(richEmbed);

        }
                
        save();

    }

}

module.exports = LoopCommand;