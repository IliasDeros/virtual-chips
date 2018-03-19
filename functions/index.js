const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

exports.progressRounds = functions.database.ref('table/{tableId}/action').onUpdate(event => {
  const data = event.data.val()
  console.log("data!")
  console.log(data)
})
