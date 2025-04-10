const fs = require("fs");

module.exports = {
  config: {
    name: "pro",
    version: "1.0.0",
    permission: 0,
    credits: "nayan",
    description: "Respond with a random answer from the database",
    prefix: "false",
    category: "talk",
    usages: "hi",
    cooldowns: 5,
  },

  handleReply: async function ({ api, event }) {
    try {
      const dataFilePath = "./data.json";

      // Ensure the data file exists
      if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
      }

      const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

      const userInput = event.body.trim().toLowerCase(); // Get the input from the user

      // Find the relevant entry for the 'ask'
      const entry = data.find((item) => item.ask.toLowerCase() === userInput);

      if (!entry) {
        return api.sendMessage(
          "Sorry, I don't have a reply for that.",
          event.threadID,
          event.messageID,
        );
      }

      // If multiple answers exist, pick a random one
      const randomIndex = Math.floor(Math.random() * entry.ans.length);
      const randomAnswer = entry.ans[randomIndex];

      // Send the random answer and allow unlimited replies
      api.sendMessage(
        randomAnswer,
        event.threadID,
        (error, info) => {
          if (error) {
            return api.sendMessage(
              "An error occurred while processing your request. Please try again later.",
              event.threadID,
              event.messageID,
            );
          }

          // Push the new reply to allow further replies
          global.client.handleReply.push({
            type: "reply",
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
          });
        },
        event.messageID,
      );
    } catch (error) {
      console.error("Error in handleReply:", error);
      api.sendMessage(
        "An error occurred while processing your request. Please try again later.",
        event.threadID,
        event.messageID,
      );
    }
  },

  start: async function ({ nayan, events, args, Users }) {
    try {
      const msg = args.join(" ").trim();
      const dataFilePath = "./data.json";

      // Ensure the data file exists
      if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
      }

      const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

      if (!msg) {
        var tl = ["Hum Baby Bolo🐱"];
        var name = await Users.getNameUser(events.senderID);
        var rand = tl[Math.floor(Math.random() * tl.length)];
        return nayan.sendMessage(
          {
            body: `${name}, ${rand}`,
            mentions: [{ tag: name, id: events.senderID }],
          },
          events.threadID,
          (error, info) => {
            if (error) {
              return nayan.sendMessage(
                "An error occurred while processing your request. Please try again later.",
                events.threadID,
                events.messageID,
              );
            }

            // Push initial message to allow replies
            global.client.handleReply.push({
              type: "reply",
              name: this.config.name,
              messageID: info.messageID,
              author: events.senderID,
            });
          },
          events.messageID,
        );
      }

      const userInput = msg.toLowerCase();
      const entry = data.find((item) => item.ask.toLowerCase() === userInput);

      if (!entry) {
        return nayan.sendMessage(
          "Sorry, I don't have a reply for that.",
          events.threadID,
        );
      }

      // If multiple answers exist, pick a random one
      const randomIndex = Math.floor(Math.random() * entry.ans.length);
      const randomAnswer = entry.ans[randomIndex];

      nayan.sendMessage(
        randomAnswer,
        events.threadID,
        (error, info) => {
          if (error) {
            return nayan.sendMessage(
              "An error occurred while processing your request. Please try again later.",
              events.threadID,
              events.messageID,
            );
          }

          // Push the initial reply to allow further conversation
          global.client.handleReply.push({
            type: "reply",
            name: this.config.name,
            messageID: info.messageID,
            author: events.senderID,
          });
        },
        events.messageID,
      );
    } catch (error) {
      console.log(error);
      nayan.sendMessage(
        "An error has occurred, please try again later.",
        events.threadID,
        events.messageID,
      );
    }
  },
};
