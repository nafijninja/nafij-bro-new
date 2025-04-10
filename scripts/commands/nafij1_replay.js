const fs = require("fs");
module.exports.config = {
  name: "test1",
  version: "2.0.0",
  permission: 0,
  credits: "NINJA NAFIJ",
  description: "replay auto",
  prefix: false,
  category: "user",
  usages: "",
  cooldowns: 0,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Prime")==0 || (event.body.indexOf("prime")==0 || (event.body.indexOf("Hi")==0 || (event.body.indexOf("hi")==0)))) {
		var msg = {
				body: "assalamulakum Im Active Now 😊"
    }
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}
