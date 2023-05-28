// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { doc, setDoc, getFirestore, getDoc, updateDoc, Timestamp, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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


// INPUT KOTAK SARAN
const namaUser = document.querySelector(".nama");
const emailUser = document.querySelector(".email");
const subjekUser = document.querySelector(".subjek");
const pesanUser = document.querySelector(".pesan");
const btnPesan = document.querySelector(".btn-send");

let dataInputUser = {
    nama: "",
    email: "",
    subjek: "",
    pesan: ""
};

namaUser.addEventListener("change", e => {
    dataInputUser = {
        ...dataInputUser,
        nama: e.target.value
    }
})
emailUser.addEventListener("change", e => {
    dataInputUser = {
        ...dataInputUser,
        email: e.target.value
    }
})
subjekUser.addEventListener("change", e => {
    dataInputUser = {
        ...dataInputUser,
        subjek: e.target.value
    }
})
pesanUser.addEventListener("change", e => {
    dataInputUser = {
        ...dataInputUser,
        pesan: e.target.value
    }
})

const addSaran = (data) => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        addDoc(collection(db, "Saran"), data)
            .then(() => {
                console.log("succes !!!")
                resolve(true)
            })
    });
};

btnPesan.addEventListener("click", async () => {
    const { nama, email, subjek, pesan } =dataInputUser;
	if (nama== "" || email== "" || subjek== "" || pesan== "" ) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Harap isi semua data !!!',
		})
	}
    else if (!isValidEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Harap masukkan email dengan benar !!!',
        })
    }
    else {
        const resp = await addSaran(dataInputUser)
		console.log(dataInputUser)
        // getFile()
        if (dataInputUser) {
			Swal.fire({
				icon: 'success',
				title: 'Pesan berhasil dikirim',
				showConfirmButton: false,
				timer: 1500
			})
			setTimeout(() => {
				location.reload()
			}, 1610);
		}
		
	}
})

function isValidEmail(email) {
    const regexEmail = /\S+@\S+\.\S+/;
    return regexEmail.test(email);
}
// END INPUT KOTAK SARAN