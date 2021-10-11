import path from 'path';

export default {
	src: path.resolve() + '/src',
	filePrefix: process.platform === 'win32' ? 'file://' : '',
	prefix: '!',
	language: 'en',
	redis_host: 'redis',
	redis_port: 6379,
	redis_namespace: 'ytbot',
	redis_flush_on_start: false,
	paginate_max_results: 10,
	youtube_playlist_max_results: 50,
	default_volume_percent: 70,
	success_colour: '#3bf776',
	warning_colour: '#f7f43b',
	fail_colour: '#f75a3b',
	cache_expiry_in_seconds: 86400,
	search_reaction_options: ['\u0031\u20E3', '\u0032\u20E3', '\u0033\u20E3', '\u0034\u20E3', '\u0035\u20E3'],
	search_expiry_milliseconds: 600000
};
