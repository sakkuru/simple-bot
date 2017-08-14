# Bot Framework サンプル

![](https://cloud.githubusercontent.com/assets/2181352/26581348/066a085a-4577-11e7-8aa9-0b5e527ca56f.png)
* Node.js版のBot Frameworkを使用したサンプルアプリです
* botから話しかけてきます
* リッチカードを使用しています
* 自由入力を受け付け、LUISを呼び出します
* ローカルで動かす際は、[Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator)をダウンロードしてお使いください
* Bot Frameworkのドキュメントは[こちら](https://docs.microsoft.com/en-us/bot-framework/)

## 使い方

### 依存パッケージのインストール

```
npm install
```

### Botプログラムの起動

LUISを使用しせず、とりあえず動かす場合
```
node app.js
```

LUISを使う場合
```
LUIS_ENDPOINT=[LUIS_ENDPOINT] SUBSCRIOTION_KEY=[SUBSCRIOTION_KEY] node app.js
```

### Bot Framework EmulatorからBotに接続

* endpoint URLに`http://localhost:3000/api/messages`と入力し、Connectをクリックします。

## コードの解説

### 会話
* ```session.beginDialog('DialogName');``` で会話(dialog)の開始
* 基本各dialog内は、Promptでユーザに入力をさせ、それを受け取って処理、というのの繰り返し
* このサンプルコードでは、下記のdialogを呼んでいる
  * Greeting
  * FirstQuestion
  * GetFreeText
  * EndDialog

### botから話しかける
* [29-37行目あたり](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L29-L38)
* ユーザがチャットできる状態になると```conversationUpdate``` というイベントが発生するので、そこからdialogを開始している

### ボタンの表示
* [ボタンの表示](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L73)
* [ボタンの中のテキストの定義](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L40-L62)

### リッチカードの表示

* [カードの表示](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L85-L97)

### 自由入力とLUISの呼び出し

* [自由入力の受付](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L131)
* [LUISの呼び出し](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L102-L127)

### yes/noで疑問が解決したか確認

* [87-102行目あたり](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L142-L156)
* Noの場合、最初の質問(firstQuestion)へ戻っている

## 他のサンプルコード

* [Payment Request APIを使うbotのサンプル](https://github.com/sakkuru/payment-with-bot)
* [Text AnalyticsとAzure Searchを使うbotのサンプル](https://github.com/sakkuru/bot-using-azure-search)