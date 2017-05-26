const restify = require('restify');
const builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

const firstChoices = {
    "いいランチのお店": {
        value: 'lunch',
        title: '行列のできるタイ料理屋',
        subtitle: 'ランチセットがコスパ良し',
        text: '品川駅から徒歩10分くらいのところにあるタイ料理屋。トムヤムクンヌードルがおすすめ。',
        imageURL: 'https://cloud.githubusercontent.com/assets/2181352/26483008/a88a897a-4225-11e7-84a2-3bfaeb851713.jpg',
        buttons: '予約する',
        url: 'http://example.com/'
    },
    "飲めるところ": {
        value: 'drink',
        title: '落ち着いた雰囲気の個室居酒屋',
        subtitle: 'なんでも美味しいが、特に焼き鳥がおすすめ',
        text: '品川駅から徒歩5分くらいの路地裏にひっそりある。',
        imageURL: 'https://cloud.githubusercontent.com/assets/2181352/26483007/a62eb61a-4225-11e7-8e8c-5db98f35744f.jpg',
        button: '予約する',
        url: 'http://example.com/'
    }
};

bot.dialog('/firstQuestion', [
    session => {
        builder.Prompts.choice(session, "何をお探しですか。", firstChoices, { listStyle: 3 });
    },
    (session, results) => {
        console.log(results.response);
        session.send('%sですね。', results.response.entity);
        session.send('こちらはいかがでしょうか。');

        const choice = firstChoices[results.response.entity];

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
        session.endDialog();
    }
]);

bot.dialog('/', [
    session => {
        session.send("ボットが自動でお答えします。");
        session.beginDialog('/firstQuestion');
    },
    //   function(session, results) {
    //     session.beginDialog('/secondQuestion');
    //   }
]);