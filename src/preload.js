// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCkMNCaQywcM5t7ZC0E-FUNsRc10AEH2MA",
  authDomain: "electron-baucuatomca.firebaseapp.com",
  projectId: "electron-baucuatomca",
  storageBucket: "electron-baucuatomca.appspot.com",
  messagingSenderId: "509558190763",
  appId: "1:509558190763:web:8c36d1a7ae5538b9567dee",
};

firebase.initializeApp(firebaseConfig);
