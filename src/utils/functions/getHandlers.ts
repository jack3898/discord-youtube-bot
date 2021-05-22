import config from '../../../config.js';
import Discord from 'discord.js';
import {URL} from 'url';
import fs from 'fs';
import ytdl from 'ytdl-core-discord';
import redisModule from 'redis';
import {youtube, youtube_v3} from '@googleapis/youtube';
import {promisify} from 'util';

const redis = redisModule.createClient(config.redis_port);

/**
 * THIS GET HANDLER FILE PROVIDES MULTIPLE INDEPENDENT UTILITY FUNCTIONS FOR RETRIEVING DATA.
 */

/**
 * Search a directory for a collection of files for a given purpose. Returns a list of filenames.
 */
export function getFileList(directory: string, fileType: string = '.js'): Array<string> {
	try {
		if (!directory) return [];
		return fs.readdirSync(`${config.src}/${directory}`).filter(file => file.endsWith(fileType));
	} catch (error) {
		console.log(error);
		return [];
	}
}

/**
 * Take a directory, and a list of file names and create a Discord Collection of modules. Useful for commands.
 */
export async function getModuleCollection(fileNames: Array<string>, directory: string): Promise<Discord.Collection<string, object>> {
	interface nodeModule {
		default: any;
	}

	if (fileNames.length) {
		const moduleList: Array<Promise<object>> = fileNames.map(filename => import(`${config.src}/${directory}/${filename}`));
		const resolvedModules = await Promise.all(moduleList);

		// If anyone else knows the proper return type of the callback, please add it here!
		const ready = resolvedModules.map((module: nodeModule): any => {
			const {name, action, description = ''} = module.default;
			if (name && action) return [name, {action, description}];
		});

		return new Discord.Collection(ready);
	}

	return new Discord.Collection();
}

/**
 * Get a percentage from a value. Will remove characters from strings and find the numbers.
 */
export function getPercentage(percentage: any): number | boolean {
	// Remove any characters that are not a number and convert it to an integer.
	const volumeInt = parseInt(percentage.replace(/[^0-9]+/g, ''));

	// Check if the conversion is successful
	if (volumeInt === NaN || volumeInt > 100 || volumeInt < 0) return false;

	return volumeInt || false;
}

/**
 * Get the contents of a YouTube playlist
 * @returns {Array} A simple list of video URLs from the playlist
 */
export async function getPlaylist(url: string, maxResults: number = config.youtube_playlist_max_results): Promise<Array<string>> {
	try {
		const yt = youtube({
			version: 'v3',
			auth: process.env.GOOGLE_API_TOKEN
		});

		// Extract the list parameter from the URL. This is the playlist id.
		const parsedUrl = new URL(url);
		const {list} = Object.fromEntries(parsedUrl.searchParams);

		if (!(parsedUrl.hostname === 'youtube.com' || parsedUrl.hostname === 'www.youtube.com') || !list) {
			console.log(parsedUrl.hostname, list);
			throw Error('Invalid url provided');
		}

		const params: youtube_v3.Params$Resource$Playlistitems$List = {
			part: ['snippet'],
			maxResults,
			playlistId: list
		};

		const response = await yt.playlistItems.list(params);
		const videos = response.data.items.map(({snippet}) => `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`);

		return videos;
	} catch (error) {
		throw Error(error);
	}
}

/**
 * Get the details of a video using ytdl-core-discord. This function adds a cache layer on top of ytdl-core-discord for speeeeed.
 * TODO: When Redis releases official promise support, remove promisify.
 * TODO: Implement RedisJSON. At the moment this does not use RedisJSON and running this function is heavier than it needs to be.
 */
export async function getVideoDetails(url: string): Promise<object | boolean> {
	try {
		// This function is only useful when a YouTube URL is provided so we check for that.
		if (!ytdl.validateURL(url)) throw Error('Invalid URL!');

		// Convert our Redis functions into promises.
		const [redisGet, redisSet, redisExpire] = [redis.get, redis.set, redis.expire].map(func => promisify(func).bind(redis));

		// Fetch data from Redis. May be empty if nothing is in the cache.
		const fromCache = await redisGet(`youtube:${url}`);

		// If the video details are already in the cache, no need to create an API call to YouTube!
		if (fromCache) {
			console.log('Found YouTube info in the cache. Using cache.');
			return JSON.parse(fromCache);
		}

		// It is now assumed that the if statement above did not work and as such the video details are not in the cache.
		console.log('YouTube video details not found in cache, fetching from the internet...');

		const videoDetails = await ytdl.getBasicInfo(url);

		await redisSet(`youtube:${url}`, JSON.stringify(videoDetails));
		await redisExpire(`youtube:${url}`, config.cache_expiry_in_seconds);

		console.log(`Video details added to cache. Set video details expiry (for url ${url}) to ${config.cache_expiry_in_seconds}s.`);

		return videoDetails;
	} catch (error) {
		console.error('There was a problem whilst attempting to fetch the video details. Log below.');
	}
}

/**
 * Attempt to find a YouTube video URL from any given string.
 */
export async function findYtUrl(search: string, resultCount: number = config.paginate_max_results): Promise<Array<string>> {
	try {
		const yt = youtube({
			version: 'v3',
			auth: process.env.GOOGLE_API_TOKEN
		});

		// How many results? By default, just use one. But if resultCount is truthy, use the value in the config.
		const maxResults = resultCount ? config.paginate_max_results : 1;

		const params: youtube_v3.Params$Resource$Search$List = {
			part: ['id'],
			maxResults,
			type: ['video'],
			q: search
		};

		const response = await yt.search.list(params);
		const urls = response.data.items.map(({id}) => `https://www.youtube.com/watch?v=${id.videoId}`);

		return urls;
	} catch (error) {
		throw Error(error);
	}
}
