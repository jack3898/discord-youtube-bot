# Discord YouTube Bot (beta)
Omg another YouTube Bot for the Discord Bot ecosystem! do we really need another one?

Ah, but I enjoy making Discord bots and sharing my code. So, here it is.

A lot of music bots are private and proprietary (and lock features behind a paywall), and whilst I am sure there are other open source music bots I aim to make this one the best.

## Features
| Command               | What it does                                                 |
| --------------------- | ------------------------------------------------------------ |
| !add <URL or search>  | Add a YouTube video to the queue with a URL or search query. |
| !clear                | Clear the queue. Poof! Gone.                                 |
| !geturl <search>      | Use a search query to get a video URL.                       |
| !help <page>          | Get a list of commands! Like this table.                     |
| !pause <minutes>      | Pause the bot. You may optionally specify how many minutes in the future it will auto-resume. |
| !play <URL or search> | The bot will insta-join your voice channel and play the tune you specified so long as the queue is empty (otherwise it will add to the queue and resume the queue). |
| !playlist <URL>       | You may import a playlist with a URL and the bot will convert it and append it to the queue. |
| !pop                  | Remove the newest item from the queue.                       |
| !queue <page>         | Get the queue, if your queue is long specify the page.       |
| !queuelength          | The bot will tell you how many items there are in the queue. |
| !remove               | Remove an item from the queue with the queue item number.    |
| !resume               | Resume the audio if the bot is paused.                       |
| !search               | Search for a video. You will be presented with a list by which you may choose which one to add to the queue using Discord's reaction system. You may also ignore the results and never add anything to the queue. |
| !skip                 | Does what it says on the tin!                                |
| !stop                 | Stop the bot from playing the audio and make it leave the channel. Will not tamper with the queue. |
| !test                 | See if the bot works!                                        |
| !utltoinfo <URL>      | Paste a YouTube video URL and get the video details. I know this isn't all that useful! |
| !volume <percentage>  | Alter the playback volume of the bot. Any integer between 0 and 100 will work! It also retains the volume permanently. |



## Technologies
This bot is proudly powered with Node.js & Redis!

Discord.js is the library that powers the communication to Discord's bot API. Those guys made it super easy for me to make this bot!


## Setup
1. You will need Node.js 14 for this bot to fully work. Currently the major releases after that have a bug where the bot will not resume playback after being paused. You may choose to run the latest stable version, as that is the only small compromise you will have to make.

2. You will need two API tokens in your system's environment variables:
   1. `DISCORD_TOKEN` - Which you can find at https://discord.com/developers
   2. `GOOGLE_API_TOKEN` - Which you can create in the Google Cloud platform.
      1. You need to enable `YouTube Data API v3` on Google Cloud platform.

3. Start Redis as a service `sudo service redis-server start`.
   1. Alternatively, run can run Redis on a Docker Compose on background with `docker-compose up --detach`.
4. At the root of the project folder, type `npm run bot`.

## Plans

I have some ambitious plans for this bot!

Before I start, take what I say in this section with a pinch of salt. These features may not happen.

1. I would like to add support for "sharding". I want to add this so that if someone really wants to take this bot and spread the load across a dozen servers, they can. This will take a lot of work to implement and I am not yet sure how this will work with Redis. This is essential if you want the bot to be a part of over 2500 servers.
2. Create a web-app interface for admins to manage the bot. This will allow an admin to see all queues of all servers, see how many sharded servers are online, manage permissions, blacklist users globally from using the bot, analytics, etc. Again, this is a massive task but something I may want to try!
3. If the bot has much interest from others, I may host the bot myself as an optional route for people to take if they do not have the technical knowhow to set it up themselves.
4. And just to continue extending and adding features to the bot. This is the #1 priority at the moment. The other three may only happen if this bot picks up pace and I maybe get sponsored. Because I am only a lone coder!

## License

Copyright (C) 2021 Jack Wright

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
