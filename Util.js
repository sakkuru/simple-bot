const request = require('request');

class Util {
    storeUserInput(text) {
        const apiEndpoint = process.env.LOG_ENDPOINT;
        const body = {
            input: text,
        }
        const options = {
            url: apiEndpoint,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        };
        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Logging Error: ', error);
            } else {
                console.log(body);
            }
        });
    };

    getLuis(text) {
        return new Promise((resolve, reject) => {
            const apiEndpoint = process.env.LUIS_ENDPOINT || 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0';

            const params = {
                'subscription-key': process.env.SUBSCRIOTION_KEY,
                'timezoneOffset': 540,
                'verbose': true,
                q: text
            };

            const options = {
                url: apiEndpoint,
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

    getCognitiveResults(imageURL) {
        return new Promise((resolve, reject) => {
            const apiEndpoint = process.env.COMPUTER_VISION_ENDPOINT || 'https://southeastasia.api.cognitive.microsoft.com/vision/v1.0/analyze';

            const params = {
                'subscription-key': process.env.SUBSCRIPTION_KEY || '63e0ffd9f8d343e1b229793d1bf8c54d',
                'visualFeatures': 'Description',
            };

            const options = {
                url: apiEndpoint,
                qs: params,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/octet-stream'
                },
                body: request.get(imageURL),
                // encoding: null
            };

            request.post(options, (error, response, body) => {
                console.log(body)
                if (error) {
                    console.log('Image Recognition Error: ', error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    }
}

module.exports = Util;