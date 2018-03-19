const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

exports.progressRounds = functions.database.ref('table/{tableId}/action').onWrite(event => {
  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return null
  }
  const action = event.data.val()
  console.log('action: ', action)
})
