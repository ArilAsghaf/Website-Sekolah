// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAc4tRSj1ENgI3oGU5ZUsAk684_fKyFVfU",
    authDomain: "smpn-2-pati.firebaseapp.com",
    projectId: "smpn-2-pati",
    storageBucket: "smpn-2-pati.appspot.com",
    messagingSenderId: "392087494788",
    appId: "1:392087494788:web:924c46eb0a810c6067a2d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)


const emailInputan = document.querySelector(".email");
const pass = document.querySelector(".password");
const btnLogin = document.querySelector(".btnLogin");

let dataInputUser = {
    email: "",
    password: ""
};

emailInputan.addEventListener("change", e => {
    dataInputUser = {
        ...dataInputUser,
        email: e.target.value
    }
})
pass.addEventListener("change", e => {
    dataInputUser = {
        ...dataInputUser,
        password: e.target.value
    }
})

const loginByEmailPass = (data) => {
    return new Promise((resolve, reject) => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user)
                resolve(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                reject(errorCode);
            });
    });
};

async function Login() {
    const resp = await loginByEmailPass(dataInputUser).catch(err => err)
    if (resp.uid !== undefined) {
        localStorage.setItem("uid", resp.uid)
        window.location.href = "admin-index.html"
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${resp}`,
        })
    }
}

btnLogin.addEventListener("click", () => {
    Login()
})

pass.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        pass.addEventListener("change", e => {
            dataInputUser = {
                ...dataInputUser,
                password: e.target.value
            }
            Login()
            
        })
    }
})

emailInputan.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        Login()
    }
})