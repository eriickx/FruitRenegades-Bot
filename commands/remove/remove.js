const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class RemoveCommand extends Command {

    constructor(client){

        super(client,{

            name : "remove",
            group : "remove",
            memberName : "remove",
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
                            .setTitle("Não escolheu música");

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

        if(playlist.queue.length == 0) {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("A fila está vazia");

            return message.channel.send(richEmbed);

        }

        if(index < 1 || index > playlist.queue.length)  {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não existe essa faixa de música");
            return message.channel.send(richEmbed);
        
        }

        if(index - 1 == playlist.currentIndex && playlist.status == "playing") {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Não posso remover a música que estou tocando");
            
            return message.channel.send(richEmbed);
        
        }

        if(index-1 < playlist.currentIndex)
        playlist.currentIndex--;

        let richEmbed = new RichEmbed()
                        .setColor("#ADD8E6")
                        .setTitle(playlist.queue[index-1].title)
                        .setURL(playlist.queue[index-1].url)
                        .setDescription("Foi removido da lista");

        playlist.queue.splice(index-1,1);

        message.channel.send(richEmbed);
        
        save();

    }

}

module.exports = RemoveCommand;