const fs = require("fs");
module.exports.config = {
  name: "test",
  version: "2.0.0",
  permission: 0,
  credits: "nayan-vaiya",
  description: "replay auto",
  prefix: false,
  category: "user",
  usages: "",
  cooldowns: 0,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("nafij")==0 || (event.body.indexOf("Nafij")==0 || (event.body.indexOf("NAFIJ")==0 || (event.body.indexOf("নাফিজ")==0)))) {
		var msg = {
				body: "Yes Bro Im Here🌚"
    }
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}
