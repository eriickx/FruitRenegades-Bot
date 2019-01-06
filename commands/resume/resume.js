const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class ResumeCommand extends Command {

    constructor(client){

        super(client,{

            name : "resume",
            group : "resume",
            memberName : "resume",
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
        let playlist = servers[message.guild.id].playlist.find(obj => {
            return obj.name === currentPlaylist;
        });

        if(playlist.status != "paused") {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não há nada pausado");
                            
            return message.channel.send(richEmbed);

        }

        await playlist.dispatcher.resume(); 
        playlist.status = "playing";      
        
        save();
               
    }

}

module.exports = ResumeCommand;