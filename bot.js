const { Client } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const { TOKEN, PREFIX } = require("./config.js");
const ytdl = require("ytdl-core");
const client = new Client({ commandPrefix:PREFIX, disableEveryone : true });
const fs = require("fs");

client.registry.registerGroups([

    ['help', 'Help'],
    ['play', 'Play'],
    ['skip', 'Skip'],
    ['back', 'Back'],
    ['join', 'Join'],
    ['leave', 'Leave'],
    ['jump', 'Jump'],
    ['loop', 'Loop'],
    ['shuffle', 'Shuffle'],    
    ['queue', 'Queue'],    
    ['remove', 'Remove'],    
    ['pause', 'Pause'],    
    ['resume', 'Resume'],    
    ['playlist', 'Playlist'],    
    ['change', 'Change'],   
    ['list', 'List'],   
    ['vtc', 'Vtc'],   
    ['name', 'Name'],
    ['ping', 'Ping']

]);

client.registry.registerCommandsIn(__dirname + '/commands');

global.servers = require("./servers.json");

global.ping = function(message) {
        
    let richEmbed = new RichEmbed()
    .setColor("#FFFF4C")
    .setTitle(`${client.ping}`);

    return message.channel.send(richEmbed); 

}

global.play = function(connection, message, url){
       
    save();

    var server = servers[message.guild.id];
    var currentPlaylist = servers[message.guild.id].currentPlaylist;
    var playlist = server.playlist.find(obj => {
        return obj.name === currentPlaylist;
    });

    if(playlist.status != "playing") {

        playlist.status = "playing";
        let info = playlist.queue[playlist.currentIndex];
        let richEmbed = new RichEmbed()
                        .setColor("#ADD8E6")
                        .setAuthor(info.author, null)
                        .setTitle(info.title)
                        .setURL(info.url)
                        .setThumbnail(info.image)
                        .addField("Duração", info.time, true)
                        .addField("Requesitado por", info.user, true);

        if(playlist.dispatcher)
            playlist.dispatcher.end();

        playlist.dispatcher = connection.playStream(ytdl(url));
       
        playlist.dispatcher.on("start", function(){

            message.channel.send(richEmbed);
        
        });

        playlist.dispatcher.on("end", function(){

            if(playlist.status == "playing") {

                playlist.status = "skipping";
                playlist.currentIndex++; 

                if(playlist.currentIndex < playlist.queue.length) {
   
                    play(connection, message, playlist.queue[playlist.currentIndex].url);

                }
                else if (playlist.shuffle && playlist.loop) {
                    
                    shuffle(playlist.queue);
                    playlist.currentIndex = 0;    
                    play(connection, message, playlist.queue[playlist.currentIndex].url);

                }
                else if (playlist.shuffle){

                    shuffle(playlist.queue);

                }
                else if (playlist.loop){

                    playlist.currentIndex = 0;    
                    play(connection, message, playlist.queue[playlist.currentIndex].url);

                }
                else{

                    playlist.status = "stopped";
                    connection.disconnect();

                }

                save();

            }
            
        });
        
        save();

    }

}

global.shuffle = function(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;
    
    while (0 !== currentIndex) {
    
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;     

}

global.save = function(){
    /*
    fs.writeFile("./servers.json", JSON.stringify(servers, null, 4) , err => {

        if(err) throw err;

    });*/
    
    fs.writeFile("./servers.json", "" , err => {  if(err) throw err;  
    
        var stream = fs.createWriteStream("./servers.json");

        stream.once('open', function(fd) {

            //writeFile(stream, servers);
            stream.write(convertToString(servers));
            //stream.write("My second row\n");
            stream.end();
        
        });
    
    });   
    
}
/*
global.writeFile = function(stream, object) {

    stream.write("{");

    var keys = Object.keys(object);
    
    for(var i = 0;i < keys.length;i++){
        
        var property = keys[i];

        if(i > 0)
            stream.write(",");
        stream.write("\n\t\""+ property.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
        stream.write(":");

        stream.write("{");

        stream.write("\n\t\t\"currentPlaylist\":");
        stream.write("\""+ servers[property].currentPlaylist.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
        stream.write(",");
        stream.write("\n\t\t\"playlist\":[");

        for(var j = 0;j < servers[property].playlist.length;j++){
            
            if(j > 0)
                stream.write(",");

            stream.write("\n\t\t\t{");

            stream.write("\n\t\t\t\t\"name\":");
            stream.write("\""+ servers[property].playlist[j].name.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
            stream.write(",");
            stream.write("\n\t\t\t\t\"queue\":[");

            for(var k = 0;k<servers[property].playlist[j].queue.length;k++) {
                
                if(k > 0)
                    stream.write(",");

                stream.write("\n\t\t\t\t\t{");

                stream.write("\n\t\t\t\t\t\t\"time\":");
                stream.write("\""+ servers[property].playlist[j].queue[k].time.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
                stream.write(",");      
                stream.write("\n\t\t\t\t\t\t\"author\":");
                stream.write("\""+ servers[property].playlist[j].queue[k].author.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
                stream.write(",");      
                stream.write("\n\t\t\t\t\t\t\"title\":");
                stream.write("\""+ servers[property].playlist[j].queue[k].title.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
                stream.write(","); 
                stream.write("\n\t\t\t\t\t\t\"image\":");
                stream.write("\""+ servers[property].playlist[j].queue[k].image.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
                stream.write(",");      
                stream.write("\n\t\t\t\t\t\t\"url\":");
                stream.write("\""+ servers[property].playlist[j].queue[k].url.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
                stream.write(",");      
                stream.write("\n\t\t\t\t\t\t\"user\":");
                stream.write("\""+ servers[property].playlist[j].queue[k].user.replace(new RegExp("\"", 'g'), "\\\"") +"\"");
                
                stream.write("\n\t\t\t\t\t}");

            }

            stream.write("\n\t\t\t\t]");
            stream.write(",");            
            stream.write("\n\t\t\t\t\"status\":");
            stream.write("\""+ servers[property].playlist[j].status +"\"");
            stream.write(",");      
            stream.write("\n\t\t\t\t\"currentIndex\":");
            stream.write(servers[property].playlist[j].currentIndex);
            stream.write(",");      
            stream.write("\n\t\t\t\t\"loop\":");
            stream.write(servers[property].playlist[j].loop);
            stream.write(",");      
            stream.write("\n\t\t\t\t\"shuffle\":");
            stream.write(servers[property].playlist[j].shuffle);
            
            stream.write("\n\t\t\t}");            

        }

        stream.write("\n\t\t]");
        stream.write("\n\t}");

    }
    
    stream.write("\n}");

}
*/
global.convertToString = function(object){

    var content = "";    
    content += "{";

    var keys = Object.keys(object);

    for(var i = 0;i < keys.length;i++){
        
        var property = keys[i];

        if(i > 0)
            content += ",";
        content += "\n\t\""+ property.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
        content += ":";

        content += "{";

        content += "\n\t\t\"currentPlaylist\":";
        content += "\""+ servers[property].currentPlaylist.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
        content += ",";
        content += "\n\t\t\"playlist\":[";

        for(var j = 0;j < servers[property].playlist.length;j++){
            
            if(j > 0)
                content += ",";

            content += "\n\t\t\t{";

            content += "\n\t\t\t\t\"name\":";
            content += "\""+ servers[property].playlist[j].name.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
            content += ",";
            content += "\n\t\t\t\t\"queue\":[";

            for(var k = 0;k<servers[property].playlist[j].queue.length;k++) {
                
                if(k > 0)
                    content += ",";

                content += "\n\t\t\t\t\t{";

                content += "\n\t\t\t\t\t\t\"time\":";
                content += "\""+ servers[property].playlist[j].queue[k].time.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
                content += ",";      
                content += "\n\t\t\t\t\t\t\"author\":";
                content += "\""+ servers[property].playlist[j].queue[k].author.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
                content += ",";      
                content += "\n\t\t\t\t\t\t\"title\":";
                content += "\""+ servers[property].playlist[j].queue[k].title.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
                content += ","; 
                content += "\n\t\t\t\t\t\t\"image\":";
                content += "\""+ servers[property].playlist[j].queue[k].image.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
                content += ",";      
                content += "\n\t\t\t\t\t\t\"url\":";
                content += "\""+ servers[property].playlist[j].queue[k].url.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
                content += ",";      
                content += "\n\t\t\t\t\t\t\"user\":";
                content += "\""+ servers[property].playlist[j].queue[k].user.replace(new RegExp("\"", 'g'), "\\\"") +"\"";
                
                content += "\n\t\t\t\t\t}";

            }

            content += "\n\t\t\t\t]";
            content += ",";            
            content += "\n\t\t\t\t\"status\":";
            content += "\""+ servers[property].playlist[j].status +"\"";
            content += ",";      
            content += "\n\t\t\t\t\"currentIndex\":";
            content += servers[property].playlist[j].currentIndex;
            content += ",";      
            content += "\n\t\t\t\t\"loop\":";
            content += servers[property].playlist[j].loop;
            content += ",";      
            content += "\n\t\t\t\t\"shuffle\":";
            content += servers[property].playlist[j].shuffle;
            
            content += "\n\t\t\t}";            

        }

        content += "\n\t\t]";
        content += "\n\t}";

    }
    
    content += "\n}";

    return content; 

}

client.on("ready", () => {

    var keys = Object.keys(servers);

    for(var i = 0;i < keys.length;i++){

        let key = keys[i];
        let currentPlaylist = servers[key].currentPlaylist;
        let playlist = servers[key].playlist.find(obj => {
            return obj.name === currentPlaylist;
        }); 

        playlist.status = "stopped";

    }

    console.log("Estou pronto!");

});

client.login(TOKEN);