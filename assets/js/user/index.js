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

// LIMIT HEADLINE
const limitBodyText = (text, long) => {
    if (text.length > long) {
        return text.substring(0, long) + "...";
    } else {
        return text;
    }
};
// END LIMIT HEADLINE

// TAMPIL BERITA SEKOLAH
const beritaSekolahBeranda = document.querySelector(".beritaSekolahBeranda");
const addElBerita = (data, id) => {
    return `
    <div class="col-md-6">
        <div class="berita-beranda-item">
            <div class="card">
                <img src=${data.url_img} alt="">
                <span>${changeTimestamp(data.tgl_uploud)}</span>
            </div>
            <div class="berita-beranda-item-title">
                <a href="isi-infor.html" ><h3 id=${id} class="btnPage">${data.judul}</h3></a>
            </div>
            <div class="berita-beranda-item-body">
                <p>${limitBodyText(data.isi, 100)}</p>
            </div>
        </div>
    </div>

`
}

window.addEventListener("click", (e) => {
    if (e.target.classList == "btnPage") {
        localStorage.setItem("idBerita", e.target.id)
    }
})

let dataLenth = 0
let dataTemp = []

// const getAllBerita = () => {
//     return new Promise((resolve, reject) => {
//         const db = getFirestore(app);
//         getDocs(query(collection(db, "Berita"), orderBy('tgl_uploud', 'desc')))
//             .then(querySnapshot => {
//                 let data = []
//                 querySnapshot.forEach((doc) => {
//                     data.push({
//                         ...doc.data(),
//                         id: doc.id
//                     })
//                     beritaSekolahBeranda.innerHTML += addElBerita(doc.data(), doc.id)
//                 });
//                 resolve(data)
//                 dataTemp.push(data)
//             })
//             .catch((error) => {
//                 reject(error)
//             });
//     })
// }
// getAllBerita()

const getLimitedBerita = (limitData) => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Berita"), orderBy('tgl_uploud', 'desc'), limit(limitData)))
            .then(querySnapshot => {
                let data = [];
                querySnapshot.forEach(doc => {
                    data.push({
                        ...doc.data(),
                        id: doc.id
                    });
                    beritaSekolahBeranda.innerHTML += addElBerita(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch(error => {
                reject(error);
            });
    });
};

getLimitedBerita(4)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

// END TAMPIL BERITA SEKOLAH