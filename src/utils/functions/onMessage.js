const CommandProcessor = require('./../classes/CommandProcessor');

function onMessage(bot, msg) {
	if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;
	const command = new CommandProcessor(msg);
	if (bot.commands.has(command.cmd)) bot.commands.get(command.cmd).action(bot, msg, command);
}

module.exports = onMessage;
