module.exports = {
    token: "TOKEN", //Bot Token
    mongodb: "MONGO URL", //MongoDB URL
    ready: ["by MoonVo","by Egehan","ticket bot system."], //Bot Ready Messages
    ready_event_loop_time: 300000, //Bot Ready Event Loop Time
    embed: {
        error: "FF0000", //Embed Error Color
        success: "00FF00", //Embed Success Color
        info: "0000ff", //Embed Info Color
        warning: "ffff00" //Embed Warning Color
    },
    footer: { 
        text: "2022-2023 MoonVo All Rights Reserved.", //Footer Text
        icon: "https://www.technopat.net/sosyal/data/avatars/o/472/472796.jpg?1648288120" //Footer Icon
    },
    roles: {
        supporter: "1069586139272458334",
    },
    ticket: {
        embed_title: "Ticket System",
        embed_description: "Click to Create Ticket",
        embed_color: "BLUE",
        button_name: "Create Ticket!",
        ticket_log_channel: "1070210372746883153"
    },
    modal: {
       modal_title: "Ticket System",
    }
}
