module.exports.config = {
	name: "cirfan",
	version: "1.0.4",
	permssion: 0,
	credits: "NAFIJ_PRO",
	description: "Tag irfan",
  prefix: false,
	category: "Group",
	usages: "[Text]",
	cooldowns: 10
};

module.exports.run = async function({ api, event, args }) {
	try {
		const botID = api.getCurrentUserID();
		const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
		var body = (args.length != 0) ? args.join(" ") : " @irfan🖤😗🚬", mentions = [], index = 0;
		
		for(const idUser of listUserID) {
			body = "‎" + body;
			mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
			index -= 1;
		}

		return api.sendMessage({ body, mentions }, event.threadID, event.messageID);

	}
	catch (e) { return console.log(e); }
}