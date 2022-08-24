const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song 🎧')
        .addStringOption((option) =>
        option
            .setName('song')
            .setDescription('Song name or link.')
            .setRequired(true)
        ),
	async execute(interaction) {
		const { options, member, channel } = interaction;
		const client = interaction.client;
		const VoiceChannel = member.voice.channel;

		if (!VoiceChannel)
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			});

		try {
            client.distube.play(
                VoiceChannel,
                options.getString('song'),
                { textChannel: channel, member: member }
            );
            return interaction.reply({
                content: '🎶Request recieved.',
            });
		} catch (e) {
           interaction.reply('❌ Error: ' + e)
		}
	},
};