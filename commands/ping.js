const { EmbedBuilder } = require("discord.js"); 
const { t } = require("i18next"); // i18next
 module.exports = { 
   name: "ping", 
   usage: "/ping", 
   category: "Bot", 
   description: "Ping komutu", 
   run: async (client, interaction, config) => {
      
     const embed =  new EmbedBuilder() 
       .setColor(0x0099FF)
       .setTitle(`Pong!`)
       .addFields(
        { name: `${t("ping.discord_latency", { lng: interaction.locale })}:`, value: `${client.ws.ping}ms`, inline: true },
        { name: `${t("ping.bot_latency", { lng: interaction.locale })}:`, value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }
        )
       .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });
        interaction.reply({ embeds: [embed] }).catch((err) => console.log("Hata Oluştu; " + err));  
   
} 
 } 