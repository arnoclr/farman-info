import {db} from '../../../firebaseConfig'

const getCategories = () => {
    let categories = []
    db.collection('categories').get().then(query => {
        query.forEach(doc => {
            let buffer = doc.data()
            buffer.id = doc.id
            categories.push(buffer)
        })
    }).catch(err => {
        alert(err)
    })
    return categories
}

export { getCategories }