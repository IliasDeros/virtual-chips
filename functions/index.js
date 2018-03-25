const admin = require('firebase-admin')
const functions = require('firebase-functions')
const realtime = require('./realtime/index')

admin.initializeApp(functions.config().firebase)

exports.onTableAction = realtime.tableAction