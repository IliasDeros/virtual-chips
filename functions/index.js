const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

exports.progressRounds = functions.database.ref('table/{tableId}/action').onWrite(event => {
  // Exit when the data is deleted.
  if (!event.data.exists()) { return null }

  const action = event.data.val()

  switch (action){
    case 'next round':
      console.log('go to next round!')
      break
    default:
      console.error(`Unexpected action ${action}. Available actions: ['next round']`)
  }

  return action
})
