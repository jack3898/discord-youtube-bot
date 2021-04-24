const command = {
	name: 'test',
	action: (bot, msg, command) => {
		msg.reply('I work!');
	}
};

module.exports = command;
