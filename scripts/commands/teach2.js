const fs = require("fs");

module.exports.config = { 
  name: "teach2",
  version: "1.1.0",
  permission: 0,
  prefix: '/',
  credits: "NAFIJ PRO",
  description: "Teach or delete bot responses dynamically, single reply per ask",
  category: "admin",
  usages: "/teach hi = hello | /teach delete hi",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const dataFilePath = './data.json';

    // Ensure the data file exists
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
    }

    const input = args.join(" ").trim();

    if (!input) {
        return api.sendMessage(
            "Please use the correct format:\n1️⃣ To Add: /teach <ask> = <answer>\n2️⃣ To Delete: /teach delete <ask>", 
            event.threadID
        );
    }

    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

    // Check if the input is a delete command
    if (input.startsWith("delete")) {
        const askToDelete = input.replace("delete", "").trim();

        if (!askToDelete) {
            return api.sendMessage("Please specify a phrase to delete. Example: /teach delete hi", event.threadID);
        }

        const index = data.findIndex(item => item.ask === askToDelete);

        if (index === -1) {
            return api.sendMessage(`No data found for "${askToDelete}" to delete.`, event.threadID);
        }

        // Remove the entry
        data.splice(index, 1);
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

        return api.sendMessage(`✅ Successfully deleted the phrase: "${askToDelete}"`, event.threadID);
    } 

    // If input contains '=' → Add or Update an ask-answer pair
    if (input.includes("=")) {
        const [ask, ans] = input.split("=").map(item => item.trim());

        if (!ask || !ans) {
            return api.sendMessage("Both 'ask' and 'answer' must be provided! Example: /teach hi = hello", event.threadID);
        }

        const existingEntry = data.find(item => item.ask === ask);

        if (existingEntry) {
            // If the ask already exists, check if answer is already there and push it to the array
            if (!existingEntry.ans.includes(ans)) {
                existingEntry.ans.push(ans);
                fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                return api.sendMessage(
                    `✅ Updated the reply for "${ask}": ${ans}`, 
                    event.threadID
                );
            } else {
                return api.sendMessage(`The answer "${ans}" already exists for "${ask}".`, event.threadID);
            }
        } else {
            // Create a new entry for the ask
            data.push({ ask, ans: [ans] });
            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
            return api.sendMessage(
                `✅ Successfully added:\n1️⃣ ASK: ${ask}\n2️⃣ REPLY: ${ans}`, 
                event.threadID
            );
        }
    }

    return api.sendMessage("Invalid format. Use /teach <ask> = <answer> or /teach delete <ask>", event.threadID);
};
