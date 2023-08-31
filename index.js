(async () => {
const { Client, GatewayIntentBits, Partials, Collection, Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js"); // Discord.js V14
const { default: mongoose } = require("mongoose"); // Mongoose
const config = require("./config.js"); // Config
const supportModel = require("./models/support.js"); // Support Model
const i18next = require("i18next"); // i18next
const { t } = require("i18next"); // i18next Translate
const translationBackend = require("i18next-fs-backend"); // i18next-fs-backend
const { readdirSync } = require("fs");
const moment = require("moment"); // Moment
const timezones = require("moment-timezone"); // Moment Timezone
const ticket_system_mongo = require("./models/support.js"); // Ticket System Model
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildBans
    ]
}); // Client 
require('./loader.js')(client); // Loader


client.login(config.token).then(() => {
    console.log(`Bot aktif! ${client.user.tag}`); // Giriş başarılıysa bot aktif olur.
}).catch(err => {
    console.log(`Giriş başarısız! ${err}`); // Giriş başarısızsa hata verir.
}); 

// Initialize multi language system 
i18next
     .use(translationBackend)
     .init({
      ns: readdirSync("./locales/en-US").map(a => a.replace(".json", "")),
      defaultNS: "commands",
      fallbackLng: "en-US",
      preload: readdirSync("./locales"),
      backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json"
      }
     }) // i18next

     //TİCKET SYSTEM
     
     client.on("interactionCreate", async (interaction) => {
     if (interaction.isButton()) {
        if (interaction.customId == "ticket_creater") {
            const modal = new ModalBuilder()
			.setCustomId(`ticket_modal`)
			.setTitle(`${config.modal.modal_title}`);

		const names = new TextInputBuilder()
        .setCustomId("ticket_username")
        .setLabel(`${t("modal.name_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
        .setMinLength(3)
        .setMaxLength(50)
        .setRequired(true)
        .setPlaceholder(`${t("modal.name_placeholder", { ns: "common", lng: interaction.locale })}`)
			.setStyle(TextInputStyle.Short);

		const lastnames = new TextInputBuilder()
        .setCustomId("ticket_lastname")
        .setLabel(`${t("modal.last_name_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
        .setMinLength(3)
        .setMaxLength(50)
        .setRequired(true)
        .setPlaceholder(`${t("modal.last_name_placeholder", { ns: "common", lng: interaction.locale })}`)
			.setStyle(TextInputStyle.Short);

            const emails = new TextInputBuilder()
            .setCustomId("ticket_email")
            .setLabel(`${t("modal.email_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
            .setMinLength(5)
            .setMaxLength(100)
            .setRequired(true)
            .setPlaceholder(`${t("modal.email_placeholder", { ns: "common", lng: interaction.locale })}`)
            .setStyle(TextInputStyle.Short);
            const subjects = new TextInputBuilder()
            .setCustomId("ticket_subject")
            .setLabel(`${t("modal.subject_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
            .setMinLength(5)
            .setMaxLength(100)
            .setRequired(true)
            .setPlaceholder(`${t("modal.subject_placeholder", { ns: "common", lng: interaction.locale })}`)
                .setStyle(TextInputStyle.Short);

                const reasons = new TextInputBuilder()
                .setCustomId("ticket_reason")
                .setLabel(`${t("modal.reason_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
                .setMinLength(24)
                .setMaxLength(2000)
                .setRequired(true)
                .setPlaceholder(`${t("modal.reason_placeholder", { ns: "common", lng: interaction.locale })}`)
                .setStyle(TextInputStyle.Paragraph);

                const user = await ticket_system_mongo.findOne({ userid: interaction.user.id });
                if(user) return interaction.reply({ content: `${t("error.modal_ticket_error", { ns: "common", lng: interaction.locale })}`, ephemeral: true })

		const name = new ActionRowBuilder().addComponents(names);
		const lastname = new ActionRowBuilder().addComponents(lastnames);
		const email = new ActionRowBuilder().addComponents(emails);
        const subject = new ActionRowBuilder().addComponents(subjects);
		const reason = new ActionRowBuilder().addComponents(reasons);
		// Add inputs to the modal
		modal.addComponents(name, lastname, email, subject, reason);
		// Show the modal to the user
		await interaction.showModal(modal);
        
        }
 }
 

 console.log(interaction.customId + ' test6')
 if (interaction.isButton()) {
   console.log(interaction.customId + ' test7')
   if (interaction.customId == "ticket_user_reply_button") {
       console.log('test')
       const modalreplyuser = new ModalBuilder()
       .setCustomId(`ticket_reply_modal_user`)
       .setTitle(`${t("modal.reply_title", { ns: "common", lng: interaction.locale })}`);
     
       const replysmodal = new TextInputBuilder()
       .setCustomId("ticket_reply_user")
       .setLabel(`${t("modal.reply_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
       .setMinLength(24)
       .setMaxLength(2000)
       .setRequired(true)
       .setPlaceholder(`${t("modal.reply_placeholder", { ns: "common", lng: interaction.locale })}`)
       .setStyle(TextInputStyle.Paragraph);

     
       const replyyy = new ActionRowBuilder().addComponents(replysmodal);
     // Add inputs to the modal
     modalreplyuser.addComponents(replyyy);
     // Show the modal to the user
     await interaction.showModal(modalreplyuser);

   }
}

if (interaction.isModalSubmit()) {
if (interaction.customId === "ticket_reply_modal_user") {
    const user = await ticket_system_mongo.findOne({ "userid": interaction.user.id });
    if(!user) return await interaction.reply({ content: `${t("error.ticket_not_found", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));
    await interaction.deferReply({});
    interaction.editReply({ content: `${t("succes.ticket_reply", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));
const ticket_user_reply = interaction.fields.getTextInputValue("ticket_reply_user");

const ticket_channel = client.channels.cache.get(config.ticket.ticket_log_channel);
      const ticket_del =  new EmbedBuilder() 
        .setColor(config.embed.info)
        .setTitle(`A Ticket Reply!`)
         .setDescription(`**Answered Ticket Subject:** ${user.subject}\n**User Message:** ${ticket_user_reply}`)
        .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });
    ticket_channel.send({ embeds: [ticket_del], content: `${user._id}` }).catch((err) => console.log("Hata Oluştu; " + err));  
  
    await ticket_system_mongo.findOneAndUpdate({ "userid": interaction.user.id }, { $push: { messages: { 
      userid: interaction.user.id, 
      message: ticket_user_reply, 
      type: "user",
      created_at: timezones().tz('Europe/Istanbul').locale('tr').format("YYYY-MM-DD HH:mm:ss") } } });    
      }

    }

//ADMIN OPTİONS

if (interaction.isCommand()) {
    const ObjectId = require('mongodb').ObjectId; 
    if (interaction.commandName == "ticket_admin") 

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
  const ticket_id = interaction.options.getString("id");
  const options_ticket = interaction.options.getString("options");

if(ticket_id.length <= 23) return await interaction.reply({ content: `${t("error.ticket_not_found", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));

const user = await ticket_system_mongo.findOne({ "_id": new ObjectId(`${ticket_id}`) });
if(!user) return await interaction.reply({ content: `${t("error.ticket_not_found", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));
if(options_ticket == "close_ticket") {
  const user = await ticket_system_mongo.findOne({ "_id": new ObjectId(`${ticket_id}`) });
  await interaction.reply({ content: `${t("succes.ticket_close", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));
  let user_detail = client.users.cache.get(user.userid);
  user_detail.send({ content: `${t("succes.user_ticket_deleted", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));  
  const ticket_channel = client.channels.cache.get(config.ticket.ticket_log_channel);
      const ticket_del =  new EmbedBuilder() 
        .setColor(config.embed.error)
        .setTitle(`A Ticket Deleted!`)
        .addFields(
         { name: `Admın:`, value: `${interaction.user.username}\`\`${interaction.user.id}\`\` `, inline: true },
         { name: `Deleted Ticket E-mail:`, value: `${user.email}`, inline: true },
         { name: `Deleted Ticket User:`, value: `${user_detail.username}\`\`${user.userid}\`\` `, inline: true }
         )
         .setDescription(`**Deleted Ticket Subject:** ${user.subject}`)
        .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });
    ticket_channel.send({ embeds: [ticket_del] }).catch((err) => console.log("Hata Oluştu; " + err));  

    await ticket_system_mongo.deleteOne({ "_id": new ObjectId(`${ticket_id}`) }); // Delete ticket from database.
}
if(options_ticket == "reply_ticket") {
  
  const user = await ticket_system_mongo.findOne({ "_id": new ObjectId(`${ticket_id}`) });
  const modalreply = new ModalBuilder()
  .setCustomId(`ticket_reply_modal`)
  .setTitle(`${t("modal.reply_title", { ns: "common", lng: interaction.locale })}`);

  const replysmodal = new TextInputBuilder()
  .setCustomId("ticket_reply")
  .setLabel(`${t("modal.reply_label", { ns: "common", lng: interaction.locale })}:`.substring(0, 45))
  .setMinLength(24)
  .setMaxLength(2000)
  .setRequired(true)
  .setPlaceholder(`${t("modal.reply_placeholder", { ns: "common", lng: interaction.locale })}`)
  .setStyle(TextInputStyle.Paragraph);

  const replysmodalid = new TextInputBuilder()
  .setCustomId("ticket_reply_id")
  .setLabel(`Ticket Id:`.substring(0, 45))
  .setMinLength(24)
  .setMaxLength(24)
  .setRequired(true)
  .setPlaceholder(`Ticket Id`)
  .setStyle(TextInputStyle.Short);

  const replyy = new ActionRowBuilder().addComponents(replysmodal);
  const iddd = new ActionRowBuilder().addComponents(replysmodalid);
// Add inputs to the modal
modalreply.addComponents(replyy, iddd);
// Show the modal to the user
await interaction.showModal(modalreply);
}
} //admin ticket system

console.log(interaction.customId + ' test1')
 if (!interaction.isModalSubmit()) return;
    console.log(interaction.customId + ' test2')
if (interaction.customId == "ticket_modal") {
    const ticket_username =
    interaction.fields.getTextInputValue("ticket_username");
  const ticket_lastname =
    interaction.fields.getTextInputValue("ticket_lastname");
    const ticket_email = interaction.fields.getTextInputValue("ticket_email");
    const ticket_subject = interaction.fields.getTextInputValue("ticket_subject");
    const ticket_reason = interaction.fields.getTextInputValue("ticket_reason");
    const user = await ticket_system_mongo.findOne({ userid: interaction.user.id });
    await new ticket_system_mongo({
        name: `${ticket_username}`,
        surname: `${ticket_lastname}`,
        email: `${ticket_email}`,
        subject: `${ticket_subject}`,
        userid: `${interaction.user.id}`,
        messages: [{
            userid: `${interaction.user.id}`,
            message: `${ticket_reason}`,
            type: `user`, //user, support or admin
            created_at: timezones().tz('Europe/Istanbul').locale('tr').format("YYYY-MM-DD HH:mm:ss")
        }],
      }).save();

      interaction.user.send({ content: `${t("modal.user_send_message", { ns: "common", lng: interaction.locale })}` })
const ticket_channel = client.channels.cache.get(config.ticket.ticket_log_channel);

await interaction.deferReply({ ephemeral: true });
const timeout = setTimeout(message, 3000);

async function message() {
    clearTimeout(timeout);
    const user = await ticket_system_mongo.findOne({ userid: interaction.user.id });
    interaction.editReply({ content: `${t("modal.user_send_message", { ns: "common", lng: interaction.locale })}`, ephemeral: true }).catch((err) => console.log("Hata Oluştu; " + err));  
          const ticket =  new EmbedBuilder() 
            .setColor(config.embed.success)
            .setTitle(`A Ticket Created!`)
            .addFields(
             { name: `User:`, value: `${interaction.user.username}\`\`${interaction.user.id}\`\` `, inline: true },
             { name: `Username:`, value: `${ticket_username}`, inline: true },
             { name: `Lastname:`, value: `${ticket_lastname}`, inline: true },
             { name: `Email:`, value: `${ticket_email}`, inline: true }
             )
             .setDescription(`**Subject:** ${ticket_subject}\n**Reason:** ${ticket_reason}`)
            .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });
        ticket_channel.send({ content: `${user._id}`, embeds: [ticket] }).catch((err) => console.log("Hata Oluştu; " + err));  
            }
} //Modal User
console.log(interaction.customId + ' test3')
if (!interaction.isModalSubmit()) return;
if (interaction.customId === "ticket_reply_modal") {
    await interaction.deferReply({});
    interaction.editReply({ content: `${t("succes.ticket_reply", { ns: "common", lng: interaction.locale })}` }).catch((err) => console.log("Hata Oluştu; " + err));
;const ticket_id = interaction.fields.getTextInputValue("ticket_reply_id");
    const ObjectId = require('mongodb').ObjectId;
            console.log("test")
const ticket_admın_reply = interaction.fields.getTextInputValue("ticket_reply");
const user = await ticket_system_mongo.findOne({ "_id": new ObjectId(`${ticket_id}`) });
let user_detail = client.users.cache.get(user.userid);
const ticket_channel = client.channels.cache.get(config.ticket.ticket_log_channel);
      const ticket_del =  new EmbedBuilder() 
        .setColor(config.embed.info)
        .setTitle(`A Ticket Answered!`)
        .addFields(
         { name: `Admın:`, value: `${interaction.user.username}\`\`${interaction.user.id}\`\` `, inline: true },
         { name: `Answered Ticket E-mail:`, value: `${user.email}`, inline: true },
         { name: `Answered Ticket User:`, value: `${user_detail.username}\`\`${user.userid}\`\` `, inline: true }
         )
         .setDescription(`**Answered Ticket Subject:** ${user.subject}\n**Admın Message:** ${ticket_admın_reply}`)
        .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });
    ticket_channel.send({ embeds: [ticket_del] }).catch((err) => console.log("Hata Oluştu; " + err));  
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_user_reply_button')
            .setLabel(`Reply`)
            .setStyle(ButtonStyle.Primary),
    );
       const ticket_user =  new EmbedBuilder() 
          .setColor(config.embed.warning)
          .setTitle(`A Ticket Answered!`)
          .addFields(
           { name: `Admın:`, value: `${interaction.user.username}\`\`${interaction.user.id}\`\` `, inline: true }
           )
           .setDescription(`**Admın Message:** ${ticket_admın_reply}`)
          .setFooter({ text: `${config.footer.text}`, iconURL: `${config.footer.icon}` });
          user_detail.send({ embeds: [ticket_user], components: [row] }).catch((err) => console.log("Hata Oluştu; " + err));  
  
    await ticket_system_mongo.findOneAndUpdate({ "_id": new ObjectId(`${ticket_id}`) }, { $push: { messages: { 
      userid: interaction.user.id, 
      message: ticket_admın_reply, 
      type: "admin",
      created_at: timezones().tz('Europe/Istanbul').locale('tr').format("YYYY-MM-DD HH:mm:ss") } } });    
      }



     });
     //TİCKET SYSTEM



})();


/* Powered by:
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  M o o n V o                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
------ Developed by Egehan#7658 ------
https://github.com/egehan0250
https://www.linkedin.com/in/egehan-konta%C5%9F-a91986250
https://stackoverflow.com/users/18989055/egehan
*/
