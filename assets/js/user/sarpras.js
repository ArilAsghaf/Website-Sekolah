// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { doc, setDoc, getFirestore, orderBy, query, getDoc, updateDoc, Timestamp, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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



// TIMESTAMP
const changeTimestamp = (data) => {
    const tanggal = new Date(data);
    const tgl = tanggal.getDate();
    const bln = tanggal.getMonth();
    const thn = tanggal.getFullYear();
    const dataBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bulan = dataBulan[bln];

    return tgl + " " + bulan + " " + thn;
}
// END TIMESTAMP

// TAMPIL BERITA SEKOLAH
const sarpras = document.querySelector(".sarprass");
const addElSarpras = (data, id) => {
    return `
    <div class="col-md-4">
        <div class="sarpras-item">
            <div class="card">
                <img src=${data.url_img} alt="">
                    <div class="img-title">
                        <h5>${data.judul}</h5>
                    </div>
                </div>
            </div>
        </div>
`
}

let dataTemp = []

const getAllSarpras = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Sarpras")))
            .then(querySnapshot => {
                let data = []
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        id: doc.id
                    })
                    sarpras.innerHTML += addElSarpras(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getAllSarpras()
// END TAMPIL BERITA SEKOLAH