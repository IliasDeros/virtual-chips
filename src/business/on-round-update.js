import fire from '../fire'

/*
* Watch table round update and execute a callback with the table
* NOTE: This is untested because it should be tested in members using the script
*/
function loadPlayers(table){
  let playerRef = `table/${table.id}/player`
  return fire.database().ref(playerRef).once('value')
}

export default function onRoundUpdate(table, cb){
  let roundRef = `table/${table.id}/round`

  // watch table round
  fire.database().ref(roundRef).on('value', async roundSnapshot => {
    const playerSnapshot = await loadPlayers(table),
          updatedTable = {
            player: playerSnapshot.val(),
            round: roundSnapshot.val()
          }

    cb(updatedTable)
  })
}