const builder = require('botbuilder');
const express = require('express');
const request = require('request');
const app = express();

//=========================================================
// Bot Setup
//=========================================================

const port = process.env.port || process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('bot is listening on port %s', port);
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);

app.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// When user joins, it begin Greeting dialog
bot.on('conversationUpdate', message => {
    if (message.membersAdded) {
        message.membersAdded.forEach(identity => {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, 'Greeting');
            }
        });
    }
});

const firstChoices = {
    "いいランチのお店": {
        value: 'lunch',
        title: '行列のできるタイ料理屋',
        subtitle: 'ランチセットがコスパ良し',
        text: '品川駅から徒歩10分くらいのところにあるタイ料理屋。トムヤムクンヌードルがおすすめ。',
        imageURL: 'https://sakkuru.github.io/simple-bot-nodejs/images/tom.jpg',
        button: '予約する',
        url: 'http://example.com/'
    },
    "飲めるところ": {
        value: 'drink',
        title: '落ち着いた雰囲気の個室居酒屋',
        subtitle: 'なんでも美味しいが、特に焼き鳥がおすすめ',
        text: '品川駅から徒歩5分くらいの路地裏にひっそりある。',
        imageURL: 'https://sakkuru.github.io/simple-bot-nodejs/images/yaki.jpg',
        button: '予約する',
        url: 'http://example.com/'
    },
    "その他": {
        value: 'others'
    }
};

bot.dialog('Greeting', [
    session => {
        session.send("こんにちは。\n\nボットが自動でお答えします。");
        session.beginDialog('FirstQuestion');
    }
]);

bot.dialog('FirstQuestion', [
    (session, results, next) => {
        builder.Prompts.choice(session, "何をお探しですか。", firstChoices, { listStyle: 3 });
    },
    (session, results, next) => {
        const choice = firstChoices[results.response.entity];

        if (choice.value === 'others') {
            session.beginDialog('GetFreeText');
            return;
        }

        session.send('%sですね。\n\nこちらはいかがでしょうか。', results.response.entity);

        const card = new builder.HeroCard(session)
            .title(choice.title)
            .subtitle(choice.subtitle)
            .text(choice.text)
            .images([
                builder.CardImage.create(session, choice.imageURL)
            ])
            .buttons([
                builder.CardAction.openUrl(session, choice.url, choice.button)
            ]);

        const msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.beginDialog('EndDialog');
    }
]);

const getLuis = (text) => {
    return new Promise((resolve, reject) => {
        const luisURL = process.env.LUIS_ENDPOINT;

        const params = {
            'subscription-key': process.env.SUBSCRIOTION_KEY,
            'timezoneOffset': 540,
            'verbose': true,
            q: text
        };

        const options = {
            url: luisURL,
            headers: {
                'Accept': 'application/json',
            },
            qs: params
        };

        request.get(options, (err, response, body) => {
            if (err) { console.log(err); return; }
            const res = JSON.parse(response.body);
            resolve(res);
        });
    });
}

bot.dialog('GetFreeText', [
    session => {
        builder.Prompts.text(session, "自由に入力してください。");
    },
    (session, results) => {
        console.log(results.response);
        const res = getLuis(results.response).then(res => {
            console.log('res', res);
            // process LUIS response
        });
    }
]);

bot.dialog('EndDialog', [
    session => {
        builder.Prompts.confirm(session, "疑問は解決しましたか？", { listStyle: 3 });
    },
    (session, results) => {
        console.log(results.response);
        if (results.response) {
            session.send('ありがとうございました。');
            session.endDialog();
        } else {
            session.send('お役に立てず申し訳ありません。');
            session.beginDialog('FirstQuestion');
        }
    }
]);

// help command
bot.customAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        const helpTexts = [
            'help: このヘルプメニュー。前のdialogは続いています。',
            'exit: dialogを終わらせ、 最初に戻ります。',
        ]
        session.send(helpTexts.join('\n\n'));
    }
});

// exit command
bot.dialog('Exit', [
    session => {
        session.endDialog("スタックを消去して終了します。");
        session.beginDialog('FirstQuestion');
    },
]).triggerAction({
    matches: /^exit$/i
});