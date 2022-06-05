// From firebase's "Add Firebase to your web app"
import { initializeApp } from 'firebase/app';

let config = {
  apiKey: "AIzaSyBHpScqjoYoRbR9qQpyo02D_r_2oxaIloU",
  authDomain: "virtual-chips.firebaseapp.com",
  databaseURL: "https://virtual-chips.firebaseio.com",
  projectId: "virtual-chips",
  storageBucket: "virtual-chips.appspot.com",
  messagingSenderId: "301476727106"
}

export const initializeFirebase = () => initializeApp(config)
