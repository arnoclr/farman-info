import { db } from '../../../firebaseConfig'
import { getDocs, collection, query } from 'firebase/firestore'

const getCategories = async () => {
    let categories = []

    const q = query(collection(db, 'categories'))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(doc => {
        let buffer = doc.data()
        buffer.id = doc.id
        categories.push(buffer)
    })
    
    return categories
}

export { getCategories }