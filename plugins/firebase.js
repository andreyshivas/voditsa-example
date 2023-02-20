import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, indexedDBLocalPersistence} from "firebase/auth";

const firebaseConfig = {
  apiKey: "token",
  authDomain: "voditsa.firebaseapp.com",
  projectId: "voditsa",
  storageBucket: "voditsa.appspot.com",
  messagingSenderId: "530949849514",
  appId: "id",
  measurementId: "token",
}

let firebaseApp = {};
let auth = {};
const apps = getApps();

if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

const authProvider = firebaseApp.container.getProvider("auth");
if (authProvider.isInitialized()) {
  auth = authProvider.getImmediate();
} else {
  // Avoid unnecessary iframe on mobile/safari by not using getAuth()
  // 👉 https://github.com/firebase/firebase-js-sdk/issues/4946#issuecomment-87843361
  auth = initializeAuth(firebaseApp, {
    persistence: [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      browserSessionPersistence
    ]
  });
}

const db = getFirestore(firebaseApp, {});

// const auth = getAuth(firebaseApp);
auth.languageCode = 'ru_RU';

export {
  db,
  auth
}
