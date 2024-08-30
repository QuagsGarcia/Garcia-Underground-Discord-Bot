// Discord Bot Script (JavaScript)
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const fivemServerIP = "IPADDRESS";
const fivemServerPort = "30120";
const fivemResourceEndpoint = "/http-server/disRoles";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  // Check if roles have changed
  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;

  // Find the added and removed roles
  const addedRoles = newRoles.filter((role) => !oldRoles.has(role.id));
  const removedRoles = oldRoles.filter((role) => !newRoles.has(role.id));

  if (addedRoles.size > 0 || removedRoles.size > 0) {
    // Create a payload with the necessary data
    const payload = {
      eventName: "disRolesEvent",
      disId: newMember.user.id,
      // Add any additional data you want to send to the FiveM server
    };

    // Make the POST request
    axios
      .post(
        `http://${fivemServerIP}:${fivemServerPort}${fivemResourceEndpoint}`,
        payload,
        { timeout: 5000 }, // Adjust the timeout value as needed
      )
      .then((response) => {
        console.log("Event triggered successfully in FiveM!");
        console.log("Response from FiveM:", response.data); // Log the response data
      })
      .catch((error) => {
        console.error("Failed to trigger the event in FiveM:", error.message);
        if (error.response) {
          // The request was made and the server responded with a status code outside the range of 2xx
          console.error("Server responded with status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from the server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up the request:", error.message);
        }
      });
  }
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(
  "DISCORD BOT TOKEN",
);
