const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class LeaveCommand extends Command {

    constructor(client){

        super(client,{

            name : "leave",
            group : "leave",
            memberName : "leave",
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

        let currentPlaylist = servers[message.guild.id].currentPlaylist;
        let playlist = servers[message.guild.id].playlist.find(obj => {
            return obj.name === currentPlaylist;
        });
        
        if(playlist.status == "playing") {

            playlist.status = "stopped";
            playlist.dispatcher.end();  
                
        }       

        message.guild.voiceConnection.disconnect();   
                
        save();

    }

}

module.exports = LeaveCommand;