const functions = require('firebase-functions')
const tableAction = require('./table-action')

/*
* functions triggered by realtime database
*/

exports.tableAction = functions.database.ref('table/{tableId}/action')
    .onWrite(event => tableAction.onWrite(event))