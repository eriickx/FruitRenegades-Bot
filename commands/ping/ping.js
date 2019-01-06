const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

class PingCommand extends Command {

    constructor(client){

        super(client,{

            name : "ping",
            group : "ping",
            memberName : "ping",
            description : ""

        });

    }

    async run (message, args){
        
        ping(message);
            
    }

}

module.exports = PingCommand;