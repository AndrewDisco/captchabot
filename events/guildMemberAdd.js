const Captcha = require("@haileybot/captcha-generator");
const Discord = require("discord.js");
var loadingSpinner = require("loading-spinner");
const { addRoleOnComplete, completeRoleId } = require("../config.json");

const {
  guildId,
  prefix,
  addRoleOnComplete,
  completeRoleId,
} = require("../config.json");

module.exports = {
  name: "guildMemberAdd",
  execute(member, bot) {
    console.log(member);
    //get the guild by its id
    let guild = bot.guilds.cache.get(guildId);

    //get the GuildMember object from the guild
    let guildMember = guild.members.cache.get(member.id);
    console.log("---------------------");

    console.log(guildMember);

    //We create a captcha for the new member
    let captcha = new Captcha();

    //Initialize user tries
    let tries = 3;

    const verifyEmbed = new Discord.MessageEmbed()
      .setTitle("Captcha Verification")
      .setDescription(
        `Please send the captcha code here.
 
      Hello! You are required to complete 
      a captcha before entering the server.
      **NOTE:** **This is Case Sensitive.**
                                  
      **Why?**
      This is to protect the server against
      targeted attacks using automated user accounts.
                      
      **Your Captcha:**`
      )
      .setColor("#0099ff")
      .setFooter(`NOTE: You have 30 Seconds to Answer | ${tries}/3 Tries`)
      .setImage("attachment://captcha.jpeg");

    let captchaPassed = false;

    try {
      member
        .send({
          embeds: [verifyEmbed],
          files: [
            new Discord.MessageAttachment(captcha.JPEGStream, "captcha.jpeg"),
          ],
        })
        .then((msg) => {
          console.log(
            `\x1b[33mCaptcha sent to ${member.user.tag} with answer ${captcha.value}\x1b[0m`
          );
          loadingSpinner.start(100, {
            clearChar: true,
          });

          const filter = (m) => m.author.id === member.id;

          //We wait for the user to send the captcha
          let collector = msg.channel.createMessageCollector({
            filter,
            max: 3,
            time: 30000,
            errors: ["time"],
          });

          //We get the user's answer
          collector.on("collect", (response) => {
            loadingSpinner.stop();
            console.log(
              `\x1b[34m${member.user.tag} has answered ${response.content}\x1b[0m`
            );
            //Check if the user has enough tries
            switch (tries) {
              case 3:
                if (response.content === captcha.value) {
                  console.log(
                    "\x1b[32mUser " +
                      member.user.tag +
                      " has passed the captcha!\x1b[0m"
                  );
                  //If the user has enough tries, we send a message to the user
                  member.send(
                    `You have successfully completed the captcha!
                    You can now enter the server.`
                  );
                  //EDIT THIS IN CONFIG.JSON
                  if (addRoleOnComplete) {
                    member.roles.add(completeRoleId);
                  }

                  captchaPassed = true;
                  collector.stop();
                } else {
                  console.log(
                    "\x1b[31mUser " +
                      member.user.tag +
                      " has failed the captcha!\x1b[0m"
                  );
                  tries--;
                  //If the user has not enough tries, we send a message to the user
                  member.send(
                    `You have failed the captcha!
                    You have ${tries} tries left.`
                  );
                }
                break;
              case 2:
                if (response.content === captcha.value) {
                  console.log(
                    "\x1b[32mUser " +
                      member.user.tag +
                      " has passed the captcha!\x1b[0m"
                  );
                  //If the user has enough tries, we send a message to the user
                  member.send(
                    `You have successfully completed the captcha!
                    You can now enter the server.`
                  );
                  //EDIT THIS IN CONFIG.JSON
                  if (addRoleOnComplete) {
                    member.roles.add(completeRoleId);
                  }

                  captchaPassed = true;
                  collector.stop();
                } else {
                  console.log(
                    "\x1b[31mUser " +
                      member.user.tag +
                      " has failed the captcha!\x1b[0m"
                  );
                  tries--;
                  //If the user has not enough tries, we send a message to the user
                  member.send(
                    `You have failed the captcha!
                    You have ${tries} tries left.`
                  );
                }
                break;
              case 1:
                if (response.content === captcha.value) {
                  console.log(
                    "\x1b[32mUser " +
                      member.user.tag +
                      " has passed the captcha!\x1b[0m"
                  );
                  //If the user has enough tries, we send a message to the user
                  member.send(
                    `You have successfully completed the captcha!
                    You can now enter the server.`
                  );
                  //EDIT THIS IN CONFIG.JSON
                  if (addRoleOnComplete) {
                    member.roles.add(completeRoleId);
                  }

                  captchaPassed = true;
                  collector.stop();
                } else {
                  console.log(
                    "\x1b[31mUser " +
                      member.user.tag +
                      " has failed the captcha!\x1b[0m"
                  );
                  tries--;
                }
                break;
              case 0:
                collector.stop();
            }
          });

          collector.on("end", (collected, reason) => {
            loadingSpinner.stop();

            if (!captchaPassed) {
              console.log(
                "\x1b[31mUser " +
                  member.username +
                  " has failed the captcha!\x1b[0m"
              );
              //If the user has not enough tries, we send a message to the user
              if (reason === "time") {
                member.send(
                  "You have failed the captcha!\nYou have exceeded the time limit.\n**You can try again in 30 seconds by typing ``" +
                    prefix +
                    "retry``.**"
                );
              } else {
                member.send(
                  "You have failed the captcha!\nYou have no more tries left.\n**You can try again in 30 seconds by typing ``" +
                    prefix +
                    "retry``.**"
                );
              }
              //We delete the captcha message
              msg.delete();
            }
          });
        });
    } catch (err) {
      return console.log(err);
    }
  },
};
