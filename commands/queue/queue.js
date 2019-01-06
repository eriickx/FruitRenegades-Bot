const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class QueueCommand extends Command {

    constructor(client){

        super(client,{

            name : "queue",
            group : "queue",
            memberName : "queue",
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
                            .setTitle("Nenhuma playlist foi criada");

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

        let items = 10;
        let page = Math.floor((playlist.currentIndex+1)/items);
        let totalPages = Math.ceil(playlist.queue.length/items);

        if(args) {

            let argArr = args.split(" ");

            if(argArr[0].toLowerCase() == "all") {

                page = 0;
                totalPages = 1;
                items = playlist.queue.length;

            }
            else {

                let pageNumber = parseInt(argArr[0]);

                if(!isNaN(pageNumber)){

                    page = pageNumber-1;

                    if(argArr[1]){

                        let itemsNumber = parseInt(argArr[1]);

                        if(!isNaN(itemsNumber)){

                            items = itemsNumber;
                            totalPages = Math.ceil(playlist.queue.length/items);

                        }

                    }

                }

            }

        }

        let start = page*items;
        let limit = Math.min(page*items+items,playlist.queue.length);

        if(start > limit) {

            let richEmbed = new RichEmbed()
                            .setColor("#FFFF4C")
                            .setTitle("Página inexistente");
                            
            return message.channel.send(richEmbed);

        }

        // let richEmbed = new RichEmbed()
        //                 .setColor("#98FB98")
        //                 .setTitle("Página " + (page+1) + " de " + totalPages);

        let limitRichEmbed = Math.max(1, Math.ceil((limit-start)/25));

        for(var j = 0;j < limitRichEmbed; j++){

            let richEmbed = new RichEmbed()
                           .setColor("#98FB98")
                           .setTitle("Página " + (page+1) + " de " + totalPages);

            let currentStart = Math.max(start*(j+1), start+j*25);
            let currentLimit = Math.min(limit, currentStart+25);

            for(var i = currentStart; i < currentLimit;i++){

                let isCurrent = i == playlist.currentIndex;

                let content = "";
            
                content += isCurrent?"__*":"";
                content += +(i+1)+" - ";
                content += playlist.queue[i].title;
                content += isCurrent?"*__":"";

                let requestBy = "";
                requestBy += isCurrent?"*":"";
                requestBy += "Requisitado por ";
                requestBy += playlist.queue[i].user;
                requestBy += isCurrent?"*":"";
                
                richEmbed.addField(content, requestBy);  
                
                if(playlist.name != "")
                    richEmbed.setFooter("Playlist : ".concat(playlist.name));

            }

            message.channel.send(richEmbed);

        }

    }

}

module.exports = QueueCommand;