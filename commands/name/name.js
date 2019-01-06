const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class NameCommand extends Command {

    constructor(client){

        super(client,{

            name : "name",
            group : "name",
            memberName : "name",
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
        
        if(!args) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Você não escolheu o nome de sua playlist");

            return message.channel.send(richEmbed);
        
        }

        if(args == "") {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Nome inválido");

            return message.channel.send(richEmbed);
        
        }

        if(!isNaN(args)) {
            
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Nome precisa ser um texto");

            return message.channel.send(richEmbed);
        
        }

        if(!servers[message.guild.id]) {
        
            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Nenhuma playlist foi criada");

            return message.channel.send(richEmbed);

        }
        else {

            let newPlaylist = servers[message.guild.id].playlist.find(obj => {
                return obj.name === args;
            });

            if(newPlaylist) {

                let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Já existe uma playlist com esse nome");

                return message.channel.send(richEmbed);

            }

            let currentPlaylist = servers[message.guild.id].currentPlaylist;
            let playlist = servers[message.guild.id].playlist.find(obj => {
                return obj.name === currentPlaylist;
            });
            
            if(playlist.name == "") {

                let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Essa playlist não pode ser alterada");

                return message.channel.send(richEmbed);

            } 

            playlist.name = args;
            servers[message.guild.id].currentPlaylist = args;
            
        }
          
        let richEmbed = new RichEmbed()
                            .setColor("#885EAD")
                            .setTitle("O nome da sua playlist foi alterado com sucesso");

        message.channel.send(richEmbed);
        
        save();
    
    }

}

module.exports = NameCommand;