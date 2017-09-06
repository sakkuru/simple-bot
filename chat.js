const endpointForStartConversation = 'https://directline.botframework.com/v3/directline/conversations';
let endpointForReconnect = 'https://directline.botframework.com/v3/directline/conversations/{conversationId}';
let endpointForMessage = 'https://directline.botframework.com/v3/directline/conversations/{conversationId}/activities';
let endpointForGetMessage = 'https://directline.botframework.com/v3/directline/conversations/{conversationId}/activities';

const secret = 'kMVxrgDSM6w.cwA.Bnw.RPkFc8hVzG6hk_JFJ4ke3U0lmo2krScd4h7IqI2w4XI';
let token = '';

class Chat {
    constructor() {
        this.startConversation(secret).then(res => {
            token = res.token;
            console.log('res: ', res);
            $status.append('<p>' + 'conversation id: ' + res.conversationId);
            endpointForMessage = endpointForMessage.replace('{conversationId}', res.conversationId);
            endpointForReconnect = endpointForReconnect.replace('{conversationId}', res.conversationId);
            $status.append('<p>' + 'connecting stream URL....');
            return this.connect(res.streamUrl);
        }).then(ws => {
            this.connection = ws;
        }).catch(e => {
            console.log(e);
        });
    }

    onopen() {}
    onmessage(text) {}
    onerror(error) {}

    connect(url) {
        return new Promise((resolve, reject) => {
            const connection = new WebSocket(url);
            connection.onopen = () => {
                resolve(connection);
                this.sendMessage(); // Firstly, the client send empty message
                this.onopen();
            };

            connection.onerror = error => {
                this.onerror(error);
            };

            connection.onmessage = e => {
                if (e.data.length < 2) {
                    return;
                }

                const data = JSON.parse(e.data);

                // If the activities data is empty, return.
                if (!data.activities || data.activities.length < 1) {
                    return;
                }

                const activity = data.activities[0];

                // In this client, it omit first message from bot 
                // because the client send a message to the bot on the beginning.
                if (activity.replyToId && activity.replyToId.match(activity.conversation.id)) {
                    this.onmessage(data.activities);
                }
            };
        });
    }

    HTTPRequest(request, body = '') {
        return new Promise((resolve, reject) => {
            request.onreadystatechange = () => {
                switch (request.readyState) {
                    case 4:
                        if ((200 <= request.status && request.status < 300) || (request.status == 304)) {
                            resolve(JSON.parse(request.response));
                            return;
                        } else {
                            reject(request.response);
                        }
                }
            }
            request.send(body);
        })
    }

    startConversation(secret) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', endpointForStartConversation);
            request.setRequestHeader("Authorization", 'Bearer ' + secret);
            this.HTTPRequest(request).then(res => {
                resolve(res);
            });
        });
    }

    reconnect(watermark_value) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            const endpoint = endpointForReconnect + '?watermark=' + watermark_value;
            request.open('GET', endpoint);
            request.setRequestHeader("Authorization", 'Bearer ' + secret);
            this.HTTPRequest(request).then(res => {
                resolve(res);
            });
        });
    }

    getMessage(watermark_value) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            this.reconnect(watermark_value).then(res => {
                token = res.token;
                const endpoint = endpointForMessage + '?watermark=' + watermark_value;
                request.open('GET', endpoint);
                request.setRequestHeader("Authorization", 'Bearer ' + token);
                request.setRequestHeader("Content-Type", 'application/json');
                this.HTTPRequest(request).then(res => {
                    resolve();
                });
            });
        });
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', endpointForMessage);
            request.setRequestHeader("Authorization", 'Bearer ' + token);
            request.setRequestHeader("Content-Type", 'application/json');

            const appendix = {
                "type": "message",
                "from": {
                    "id": "user",
                    "name": 'You',
                },
                "locale": 'ja',
                textFormat: 'plain',
                "channelId": 'directline',
            }
            message = Object.assign(appendix, message);

            $status.append('<p>' + 'token expired! try reconnect... ');
            this.reconnect().then(res => {
                token = res.token;
                this.HTTPRequest(request, JSON.stringify(message)).then(res => {
                    resolve();
                });
            });
        });
    }
}