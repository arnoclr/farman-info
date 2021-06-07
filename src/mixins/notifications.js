import {messaging, analytics} from '../firebaseConfig'

const askForPermissionToReceiveNotifications = async () => {
    if (!messaging) return alert('navigateur non compatible')
    try {
        await messaging.requestPermission()
        const token = await messaging.getToken()
        console.log('notification token :', token)
        analytics.logEvent('request_notifications', {
            success: true
        })

        return token;
    } catch (error) {
        console.error(error)
        analytics.logEvent('request_notifications', {
            success: false,
            error: error
        })

        return error
    }
}

export const notificationsMixin = {
    data() {
        return {
            notificationsEnabled: false
        }
    },
    methods: {
        requestNotifications() {
            askForPermissionToReceiveNotifications()
            .then(() => {
                this.checkGrantedStatus()
            })
            .catch(error => {
                this.checkGrantedStatus()
            })
        },
        checkGrantedStatus() {
            if ('Notification' in window && messaging) {
                if(Notification.permission === "granted" || Notification.permission === "denied") {
                    this.notificationsEnabled = true
                } else {
                    this.notificationsEnabled = false
                }
            } else {
                // hide button if navigator don't support notifications
                this.notificationsEnabled = true
            }
        }
    },
    mounted() {
        this.checkGrantedStatus()
    }
}