const admin = require('firebase-admin')
const functions = require('firebase-functions')

exports.progressRounds = functions.database.ref('table/{tableId}/state').onUpdate(event => {
  const data = event.data.val()
  console.log("data!")
  console.log(data)
})
