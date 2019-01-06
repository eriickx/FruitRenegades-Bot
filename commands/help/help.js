/*exports.run = (client, message, args) => {
    message.channel.send("Funcionou");
}*/

const { Command } = require("discord.js-commando");

class HelpCommand extends Command {

    constructor(client){

        super(client,{

            name : "help",
            group : "help",
            memberName : "help",
            description : "List of avaliable commands!"

        });

    }

    async run (message, {test}){

        message.reply(test);

    }

}

module.exports = HelpCommand;