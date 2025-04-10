const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "jokes",
  version: "1.1.4",
  hasPermission: 0,
  credits: "NAFIJ_PRO",
  description: "Tells random jokes and allows users to add, delete their own jokes.",
  prefix: false,
  category: "user",
  usages: "joke, addjoke, deletejoke",
  cooldowns: 5,
};

// Define the file path for jokes to be saved in the required location
const jokesDir = path.resolve(__dirname, "../../scripts/commands/NAFIJ/jokes"); // Going 2 steps up from current location
const jokesFilePath = path.join(jokesDir, "jokesbynafij.json");

// Special users who have the permission to delete jokes (add user IDs here)
const specialUsers = ["100058371606434", "100058371606434"]; // Replace with actual user IDs

// Initialize default jokes
const defaultJokes = [
  "কেন কম্পিউটারের পেটে ব্যথা? কারণ সে অনেক ডেটা খেয়েছে। 🤣",
  "কাউকে ‘গুরু’ বলার আগে মনে রাখবেন, গুরু মানে ভারি। 🤓",
  "পৃথিবীর সবচেয়ে ছোট বই কী? পাগলের ডায়েরি। 😅",
  "Why did the computer go to the doctor? It caught a virus. 😂",
  "Why don't skeletons fight each other? They don't have the guts. 💀",
];

// Ensure the directory and file exist, if not create them
if (!fs.existsSync(jokesDir)) {
  fs.mkdirSync(jokesDir, { recursive: true });
}

if (!fs.existsSync(jokesFilePath)) {
  // If the file doesn't exist, create it with default jokes
  fs.writeFileSync(jokesFilePath, JSON.stringify(defaultJokes, null, 2), "utf-8");
}

// Load jokes from file
let jokes = JSON.parse(fs.readFileSync(jokesFilePath, "utf-8"));

module.exports.handleEvent = function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;

  if (!body) return; // Exit if there's no message body
  const normalizedBody = body.trim().toLowerCase(); // Normalize message

  // Random Jokes Feature
  if (normalizedBody === "joke" || normalizedBody === "কৌতুক") {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return api.sendMessage(randomJoke, threadID, messageID);
  }

  // Add Joke Feature with Validation
  if (normalizedBody.startsWith("addjoke")) {
    const userJoke = body.slice(8).trim(); // Extract the joke after the "addjoke" command
    if (userJoke) {
      const jokeExists = jokes.some((joke) => joke.toLowerCase() === userJoke.toLowerCase());
      if (jokeExists) {
        return api.sendMessage("এই জোকসটি ইতিমধ্যেই তালিকায় রয়েছে! 🔄", threadID, messageID);
      } else {
        jokes.push(userJoke); // Add the joke to the list
        fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), "utf-8"); // Save jokes to file
        return api.sendMessage("আপনার জোকস সফলভাবে যুক্ত হয়েছে! 🎉", threadID, messageID);
      }
    } else {
      return api.sendMessage(
        "অনুগ্রহ করে একটি জোকস যোগ করুন। উদাহরণ: addjoke আমার প্রিয় জোকস।",
        threadID,
        messageID
      );
    }
  }

  // Delete Joke Feature (Only Special Users Can Use)
  if (normalizedBody.startsWith("deletejoke")) {
    const jokeToDelete = body.slice(11).trim(); // Extract the joke to be deleted
    if (specialUsers.includes(senderID)) {  // Check if the sender is a special user
      if (jokeToDelete) {
        const jokeIndex = jokes.findIndex(
          (joke) => joke.toLowerCase() === jokeToDelete.toLowerCase()
        );
        if (jokeIndex !== -1) {
          jokes.splice(jokeIndex, 1); // Remove the joke from the list
          fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), "utf-8"); // Save updated jokes to file
          return api.sendMessage(`আপনার উল্লেখিত জোকসটি সফলভাবে মুছে ফেলা হয়েছে! 🗑️`, threadID, messageID);
        } else {
          return api.sendMessage("এই জোকসটি আমাদের তালিকায় নেই। 🤔", threadID, messageID);
        }
      } else {
        return api.sendMessage("অনুগ্রহ করে মুছে ফেলতে চাওয়া জোকসটি লিখুন। উদাহরণ: deletejoke পৃথিবীর সবচেয়ে ছোট বই কী? পাগলের ডায়েরি।", threadID, messageID);
      }
    } else {
      return api.sendMessage("আপনার কাছে এই কমান্ডটি ব্যবহার করার অনুমতি নেই। 🚫", threadID, messageID);
    }
  }
};

module.exports.run = function ({ api, event }) {
  api.sendMessage(
    "Ready to tell you a joke! Type 'joke' or 'কৌতুক' for a random joke, 'addjoke [your joke]' to add your own, or 'deletejoke [your joke]' to delete a joke (only special users can delete jokes).",
    event.threadID
  );
};
