import config from './../../../config.js';
import Discord from 'discord.js';
import {URL} from 'url';
import fs from 'fs';
import ytdl from 'ytdl-core-discord';
import redisModule from 'redis';
import {youtube} from '@googleapis/youtube';
import {promisify} from 'util';

const redis = redisModule.createClient(config.redis_port);

/**
 * THIS GET HANDLER FILE PROVIDES MULTIPLE INDEPENDENT UTILITY FUNCTIONS FOR RETRIEVING DATA.
 */

/**
 * Search a directory for a collection of files for a given purpose.
 * @param {string} directory Absolute directory
 * @param {string | Array.<string>} [fileTypes=['.js']] A (list of) filetype(s) that should be included in the search
 * @returns {Array.<string>} A list of files
 */
export function getFileList(directory, fileTypes = ['.js']) {
	try {
		if (!directory || typeof directory !== 'string') return [];
		const fileList = fs.readdirSync(`${config.src}/${directory}`).filter(file => file.endsWith(fileTypes));
		return fileList;
	} catch (error) {
		console.log(error);
		return [];
	}
}

/**
 * Take a directory, and a list of file names and create a Discord Collection of modules. Useful for commands.
 * @param {Array} filenames Including extension.
 * @param {string} directory Relative to source folder.
 * @returns {Promise<Discord.Collection>}
 */
export async function getModuleCollection(filenames, directory) {
	if (filenames.length) {
		const moduleList = filenames.map(filename => import(`${config.filePrefix}${config.src}/${directory}/${filename}`));
		const resolvedModules = await Promise.all(moduleList);
		const ready = resolvedModules.map(module => {
			const {name, action, description = ''} = module.default;
			if (name && action) return [name, {action, description}];
		});

		return new Discord.Collection(ready);
	}
}

/**
 * Get a percentage from a value. Will remove characters from strings and find the numbers.
 * @param {*} percentage
 * @returns {integer} value between 0 and 100
 */
export function getPercentage(percentage) {
	// Remove any characters that are not a number and convert it to an integer.
	const volumeInt = parseInt(percentage.replace(/[^0-9]+/g, ''));

	// Check if the conversion is successful
	if (volumeInt === NaN || volumeInt > 100 || volumeInt < 0) return false;

	return volumeInt || false;
}

/**
 * Get the contents of a YouTube playlist
 * @param {string} url The playlist URL
 * @param {integer} maxResults How many YouTube videos to fetch from the playlist
 * @returns {Array} A simple list of video URLs from the playlist
 */
export function getPlaylist(url, maxResults = config.youtube_playlist_max_results) {
	return new Promise(async (resolve, reject) => {
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
				reject('Invalid url provided');
				return;
			}

			const params = {
				part: 'snippet',
				maxResults,
				playlistId: list
			};

			await yt.playlistItems.list(params, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				// Transform the results into a list of video urls!
				const videos = data.data.items.map(({snippet}) => `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`);

				resolve(videos);
			});
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Get the details of a video using ytdl-core-discord. This function adds a cache layer on top of ytdl-core-discord for speeeeed.
 * TODO: When Redis releases official promise support, remove promisify.
 * TODO: Implement RedisJSON. At the moment this does not use RedisJSON and running this function is heavier than it needs to be.
 * @param {string} url
 * @returns {Promise<Object|Boolean>} Object for success, false for failed
 */
export async function getVideoDetails(url) {
	try {
		// This function is only useful when a YouTube URL is provided so we check for that.
		if (!ytdl.validateURL(url)) throw Error(false);

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
 * Attempt to find a YouTube video URL from any given string
 * @param {string} search
 * @param {Boolean} [resultCount=config.paginate_max_results] Return many results. If not set, the limit in the config will be used.
 * @returns {Array|Boolean} The URL(s) or if an error occurred, false
 */
export async function findYtUrl(search, resultCount = config.paginate_max_results) {
	return new Promise(async (resolve, reject) => {
		try {
			const yt = youtube({
				version: 'v3',
				auth: process.env.GOOGLE_API_TOKEN
			});

			// How many results? By default, just use one. But if resultCount is truthy, use the value in the config.
			const maxResults = Number.isNaN(parseInt(resultCount)) ? config.paginate_max_results : resultCount;

			const params = {
				part: 'id',
				maxResults,
				type: 'video',
				q: search
			};

			await yt.search.list(params, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				const urls = data.data.items.map(({id}) => `https://www.youtube.com/watch?v=${id.videoId}`);

				resolve(urls);
			});
		} catch (error) {
			reject(error);
		}
	});
}
