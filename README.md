# Bot Framework サンプル

![](https://cloud.githubusercontent.com/assets/2181352/26581348/066a085a-4577-11e7-8aa9-0b5e527ca56f.png)
* Node.js版のBot Frameworkを使用したサンプルアプリです
* botから話しかけてきます
* リッチカード等も使用しています
* ローカルで動かす際は、[Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator)をダウンロードしてお使いください
* Bot Frameworkのドキュメントは[こちら](https://docs.microsoft.com/en-us/bot-framework/)

## 使い方

### 依存パッケージのインストール

```
npm install
```

### Botプログラムの起動

```
node app.js
```

### Bot Framework EmulatorからBotに接続

* endpoint URLに`http://localhost:3000/api/messages`と入力し、Connectをクリックします。

## コードの解説

### 会話
* ```session.beginDialog('/dialogName');``` で会話(dialog)の開始
* 基本各dialog内は、Promptでユーザに入力をさせ、それを受け取って処理、というのの繰り返し
* このサンプルコードでは、下記の順番でdialogを呼んでいる
  * [/](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L33)
  * [/firstQuestion](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L107)
  * [/endDialog](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L83)

### botから話しかける
* [29-37行目あたり](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L29-L37)
* ユーザがチャットできる状態になると```conversationUpdate``` というイベントが発生するので、そこからdialogを開始する

### ボタン
* [ボタンの表示](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L62)
* [ボタンの中のテキストの定義](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L39-L58)

### カード

* [カードの表示](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L70-L82)

### yes/noで疑問が解決したか確認

* [87-102行目あたり](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L87-L102)
* Noの場合、最初の質問(firstQuestion)へ戻っている
