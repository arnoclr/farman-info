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
        async requestNotifications() {
            document.getElementById('notificationsOverlay').style.display = 'block'
            const token = await askForPermissionToReceiveNotifications()
            this.checkGrantedStatus()
            return token
        },
        checkGrantedStatus() {
            document.getElementById('notificationsOverlay').style.display = 'none'
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