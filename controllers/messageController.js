const TelegramBot = require("node-telegram-bot-api");

const token = "866254928:AAHToaJ-dNeXahZA_CcfZvKbkQtE0wJMSaI";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", msg => {
  const chatId = msg.chat.id;

  if (msg.text.includes("/start")) {
    bot.sendMessage(
      chatId,
      `
    👋 Hello ${msg.from.first_name}\ntype movie name to serach it for you...`
    );
    return true;
  }

  if (msg.text.codePointAt(0) === "📥".codePointAt(0)) {
    bot.sendMessage(chatId, "link download will be send");
    bot.sendMessage(chatId, "Here you are\nhttp://dl.finaldl.info/Movie/2012/Zero%20Dark%20Thirty%202012/Zero.Dark.Thirty.2012.1080p.ShAaNiG_%28_FinalMovie_%29.mkv");
    return true;
  }

  if (msg.text.codePointAt(0) === "🎥".codePointAt(0)) {
    bot.sendMessage(chatId, "selected movie: " + msg.text);
    bot.sendPhoto(
      chatId,
      "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
      {
        caption: `The Dark Knight Rises (2012)
        IMDB:8.5
        ژانر:#اکشن #مهیج 
        ستارگان : Christian Bale, Tom Hardy, Joseph Gordon-Levitt, Gary Oldman 
        #فیلم_سینمایی #خارجی`
      }
    );


    bot.sendMessage(
        chatId,
        "i found 5 movies\nplease select movie to give u link",
        {
          reply_markup: {
            keyboard: [
              ["📥 720p Bluray 678MB"],
              ["📥 1080p WEB-DL 2021MB"],
            ]
          }
        }
      );


    return true;
  }

  bot.sendMessage(chatId, `🔎Searching: ${msg.text}`);

  bot.sendMessage(
    chatId,
    "i found 5 movies\nplease select movie to give u link",
    {
      reply_markup: {
        keyboard: [
          ["🎥 Dark Knight 2008"],
          ["🎥 Keyboard 2006"],
          ["🎥 Keyboard 2010"],
          ["🎥 Keyboard 1989"],
          ["🎥 Keyboard 2016"],
          ["🎥  I'm robot 2017"]
        ]
      }
    }
  );
});

exports.newMessage = function(req, res) {
  res.send({ ok: true });
};
