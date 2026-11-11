const firebaseConfig = {
  apiKey: 'AIzaSyB5H3_m57CKJOYRoA4-jBqKZQy_ukmeEhE',
  authDomain: 'teste-114ef.firebaseapp.com',
  projectId: 'teste-114ef',
  storageBucket: 'teste-114ef.firebasestorage.app',
  messagingSenderId: '479603376017',
  appId: '1:479603376017:web:bea2cce7a56d5e851d2430',
  measurementId: 'G-PWP77MEJTV'
};

let firebasePromise;

export function getFirebase() {
  if (!firebasePromise) {
    firebasePromise = (async () => {
      const [appSdk, authSdk, firestore] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js')
      ]);
      const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(firebaseConfig);
      return { app, auth: authSdk.getAuth(app), authSdk, db: firestore.getFirestore(app), firestore };
    })();
  }
  return firebasePromise;
}