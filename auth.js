
// ==========================================
// AUTHENTICATION
// SIP WANUREJO - KELOMPOK 4
// ==========================================

import { auth } from "./firebase-config.js";

import {

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    updateProfile,

    sendPasswordResetEmail,

    setPersistence,

    browserLocalPersistence

} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


// ==========================================
// 1. PESAN INFORMASI
// ==========================================

function showMessage(message, success = false) {

    const box = document.getElementById("message");

    if (!box) return;

    box.textContent = message;

    box.className = success

        ? "message success"

        : "message error";

}


// ==========================================
// 2. PESAN KESALAHAN FIREBASE
// ==========================================

function errorMessage(error) {

    const messages = {

        "auth/invalid-email":
            "Format email tidak valid.",

        "auth/user-not-found":
            "Email belum terdaftar.",

        "auth/wrong-password":
            "Kata sandi salah.",

        "auth/invalid-credential":
            "Email atau kata sandi tidak sesuai.",

        "auth/email-already-in-use":
            "Email sudah digunakan.",

        "auth/weak-password":
            "Kata sandi minimal 6 karakter.",

        "auth/network-request-failed":
            "Periksa koneksi internet Anda.",

        "auth/too-many-requests":
            "Terlalu banyak percobaan. Coba lagi nanti.",

        "auth/operation-not-allowed":
            "Metode Email/Password belum diaktifkan.",

        "auth/unauthorized-domain":
            "Domain website belum diizinkan di Firebase.",

        "auth/invalid-api-key":
            "Konfigurasi API Key Firebase tidak valid."

    };

    return messages[error.code]

        || "Terjadi kesalahan: " + error.message;

}


// ==========================================
// 3. LOGIN PENGGUNA
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document
            .getElementById("email").value.trim();

        const password = document
            .getElementById("password").value;

        const button = document
            .getElementById("loginButton");

        button.disabled = true;

        button.textContent = "Memproses...";

        try {

            await setPersistence(
                auth,
                browserLocalPersistence
            );

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            showMessage(
                "Login berhasil. Mengalihkan ke beranda...",
                true
            );

            setTimeout(() => {

                window.location.href = "./index.html";

            }, 800);

        } catch (error) {

            showMessage(errorMessage(error));

            button.disabled = false;

            button.textContent = "Masuk";

        }

    });

}


// ==========================================
// 4. REGISTRASI PENGGUNA
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const name = document
                .getElementById("name").value.trim();

            const email = document
                .getElementById("email").value.trim();

            const password = document
                .getElementById("password").value;

            const confirmPassword = document
                .getElementById("confirmPassword").value;

            const button = document
                .getElementById("registerButton");


            if (!name) {

                showMessage(
                    "Nama lengkap wajib diisi."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "Kata sandi minimal 6 karakter."
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    "Konfirmasi kata sandi tidak sesuai."
                );

                return;

            }


            button.disabled = true;

            button.textContent = "Mendaftarkan akun...";


            try {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                await updateProfile(result.user, {

                    displayName: name

                });

                await signOut(auth);

                showMessage(

                    "Registrasi berhasil. Silakan login.",

                    true

                );

                setTimeout(() => {

                    window.location.href = "./login.html";

                }, 1200);

            } catch (error) {

                showMessage(errorMessage(error));

                button.disabled = false;

                button.textContent = "Daftar Sekarang";

            }

        }

    );

}


// ==========================================
// 5. RESET KATA SANDI
// ==========================================

const resetButton =
    document.getElementById("resetPassword");

if (resetButton) {

    resetButton.addEventListener("click", async () => {

        const email = document
            .getElementById("email").value.trim();

        if (!email) {

            showMessage(
                "Masukkan alamat email terlebih dahulu."
            );

            return;

        }

        resetButton.disabled = true;

        try {

            await sendPasswordResetEmail(auth, email);

            showMessage(

                "Jika akun terdaftar, periksa email untuk mereset kata sandi.",

                true

            );

        } catch (error) {

            showMessage(errorMessage(error));

        } finally {

            resetButton.disabled = false;

        }

    });

}


// ==========================================
// 6. TAMPILKAN KATA SANDI
// ==========================================

document.querySelectorAll("[data-toggle-password]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const input = document.getElementById(
                button.dataset.togglePassword
            );

            const hidden = input.type === "password";

            input.type = hidden

                ? "text"

                : "password";

            button.textContent = hidden

                ? "Sembunyikan"

                : "Lihat";

        });

    });


// ==========================================
// 7. STATUS LOGIN PADA HOMEPAGE
// ==========================================

const loginLink =
    document.getElementById("loginLink");

const userName =
    document.getElementById("userName");

const logoutButton =
    document.getElementById("logoutButton");


onAuthStateChanged(auth, (user) => {

    if (loginLink) {

        loginLink.hidden = Boolean(user);

    }

    if (userName) {

        userName.hidden = !user;

        userName.textContent = user

            ? user.displayName || user.email

            : "";

    }

    if (logoutButton) {

        logoutButton.hidden = !user;

    }

});


// ==========================================
// 8. LOGOUT
// ==========================================

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href = "./index.html";

        } catch (error) {

            alert(errorMessage(error));

        }

    });

}