var endpointForStartConversation = 'https://directline.botframework.com/v3/directline/conversations';
var endpointForReconnect = 'https://directline.botframework.com/v3/directline/conversations/{conversationId}';
var endpointForMessage = 'https://directline.botframework.com/v3/directline/conversations/{conversationId}/activities';
var endpointForGetMessage = 'https://directline.botframework.com/v3/directline/conversations/{conversationId}/activities';
var secret = 'kMVxrgDSM6w.cwA.Bnw.RPkFc8hVzG6hk_JFJ4ke3U0lmo2krScd4h7IqI2w4XI';
var token;
var Chat = /** @class */ (function () {
    function Chat($status) {
        var _this = this;
        this.startConversation(secret).then(function (res) {
            token = res.token;
            _this.$status = $status;
            console.log('res: ', res);
            $status.append('<p>' + 'conversation id: ' + res.conversationId);
            endpointForMessage = endpointForMessage.replace('{conversationId}', res.conversationId);
            endpointForReconnect = endpointForReconnect.replace('{conversationId}', res.conversationId);
            $status.append('<p>' + 'connecting stream URL....');
            return _this.connect(res.streamUrl);
        }).then(function (ws) {
            _this.connection = ws;
        })["catch"](function (e) {
            console.log(e);
        });
    }
    Chat.prototype.onopen = function () { };
    Chat.prototype.onmessage = function (text) { };
    Chat.prototype.onerror = function (error) { };
    Chat.prototype.connect = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var connection = new WebSocket(url);
            connection.onopen = function () {
                resolve(connection);
                _this.sendMessage(); // Firstly, the client send empty message
                _this.onopen();
            };
            connection.onerror = function (error) {
                _this.onerror(error);
            };
            connection.onmessage = function (e) {
                if (e.data.length < 2) {
                    return;
                }
                var data = JSON.parse(e.data);
                // If the activities data is empty, return.
                if (!data.activities || data.activities.length < 1) {
                    return;
                }
                var activity = data.activities[0];
                // In this client, it omit first message from bot 
                // because the client send a message to the bot on the beginning.
                if (activity.replyToId && activity.replyToId.match(activity.conversation.id)) {
                    _this.onmessage(data.activities);
                }
            };
        });
    };
    Chat.prototype.HTTPRequest = function (request, body) {
        if (body === void 0) { body = ''; }
        return new Promise(function (resolve, reject) {
            request.onreadystatechange = function () {
                switch (request.readyState) {
                    case 4:
                        if ((200 <= request.status && request.status < 300) || (request.status == 304)) {
                            resolve(JSON.parse(request.response));
                            return;
                        }
                        else {
                            reject(request.response);
                        }
                }
            };
            request.send(body);
        });
    };
    Chat.prototype.startConversation = function (secret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('POST', endpointForStartConversation);
            request.setRequestHeader("Authorization", 'Bearer ' + secret);
            _this.HTTPRequest(request).then(function (res) {
                resolve(res);
            });
        });
    };
    Chat.prototype.reconnect = function (watermark_value) {
        var _this = this;
        if (watermark_value === void 0) { watermark_value = 0; }
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            var endpoint = endpointForReconnect + '?watermark=' + watermark_value;
            request.open('GET', endpoint);
            request.setRequestHeader("Authorization", 'Bearer ' + secret);
            _this.HTTPRequest(request).then(function (res) {
                resolve(res);
            });
        });
    };
    Chat.prototype.getMessage = function (watermark_value) {
        var _this = this;
        if (watermark_value === void 0) { watermark_value = 0; }
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            _this.reconnect(watermark_value).then(function (res) {
                token = res.token;
                var endpoint = endpointForMessage + '?watermark=' + watermark_value;
                request.open('GET', endpoint);
                request.setRequestHeader("Authorization", 'Bearer ' + token);
                request.setRequestHeader("Content-Type", 'application/json');
                _this.HTTPRequest(request).then(function (res) {
                    resolve();
                });
            });
        });
    };
    Chat.prototype.sendMessage = function (message) {
        var _this = this;
        if (message === void 0) { message = {}; }
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('POST', endpointForMessage);
            request.setRequestHeader("Authorization", 'Bearer ' + token);
            request.setRequestHeader("Content-Type", 'application/json');
            var appendix = {
                "type": "message",
                "from": {
                    "id": "user",
                    "name": 'You'
                },
                "locale": 'ja',
                textFormat: 'plain',
                "channelId": 'directline'
            };
            message = Object.assign(appendix, message);
            _this.$status.append('<p>' + 'token expired! try reconnect... ');
            _this.reconnect().then(function (res) {
                token = res.token;
                _this.HTTPRequest(request, JSON.stringify(message)).then(function (res) {
                    resolve();
                });
            });
        });
    };
    return Chat;
}());
var $status = $('#status');
var $messages = $('#messages');
var chat;
var showMessage = function (activities) {
    activities.forEach(function (activity) {
        if (activity.from.id === 'user')
            return;
        if (activity.text) {
            appendMessage(activity.text);
        }
        if (activity.attachments) {
            activity.attachments.forEach(function (attachment) {
                if (attachment.content && attachment.content.buttons) {
                    appendButtons(attachment.content.buttons);
                }
            });
        }
    });
};
var appendMessage = function (text) {
    $messages.append('<p>' + text);
};
var appendButtons = function (buttons) {
    buttons.forEach(function (button) {
        var $button = $('<button class="btn btn-default">').text(button.value).val(button.value);
        $messages.append($button);
    });
};
$(function () {
    $status.append('<p>' + 'getting token...');
    chat = new Chat($status);
    chat.onopen = function () {
        $status.append('<p>' + 'connected.');
        $status.append('<p>' + 'getting message...');
    };
    var lastBotMessage;
    chat.onmessage = function (messages) {
        showMessage(messages);
        $status.append('<p>' + 'message received.');
        lastBotMessage = messages[0];
    };
    chat.onerror = function (error) {
        $status.append('<p>' + 'WebSocket Error: ' + error);
    };
    $(document).on("click", "button", function (e) {
        var text = e.target.value;
        $messages.append('<p>' + text);
        var message = {
            replyToId: lastBotMessage.id,
            id: lastBotMessage.id + 1,
            text: text,
            conversation: {
                id: lastBotMessage.conversation.id
            }
        };
        chat.sendMessage(message);
    });
});
