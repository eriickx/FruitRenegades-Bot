const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class JoinCommand extends Command {

    constructor(client){

        super(client,{

            name : "join",
            group : "join",
            memberName : "join",
            description : ""

        });

    }

    async run (message, args){
        
        if(message.guild.voiceConnection) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Já estou no canal de voz");

            return message.channel.send(richEmbed);
        
        }

        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não há canal de voz");
            return message.channel.send(richEmbed);
        
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);

        if(!permissions.has("CONNECT")) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não posso me connectar");

            return message.channel.send(richEmbed);
        
        }

        if(!permissions.has("SPEAK")) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não estou habilitado para tocar");

            return message.channel.send(richEmbed);
        
        }     
                        
        voiceChannel.join();

        if(servers[message.guild.id]){

            let currentPlaylist = servers[message.guild.id].currentPlaylist;
            let playlist = servers[message.guild.id].playlist.find(obj => {
                return obj.name === currentPlaylist;
            }); 
        
            if(playlist.currentIndex < playlist.queue.length){
                
                let index = playlist.currentIndex;
                play(message.guild.voiceConnection, message, playlist.queue[index].url);

            }

        }
        else {

            servers[message.guild.id] = {
    
                currentPlaylist : "",
                playlist : [{

                    name : "",
                    queue : [],                
                    status : "stopped",
                    currentIndex : 0,
                    loop : false,
                    shuffle : false
    
                }]
    
            };
            
            save();

        }
        
    }

}

module.exports = JoinCommand;