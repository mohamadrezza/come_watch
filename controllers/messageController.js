const TelegramBot = require("node-telegram-bot-api");

const botService = require('./../services/bot');

const token = "866254928:AAHToaJ-dNeXahZA_CcfZvKbkQtE0wJMSaI";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", msg => {
	const chatId = msg.chat.id;

	if (msg.text.includes("/start")) {
		bot.sendMessage(
			chatId,
			`👋 Hello ${msg.from.first_name}\ntype movie name to serach it for you...`
		);
		return true;
	}

	if (msg.text.codePointAt(0) === "📥".codePointAt(0)) {
		bot.sendMessage(chatId, "link download will be send");
		bot.sendMessage(
			chatId,
			"Here you are\nhttp://dl.finaldl.info/Movie/2012/Zero%20Dark%20Thirty%202012/Zero.Dark.Thirty.2012.1080p.ShAaNiG_%28_FinalMovie_%29.mkv"
		);
		return true;
	}

	if (msg.text.codePointAt(0) === "🎥".codePointAt(0)) {
		botService.selectMovie(bot , msg , chatId)
		return true;
	}



	botService.searchMovie(bot , msg , chatId);

	
});

exports.newMessage = function(req, res) {
	res.send({ ok: true });
};
