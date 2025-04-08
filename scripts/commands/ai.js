module.exports = {
  config: {
    name: "ai",
    version: "1.0.0",
    permission: 0,
    credits: "Nayan",
    description: "",
    prefix: true,
    category: "user",
    usages: "query",
    cooldowns: 5,
    dependencies: {
    }
  },

  start: async function({ nayan, events, args, Users, NAYAN }) {
    const axios = require("axios");
    const request = require("request");
    const fs = require("fs-extra");
    const id = nayan.getCurrentUserID()
    const uid = events.senderID;
    const nn = await Users.getNameUser(uid);
    const np = args.join(" ");


    try {
      const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
      const apiss = apis.data.api;
      const response = await axios.get(`${apiss}/nayan/gpt3?prompt=${encodeURIComponent(np)}`);
      const aiResponse = response.data.response || 'I am unable to process your request at the moment.';


        await NAYAN.sendContact(aiResponse, id, events.threadID);

    } catch (error) {
      console.error("Error while processing GPT request:", error);
    }
  }
};