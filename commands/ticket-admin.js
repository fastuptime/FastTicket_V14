const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js"); 
const { t } = require("i18next"); // i18next
const moment = require("moment"); // moment
const supportSchema = require("../models/support.js"); // Support Model
const config = require("../config.js"); // Config
 module.exports = { 
   name: "ticket_admin", 
   usage: "/ticket_admin <options>", 
 options: [
    {          
        name: `id`,
        description: 'Enter ticket id for options',
        type: 3,
        required: true,

  },
    {
      name: "options",
      description: "Choose What You Want to Do",
      choices: [
        {
            "name": "Reply ticket",
            "value": "reply_ticket"
        },
        {
            "name": "Close ticket",
            "value": "close_ticket"
        },
    ], 
      type: 3, 
      required: true
  }
           ],
   category: "Bot", 
   description: "Support Modal Message Send", 
   run: async (client, interaction, config) => {

//index.js TICKET ADMIN

}
 }