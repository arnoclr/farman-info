import {messaging, analytics} from '../firebaseConfig'

const askForPermissionToReceiveNotifications = async () => {
    if (!messaging) return alert('navigateur non compatible')
    try {
        await messaging.requestPermission()
        const token = await messaging.getToken()
        console.log('notification token :', token)

        return token;
    } catch (error) {
        console.error(error)
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
            askForPermissionToReceiveNotifications().then(() => {
                this.checkGrantedStatus()
            })
        },
        checkGrantedStatus() {
            if ('Notification' in window) {
                if(Notification.permission === "granted") {
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