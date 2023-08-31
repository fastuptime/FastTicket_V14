const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js"); 
const { t } = require("i18next"); // i18next
const moment = require("moment"); // moment
const supportSchema = require("../models/support.js"); // Support Model
const config = require("../config.js"); // Config
 module.exports = { 
   name: "support-message-send", 
   usage: "/support-message-send <channel>", 
   category: "Bot", 
 options: [ {
        name: `ticket_channel`,
        description: 'Where the Ticket System Will Go',
        type: 7,
        required: true,
        channel_types:[0]
      } ],
   description: "Support Modal Message Send", 
   run: async (client, interaction, config) => {
               let ticketchannel = interaction.options.getChannel("ticket_channel");
               ticketchannelsender = client.channels.cache.get(ticketchannel.id)
    if (interaction.guildId === null) {
            await interaction.reply({ content: `${t("error.dmerror", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err)); // If the channel is DM, return error.
            return;
    }

    if (!interaction.member.roles.cache.has(config.roles.supporter)) { 
            interaction.reply({ content: `${t("permission.missing_role", { 
            ns: "common",
            lng: interaction.locale,
            role: t("role.support_team", { ns: "permissions", lng: interaction.locale}) })}` }).catch((err) => console.log("Hata Oluştu; " + err));
            return;
    }
interaction.reply({ content: `${t("succes.ticket_message_send", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('ticket_creater')
					.setLabel(`${config.ticket.button_name}`)
					.setStyle(ButtonStyle.Primary),
			);

		const embed = new EmbedBuilder()
			.setColor(`${config.ticket.embed_color}}`)
			.setTitle(`${config.ticket.embed_title}`)
			.setDescription(`${config.ticket.embed_description}`)
            .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });

		await ticketchannelsender.send({ embeds: [embed], components: [row] });

    }
 }  