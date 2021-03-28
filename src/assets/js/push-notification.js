import { messaging } from '../../firebaseConfig'

export const askForPermissioToReceiveNotifications = async () => {
    try {
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('notification token :', token);
        
        return token;
    } catch (error) {
        console.error(error);
    }
}