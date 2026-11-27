// ==========================================
// FIREBASE CONFIGURATION
// SIP WANUREJO - KELOMPOK 4
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


// KONFIGURASI FIREBASE
// Ganti dengan konfigurasi Firebase milikmu

const firebaseConfig = {

    apiKey: "API_KEY_KAMU",

    authDomain: "PROJECT_ID.firebaseapp.com",

    projectId: "PROJECT_ID_KAMU",

    storageBucket: "STORAGE_BUCKET_KAMU",

    messagingSenderId: "MESSAGING_SENDER_ID_KAMU",

    appId: "APP_ID_KAMU"

};


// INISIALISASI FIREBASE

const app = initializeApp(firebaseConfig);


// INISIALISASI AUTHENTICATION

const auth = getAuth(app);


// EKSPOR UNTUK FILE LAIN

export { app, auth };