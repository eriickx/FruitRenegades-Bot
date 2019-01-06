const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class ListCommand extends Command {

    constructor(client){

        super(client,{

            name : "list",
            group : "list",
            memberName : "list",
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

        let indexPlaylist = servers[message.guild.id].playlist.indexOf(playlist);
        let items = 10;
        let page = Math.floor((indexPlaylist+1)/items);
        let totalPages = Math.ceil(servers[message.guild.id].playlist.length/items);

        if(args) {

            let argArr = args.split(" ");

            if(argArr[0].toLowerCase() == "all") {

                page = 0;
                totalPages = 1;
                items = servers[message.guild.id].playlist.length;

            }
            else {

                let pageNumber = parseInt(argArr[0]);

                if(!isNaN(pageNumber)){

                    page = pageNumber-1;

                    if(argArr[1]){

                        let itemsNumber = parseInt(argArr[1]);

                        if(!isNaN(itemsNumber)){

                            items = itemsNumber;
                            totalPages = Math.ceil(servers[message.guild.id].playlist.length/items);

                        }

                    }

                }

            }

        }

        let start = page*items;
        let limit = Math.min(page*items+items,servers[message.guild.id].playlist.length);

        if(start > limit) {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Página inexistente");
                            
            return message.channel.send(richEmbed);

        }

        let richEmbed = new RichEmbed()
                        .setColor("#98FB98")
                        .setTitle("Página " + (page+1) + " de " + totalPages);

        for(var i = start; i < limit;i++){

            let isCurrent = i == indexPlaylist;

            let content = "";
        
            content += isCurrent?"__*":"";
            content += +(i+1)+" - ";
            content += servers[message.guild.id].playlist[i].name == ""?"Variados":servers[message.guild.id].playlist[i].name;
            content += isCurrent?"*__":"";

            let infoPlaylist = "";
            infoPlaylist += isCurrent?"*":"";
            infoPlaylist += servers[message.guild.id].playlist[i].queue.length;
            infoPlaylist += " músicas";
            infoPlaylist += isCurrent?"*":"";
            
            richEmbed.addField(content, infoPlaylist);  

        }

        message.channel.send(richEmbed);

    }

}

module.exports = ListCommand;