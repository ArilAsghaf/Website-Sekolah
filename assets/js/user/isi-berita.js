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




const changeTimestamp = (data) => {
	if(data !== undefined){
		var tanggalBeritaObj = new Date(data);
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
		var day = tanggalBeritaObj.getDate();
		var month = months[tanggalBeritaObj.getMonth()];
		var year = tanggalBeritaObj.getFullYear();
        
		return day + ' ' + month + ' ' + year;
	}
}

const infor_sekolah = document.querySelector(".infor_sekolah");
const page_isi = document.querySelector(" .page_isi");
// const breadcrumbPage = document.querySelector(".breadcrumbPage")
const addElb = (data) => {
    // breadcrumbPage.innerText = ''
    page_isi.innerText = data.judul
    return `
    <div class="isi-item">
        <div class="card">
            <img src=${data.url_img} alt="">
            <span>${changeTimestamp(data.tanggal)}</span>
        </div>
        <div class="isi-item-title">
            <div>
                <h3>${data.judul}</h3>
            </div>
        </div>
        <div class="isi-item-body">
            <p>${data.isi}</p>
        </div>
    </div>
`
}

const id = localStorage.getItem("idBerita")
const getDataBerita = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDoc(doc(db, "Berita", id))
            .then(docSnap => {
                if (docSnap.exists()) {
                    infor_sekolah.innerHTML += addElb(docSnap.data())
                }
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getDataBerita()