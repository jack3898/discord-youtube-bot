module.exports = {
	name: 'test',
	description: __.test(config.prefix),
	action: (bot, msg) => {
		msg.reply(':D');
	}
};
