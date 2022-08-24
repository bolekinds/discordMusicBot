require('dotenv').config();

const config = require(`./config.js`);

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  Formatters,
  EmbedBuilder,
  ActivityType,
} = require('discord.js');

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

function hexy(rrggbb) {
	var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
	return parseInt(bbggrr, 16);
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		// GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		// GatewayIntentBits.GuildIntergrations,
		// GatewayIntentBits.GuildWebhooks,
		// GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		// GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.distube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false,
	plugins: [
		new SpotifyPlugin({
			emitEventsAfterFetching: true,
		}),
		new SoundCloudPlugin(),
		new YtDlpPlugin(),
	],
});

client.config = config;

client.commands = new Collection();
client.cooldowns = new Collection();
client.slsCommands = new Collection();
['eventHandler', 'slsCmdHandler']
	.filter(Boolean)
	.forEach((h) => {
		require(`./handlers/${h}`)(client);
	});

module.exports = client;

const status = (queue) =>
	`Volume: \`${queue.volume}%\` | Filter: \`${
		queue.filters.names.join(', ') || 'Off'
	}\` | Loop: \`${
		queue.repeatMode
			? queue.repeatMode === 2
				? 'All Queue'
				: 'This Song'
			: 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
client.distube
	.on('playSong', (queue, song) => {
    const embedy = new EmbedBuilder()
      .setTitle(`${song.name}`)
    	.setColor(
									hexy(
										Math.floor(
											Math.random() * 16777215
										).toString(16)
									)
								)
      .setURL(song.url)
      .setDescription(`Duration: ${song.formattedDuration}, Requested by ${song.user}`)
      .setImage(song.thumbnail)
      .setTimestamp()
		queue.textChannel.send(
      {embeds: [embedy]}
		)}
	)
	.on('addSong', (queue, song) => {
    const embedy = new EmbedBuilder()
      .setTitle(`Added: ${song.name}`)
    	.setColor(
									hexy(
										Math.floor(
											Math.random() * 16777215
										).toString(16)
									)
								)
      .setURL(song.url)
      .setDescription(`Duration: ${song.formattedDuration}, Added by ${song.user}`)
      .setImage(song.thumbnail)
      .setTimestamp()
		queue.textChannel.send(
      {embeds: [embedy]}
		)}
	)
	.on('addList', (queue, playlist) => {
     const embedy = new EmbedBuilder()
      .setTitle(`Added playlist ${song.name} to queue (${playlist.songs.length})`)
    	.setColor(
									hexy(
										Math.floor(
											Math.random() * 16777215
										).toString(16)
									)
								)
      .setURL(song.url)
      .setTimestamp()
		queue.textChannel.send(
      {embeds: [embedy]}
		)}
	)
	.on('error', (channel, e) => {
		if (channel)
			channel.send(
				`An error encountered: ${e.toString().slice(0, 1974)}`
			);
		else console.error(e);
	})
	.on('searchNoResult', (message, query) =>
		message.channel.send(`No result found for \`${query}\`!`)
	);

try {
  client.login(config.token);
} catch(err) {
  console.log(err)
}