// From firebase's "Add Firebase to your web app"
import firebase from 'firebase'

let config = {
  apiKey: "AIzaSyBHpScqjoYoRbR9qQpyo02D_r_2oxaIloU",
  authDomain: "virtual-chips.firebaseapp.com",
  databaseURL: "https://virtual-chips.firebaseio.com",
  projectId: "virtual-chips",
  storageBucket: "virtual-chips.appspot.com",
  messagingSenderId: "301476727106"
}

const fire = firebase.initializeApp(config)

export default fire