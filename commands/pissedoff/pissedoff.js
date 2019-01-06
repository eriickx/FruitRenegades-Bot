const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const ytdl = require("ytdl-core");

class PissedOffCommand extends Command {

    constructor(client){

        super(client,{

            name : "vtc",
            group : "vtc",
            memberName : "vtc",
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
    
        }
        
        if(servers[message.guild.id]){

            let currentPlaylist = servers[message.guild.id].currentPlaylist;
            let playlist = servers[message.guild.id].playlist.find(obj =>  {
                return obj.name === currentPlaylist;
            });

            if(playlist.status != "stopped") {

                playlist.status = "stopped";
                await playlist.dispatcher.end();

            }

        }

        if(args) {

            let richEmbed = new RichEmbed().setColor("#ff0000");
            if(!message.member.hasPermission("KICK_MEMBERS")){
                richEmbed.setDescription("Só não dou kick porque não tenho permissão!!");
                //return message.channel.send(richEsmbed);
            }
    
            let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args));
            
            if(!member){
                richEmbed.setDescription("Só não dou kick porque não encontrei o usuário!!");
                //return message.channel.send(richEmbed);
            }
    
            if(!member.kickable){
                richEmbed.setDescription("Só não dou kick porque não consigo!!");
                //return message.channel.send(richEmbed);
            }
    
            const dispatcher = message.guild.voiceConnection.playStream(ytdl("https://www.youtube.com/watch?v=l5hvakZf8qw", {filter : "audioonly"}));
            dispatcher.on("end", function(){
                
                member.kick();
        
                richEmbed.setDescription(`${member.user.username} foi pra puta que o pariu!!`);
                message.channel.send(richEmbed);

                if(playlist) {

                    let index = playlist.currentIndex;
                    play(message.guild.voiceConnection, message, playlist.queue[index].url);

                }

            });
            
        }
        else {

            if(playlist.status != "stopped") {

                playlist.status = "stopped";
                await playlist.dispatcher.end();

            }

            const dispatcher = message.guild.voiceConnection.playStream(ytdl("https://www.youtube.com/watch?v=l5hvakZf8qw", {filter : "audioonly"}));
            dispatcher.on("end", function(){
                
                if(playlist) {

                    let index = playlist.currentIndex;
                    play(message.guild.voiceConnection, message, playlist.queue[index].url);

                };

            });

        }

    }

}

module.exports = PissedOffCommand;