import notifier from 'node-notifier'
import errorhandler from 'errorhandler'

function notification (err, str, req) {
    let title = 'Error in ' + req.method + ' ' + req.url

    notifier.notify({
        title: title,
        message: str
    })
}

export const errorNotification = errorhandler({ log: notification });
