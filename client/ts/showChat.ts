const $status = $('#status');
const $messages = $('#messages');

let chat;

const showMessage = activities => {
    activities.forEach(activity => {
        if (activity.from.id === 'user') return;
        if (activity.text) {
            appendMessage(activity.text);
        }
        if (activity.attachments) {
            activity.attachments.forEach(attachment => {
                if (attachment.content && attachment.content.buttons) {
                    appendButtons(attachment.content.buttons);
                }
            })
        }
    });
}

const appendMessage = text => {
    $messages.append('<p>' + text);
}

const appendButtons = buttons => {
    buttons.forEach(button => {
        const $button = $('<button class="btn btn-default">').text(button.value).val(button.value);
        $messages.append($button);
    });
}

$(() => {
    $status.append('<p>' + 'getting token...');
    chat = new Chat($status);
    chat.onopen = () => {
        $status.append('<p>' + 'connected.');
        $status.append('<p>' + 'getting message...');
    };

    let lastBotMessage;
    chat.onmessage = messages => {
        showMessage(messages);
        $status.append('<p>' + 'message received.');
        lastBotMessage = messages[0];
    }

    chat.onerror = error => {
        $status.append('<p>' + 'WebSocket Error: ' + error);
    };

    $(document).on("click", "button", e => {
        const text = (<HTMLButtonElement>e.target).value;
        $messages.append('<p>' + text);
        const message = {
            replyToId: lastBotMessage.id,
            id: lastBotMessage.id + 1,
            text: text,
            conversation: {
                id: lastBotMessage.conversation.id,
            }
        }
        chat.sendMessage(message);
    });
});