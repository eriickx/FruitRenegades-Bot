const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class ChangeCommand extends Command {

    constructor(client){

        super(client,{

            name : "change",
            group : "change",
            memberName : "change",
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

        if(args) {
 
            let newPlaylist = servers[message.guild.id].playlist.find(obj => {
                return obj.name.toLowerCase() === args.toLowerCase();
            });

            if(!newPlaylist){
                
                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("Essa playlist não existe");

                return message.channel.send(richEmbed);

            }   
            else {

                if(playlist.status = "playing") {

                    playlist.status = "stopped";
                    await playlist.dispatcher.end();  
                        
                }       
                    
                servers[message.guild.id].currentPlaylist = args;
                save();
                //playlist = servers[message.guild.id].playlist[args];
        
                if(newPlaylist.currentIndex < newPlaylist.queue.length){
                        
                    let index = newPlaylist.currentIndex;
                    play(message.guild.voiceConnection, message, newPlaylist.queue[index].url);
        
                }

            }

        }
        else {
          
            let newPlaylist = servers[message.guild.id].playlist.find(obj => {
                return obj.name.toLowerCase() === "";
            });

            servers[message.guild.id].currentPlaylist = "";

            if(playlist.status == "playing") {

                playlist.status = "stopped";
                await playlist.dispatcher.end();  
                    
            }    
            
            save();

            if(newPlaylist.currentIndex < newPlaylist.queue.length){
                        
                let index = newPlaylist.currentIndex;
                play(message.guild.voiceConnection, message, newPlaylist.queue[index].url);
    
            }

        }

    }

}

module.exports = ChangeCommand;