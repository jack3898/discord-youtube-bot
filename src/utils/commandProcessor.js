class commandProcessor {
	constructor(msg) {
		if (!msg instanceof Discord.Message) throw TypeError('Argument 1 is not of type Message!');

		this.text = msg.content;
		this.prefix = config.prefix;
		this.textArr = this.text.trim().substring(this.prefix.length).split(/\s+/);
	}

	get args() {
		const [cmd, ...args] = this.textArr;
		return args;
	}

	get cmd() {
		const [cmd] = this.textArr;
		return cmd;
	}

	arg(index) {
		if (!index) throw TypeError('No index supplied!');
		const [cmd, ...args] = this.textArr;
		return args[index];
	}
}

module.exports = commandProcessor;
