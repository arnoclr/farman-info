import {messaging} from '../../firebaseConfig'

export const askForPermissioToReceiveNotifications = async () => {
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