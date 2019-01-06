const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class ShuffleCommand extends Command {

    constructor(client){

        super(client,{

            name : "shuffle",
            group : "shuffle",
            memberName : "shuffle",
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
                            .setTitle("Não existe playlist");

            return message.channel.send(richEmbed);

        }

        let currentPlaylist = servers[message.guild.id].currentPlaylist;
        let playlist = servers[message.guild.id].playlist.find(obj => {
            return obj.name === currentPlaylist;
        });

        if(playlist.queue.length == 0) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("A fila está vazia");

            return message.channel.send(richEmbed);

        }

        if(playlist.status == "skipping" || playlist.status == "returning") {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não posso fazer isso quando estou trocando de música");

            return message.channel.send(richEmbed);

        }

        if(!args) {

            let currentUrl = playlist.queue[playlist.currentIndex].url;
            
            shuffle(playlist.queue);

            let item = playlist.queue.find(obj => {
                return obj.url === currentUrl;
            });

            playlist.currentIndex = playlist.queue.indexOf(item);

            let richEmbed = new RichEmbed()
                                    .setColor("#ADD8E6")
                                    .setTitle("Sua playlist foi embaralhada");
        
            return message.channel.send(richEmbed);

        }
        else {

            if(args.toLowerCase() == "end") {

                playlist.shuffle = !playlist.shuffle;

                if(playlist.loop) {

                    let richEmbed = new RichEmbed()
                                    .setColor("#ADD8E6")
                                    .setTitle("Modo de embaralhar ativado");
        
                    message.channel.send(richEmbed);
        
                }
                else {
        
                    let richEmbed = new RichEmbed()
                                    .setColor("#ADD8E6")
                                    .setTitle("Modo de embaralhar desativado");
        
                    message.channel.send(richEmbed);
        
                }

            }
            else {
            
                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("Valor inválido");
    
                return message.channel.send(richEmbed);
        
            }

        }
        
        save();

    }

}

module.exports = ShuffleCommand;