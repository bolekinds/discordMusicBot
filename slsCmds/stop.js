const { SlashCommandBuilder } = require('@discordjs/builders');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('đ Stops the song.'),
	async execute(interaction) {
		const { member } = interaction;
		const VoiceChannel = member.voice.channel;

		if (!VoiceChannel) {
			return interaction.reply({
				content: 'đ Please join a voice channel.',
				ephemeral: true,
			})
		}

		try {
			const client = interaction.client
			const queue = await client.distube.getQueue(VoiceChannel);

			if (!queue) {
			return interaction.reply('â There is no queue.')}

			await queue.stop(VoiceChannel);
			return interaction.reply(
				'âšī¸ Music has been stopped.'
			);
		} catch (e) {
            if (e.toString() === "DisTubeError [NO_UP_NEXT]: There is no up next song") {
				const client = interaction.client;
					const VoiceChannel2 = member.voice.channel;
			
					if (!VoiceChannel2)
						return interaction.reply({
							content: 'join a voice channel please',
							ephemeral: true,
						});
				const queue = await client.distube.getQueue(VoiceChannel2);
				const row = new ActionRowBuilder()
						  .addComponents(
							  new ButtonBuilder()
								  .setCustomId('stopeverything')
								  .setLabel('Clear queue')
								  .setStyle(ButtonStyle.Danger),
						  );
				interaction.reply({ content: 'There is no next up song. Do you want to clear the queue instead and stop everything?', components: [row] });
			  const filter = i => i.customId === 'stopeverything' && i.user.id === interaction.member.id;
			  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
		
			  collector.on('collect', async i => {
					  if (i.customId === 'stopeverything') {
					if (!queue)
								return i.reply('â There is no queue.');
		
					await queue.stop(VoiceChannel);
						await i.reply({ content: 'Cleared queue.', components: [] });
					}
			  });
			} else {
			  interaction.reply('â Error: ' + e)
			}
		}
	},
};