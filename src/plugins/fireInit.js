import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCvcYGn7P263ED-AP7dp8fZKKfwsujFZKQ',
  authDomain: 'zerophim-ae20a.firebaseapp.com',
  databaseURL: 'https://zerophim-ae20a.firebaseio.com',
  projectId: 'zerophim-ae20a',
  storageBucket: 'zerophim-ae20a.appspot.com',
  messagingSenderId: '112044619204',
  appId: '1:112044619204:web:ee90ebdb0ef931b266e091',
  measurementId: 'G-73W87Q9S3S'
}

// init firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// init services
export const db = firebase.firestore()
