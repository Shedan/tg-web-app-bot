const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7448722037:AAGxUcZsO9QIQsde3NePXYURxGAcQb_r_E0';
const webAppUrl = 'https://fabulous-daffodil-3805ef.netlify.app/';


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {

    await bot.sendMessage(
        chatId,
        `Вас вітає Здоровинка! 🎉
Ваш персональний помічник. 🤗
Тут ви знайдете найкращі дієтичні добавки для підтримки вашого здоров'я та енергії. Обирайте продукт, щоб розпочати подорож до кращого самопочуття!`
      );
  

    await bot.sendMessage(chatId, "Нижче з'явиться кнопка, заповніть форму", {
        reply_markup: {
            keyboard: [
                [{text: 'Заповніть форму', web_app: {url: webAppUrl + '/form'} }]
            ]
        }
    })

    await bot.sendMessage(chatId, "Заходьте в наш інтернет магазин по кнопці нижче", {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Зробити замовлення', web_app: {url: webAppUrl} }]
            ]
        }
    })
  }

  if (msg?.web_app_data?.data){
    try {
     const data = JSON.parse(msg?.web_app_data?.data)
     console.log(data)
     await bot.sendMessage(chatId, "Дякуємо за зворотній зв'язок")
     await bot.sendMessage(chatId, "Ваше ім'я:" + data?.name) ;
     await bot.sendMessage(chatId, "Номер телефону:" + data?.phone) ;
     await bot.sendMessage(chatId, "Місто:" + data?.city) ;

    setTimeout (async () => {
        await bot.sendMessage(chatId, "Всю інформацію ви отримаєте у цьому чаті") ;
    }, 3000)
    } catch (e) {
        console.log(e);
    }
    
  }

});
app.post('/web-data', async (req, res) =>{
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Замовлення успішне',
            input_message_content: {message_text: `Вітаємо, ви замовили товар на суму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
        }
        })
        return res.status (200).json({});
    } catch (e) {
        return res.status (500).json({});
    }
})


const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))