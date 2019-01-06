/*exports.run = (client, message, args) => {
    message.channel.send("Funcionou");
}*/
const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const urlRegex = require('url-regex');
//const { TesteCommand } = require("./teste.js");
/*
client.registry.registerGroups([

    ['teste', 'Teste']

]);
*/
//client.registry.registerCommandsIn(__dirname + '/comandos');
function info(url) {

    return new Promise(function(resolve, reject) {

        ytdl.getBasicInfo(url, (err, info) => {
            if (!info) resolve(null);

            let hours = Math.floor(info.length_seconds/3600);
            let minutes = Math.floor(info.length_seconds/60);
            let seconds = info.length_seconds - minutes*60;

            let timestamp = "";
            timestamp += hours > 0?(hours < 10?("0"+hours.toString()+":"):(hours.toString()+":")):"";
            timestamp += minutes < 10?("0"+minutes.toString()+":"):(minutes.toString()+":");
            timestamp += seconds < 10?("0"+seconds.toString()):seconds.toString();
            resolve({

                time : timestamp,
                author : info.author.name,
                title : info.title,
                image : info.thumbnail_url,
                url : url
            
            });

        });

    });   

}

function search (args) {

    return new Promise(function(resolve, reject) {
        // Do async job
        ytSearch(args, function ( err, r ) {
    
            if ( !r ) return message.channel.send("Nada encontrado");
 
            const videos = r.videos;
            //const playlists = r.playlists;
            //const accounts = r.accounts;
             
            const firstResult = videos[ 0 ];             
                                      
            resolve(firstResult);
            //servers[message.guild.id].queue.push("https://www.youtube.com".concat(firstResult.url));
            
            //play(message.guild.voiceConnection, message, servers[message.guild.id].queue[servers.currentIndex]);
            //"https://www.youtube.com".concat(firstResult.url);
            //console.log(url);
            
        });

    });

}
/*function play (connection, message, url){

    var server = servers[message.guild.id];
    //var isQueueEmpty = server.queue.length == 0;
    //if(server.currentIndex == server.queue.length)
    //    server.queue.push(url);
    
    if(!server.isPlaying) {

        server.isPlaying = true;
        server.dispatcher = connection.playStream(ytdl(url, {filter : "audioonly"}));
        server.dispatcher.on("end", function(){

            server.isPlaying = false;
            if(server.currentIndex + 1 < server.queue.length) {

                server.currentIndex++;    
                play(connection, message, server.queue[server.currentIndex]);

            }
            else{

                connection.disconnect();

            }

        });

    }

}
*/
class PlayCommand extends Command {

    constructor(client){

        super(client,{

            name : "play",
            group : "play",
            memberName : "play",
            description : ""

        });

    }

    async run (message, args){

        if(!message.guild.voiceConnection) {

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
    
        }
        
        if(!servers[message.guild.id]) {
        
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

        if(urlRegex({exact: true}).test(args)) {
    
            //servers[message.guild.id].queue.push(args);
            //message.channel.send("Acrescentado na lista");
            let currentPlaylist = servers[message.guild.id].currentPlaylist;
            
            let playlist = servers[message.guild.id].playlist.find(obj => {
                return obj.name === currentPlaylist;
            }); 

            let infoQueue = await info(args);

            if(!infoQueue) {
            
                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("A música não foi encontrada");
                return message.channel.send(richEmbed);
            
            }

            infoQueue.user = message.author.username;
            
            let item = playlist.queue.find(obj => {
                return obj.url === infoQueue.url;
            });

            if(item){

                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("Essa música já está na playlist");
                return message.channel.send(richEmbed);
               

            }
            
            playlist.queue.push(infoQueue);

            if(playlist.status == "playing"){

                let richEmbed = new RichEmbed()
                                .setColor("#ADD8E6")
                                .setTitle(playlist.queue[playlist.queue.length - 1].title)
                                .setURL(playlist.queue[playlist.queue.length - 1].url)
                                .setDescription("Adicionado à lista na posição de número "+playlist.queue.length);
               
                message.channel.send(richEmbed);

            }

            if(playlist.status == "stopped")
            playlist.currentIndex = playlist.queue.length-1;
                       
            let index = playlist.currentIndex;       

            play(message.guild.voiceConnection, message, playlist.queue[index].url);
                               
        }
        else {

            var video = await search(args);

            if(!video) {
            
                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("A música não foi encontrada");
                return message.channel.send(richEmbed);
            
            }
            
            //servers[message.guild.id].queue.push("https://www.youtube.com".concat(video.url));
            let currentPlaylist = servers[message.guild.id].currentPlaylist;
            let playlist = servers[message.guild.id].playlist.find(obj => {
                return obj.name === currentPlaylist;
            }); 

            let item = playlist.queue.find(obj => {
                return obj.url === "https://www.youtube.com".concat(video.url);
            });

            if(item){

                let richEmbed = new RichEmbed()
                                .setColor("#FFFF4C")
                                .setTitle("Essa música já está na playlist");
                return message.channel.send(richEmbed);
               

            }

            let infoQueue = await info("https://www.youtube.com".concat(video.url));
            infoQueue.user = message.author.username;
            playlist.queue.push(infoQueue);
            
            if(playlist.status == "playing"){

                let richEmbed = new RichEmbed()
                                .setColor("#ADD8E6")
                                .setTitle(playlist.queue[playlist.queue.length - 1].title)
                                .setURL(playlist.queue[playlist.queue.length - 1].url)
                                .setDescription("Adicionado à lista na posição de número "+playlist.queue.length);

                message.channel.send(richEmbed);
            
            }

            if(playlist.status == "stopped")
            playlist.currentIndex = playlist.queue.length-1;

            //message.channel.send("Acrescentado na lista");           
            let index = playlist.currentIndex;
            //play(message.guild.voiceConnection, message, servers[message.guild.id].queue[index].url);
            //info(servers[message.guild.id].queue[index]);
            play(message.guild.voiceConnection, message, playlist.queue[index].url);
               
            
            /*serach.then(function(result) {
                userDetails = result;
                console.log("Initialized user details");
                // Use user details from here
                console.log(userDetails)
                .message.channel.send("foi");
            });*/
            /*ytSearch(args, function ( err, r ) {
    
               if ( !r ) return message.channel.send("Nada encontrado");
    
               const videos = r.videos;
               //const playlists = r.playlists;
               //const accounts = r.accounts;
                
               const firstResult = videos[ 0 ];             
                                         
               console.log("Nada encontrado");
               //servers[message.guild.id].queue.push("https://www.youtube.com".concat(firstResult.url));
               
               //play(message.guild.voiceConnection, message, servers[message.guild.id].queue[servers.currentIndex]);
               //"https://www.youtube.com".concat(firstResult.url);
               //console.log(url);
               
            });*/

        }
        
    }

}

module.exports = PlayCommand;