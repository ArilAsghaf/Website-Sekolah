// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { doc, setDoc, getFirestore, orderBy, query, getDoc, updateDoc, Timestamp, addDoc, collection, getDocs , limit} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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



let dataTemp = []

// TAMPIL BERITA SEKOLAH
const sambutan = document.querySelector(".sambutan");
const addElSambutan = (data, id) => {
    return `
    <div class="warp">
        <div class="card">
            <img src="${data.url_img}" alt="">
        </div>
        <p>${data.isi}</p>
    </div>
`
}

const getAllSambutan = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(collection(db, "Sambutan"))
            .then(querySnapshot => {
                let data = []
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        id: doc.id
                    })
                    sambutan.innerHTML += addElSambutan(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getAllSambutan()
// END TAMPIL BERITA SEKOLAH