const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class SkipCommand extends Command {

    constructor(client){

        super(client,{

            name : "skip",
            group : "skip",
            memberName : "skip",
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
        
        if(playlist.queue.length > 0) {

            if(playlist.currentIndex == playlist.queue.length - 1) {

                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("Não há mais músicas");
    
                return message.channel.send(richEmbed);
    
            }

            if(playlist.status != "playing") {

                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("Não estou tocando música");
    
                return message.channel.send(richEmbed);
    
            }
            
            playlist.status = "skipping";
            playlist.currentIndex++;       
            let index = playlist.currentIndex; 
            await playlist.dispatcher.end();       
            play(message.guild.voiceConnection, message, playlist.queue[index].url);   
            //servers[message.guild.id].dispatcher.end();

            /*if(servers[message.guild.id].isPlaying) {

                if(servers[message.guild.id].currentIndex == servers[message.guild.id].queue.length - 1) return;
               
                //servers[message.guild.id].isPlaying = false;
                servers[message.guild.id].currentIndex++;                
                let index = servers[message.guild.id].currentIndex;
                play(message.guild.voiceConnection, message, servers[message.guild.id].queue[index]);

            }*/
    
        }        

    }

}

module.exports = SkipCommand;