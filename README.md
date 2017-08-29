# Bot Framework サンプル

![](https://cloud.githubusercontent.com/assets/2181352/26581348/066a085a-4577-11e7-8aa9-0b5e527ca56f.png)

* Node.js版のBot Frameworkを使用したサンプルアプリです
* ローカルで動かす際は、[Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator)をダウンロードしてお使いください
* Bot Frameworkのドキュメントは[こちら](https://docs.microsoft.com/en-us/bot-framework/)

## コードの中身

* botから話しかけてきます
* `help`や`exit`コマンドが使用できます
* 自由入力を受け付け、LUISを呼び出します
* 画像をアップロードさせ、Computer Vision APIを使用して画像認識させます
* リッチカードを使用しています

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
* [botから話しかける](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L33-L42)
* ユーザがチャットできる状態になると```conversationUpdate``` というイベントが発生するので、そこからdialogを開始している

### helpコマンド
* [コマンドの定義](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L219-L228)
* `customAction`はスタックが保持されるので、コマンド終了後は元のdialogに戻る
* ユーザの入力が`matches: /^help$/i,`にマッチしたら、`onSelectAction`が実行される

### exitコマンド
* [コマンドの定義](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L231-L238)
* `triggerAction`はdialogスタックは消去される
* ユーザの入力が`matches: /^exit$/i`にマッチしたら、dialogが実行される

### 画像認識
* [画像のアップロードをさせる](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L184)
* [Computer Vision APIに投げる](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L154-L178)

### ボタンの表示
* [ボタンの表示](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L80)
* [ボタンの中のテキストの定義](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L44-L69)

### リッチカードの表示
* [カードの表示](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L95-L107)

### 自由入力と意図の解釈
* [自由入力の受付](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L141)
* [LUISの呼び出し](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L114-L135)

### yes/noで疑問が解決したか確認
* [確認dialog](https://github.com/sakkuru/simple-bot-nodejs/blob/master/app.js#L202-L216)
* Noの場合、最初の質問(firstQuestion)へ戻っている

## 他のサンプルコード
* [Payment Request APIを使うbotのサンプル](https://github.com/sakkuru/payment-with-bot)
* [Text AnalyticsとAzure Searchを使うbotのサンプル](https://github.com/sakkuru/bot-using-azure-search)