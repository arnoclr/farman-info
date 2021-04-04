import {firebase} from '../../firebaseConfig'
import 'firebase/messaging'

const messaging = firebase.messaging()

export const askForPermissioToReceiveNotifications = async () => {
    try {
        await messaging.requestPermission()
        const token = await messaging.getToken()
        console.log('notification token :', token)
        
        return token;
    } catch (error) {
        console.error(error)
    }
}