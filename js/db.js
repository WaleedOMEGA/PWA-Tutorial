// offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
        console.log('failed')
        } else if (err.code == 'unimplemented') {
            console.log('not available')
    }
})


db.collection('recipes').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderRecipe(change.doc.data(),change.doc.id)
        }
        if (change.type === 'removed') {
            
        }
    });
});