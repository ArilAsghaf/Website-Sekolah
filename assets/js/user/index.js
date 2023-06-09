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

// TIMESTAMP
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
                <span>${changeTimestamp(data.tanggal)}</span>
            </div>
            <div class="berita-beranda-item-title">
                <a href="script/user/isi-berita.html" ><h3 id=${id} class="btnPage">${data.judul}</h3></a>
            </div>
            <div class="berita-beranda-item-body">
                <p>${limitBodyText(data.isi, 400)}</p>
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

const getLimitedBerita = (limitData) => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Berita"), orderBy('tanggal', 'desc'), limit(limitData)))
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


// TAMPIL PRESTASI
const prestasiBeranda = document.querySelector(".prestasiBeranda");
const addElPrestasi = (data, id) => {
    return `
    <div class="prestasi-item">
        <div class="row">
            <div class="col-md-6">
                <img class="prestasi-item-thumbnail" src=${data.url_img}>
            </div>
            <div class="col-md-6">
                <div class="prestasi-item-title">
                <a href="script/user/isi-prestasi.html" ><h3 id=${id} class="btnPage">${data.judul}</h3></a>
                <div class="prestasi-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${changeTimestamp(data.tanggal)} </span>
                    <span><i class="fas fa-map-marked-alt"></i> ${data.lokasi}</span>
                </div>
                </div>
                <div class="prestasi-item-body">
                <p>${limitBodyText(data.isi, 500)}</p>
                </div>
            </div>
        </div>
    </div>
`
}

window.addEventListener("click", (e) => {
    if (e.target.classList == "btnPage") {
        localStorage.setItem("idPrestasi", e.target.id)
    }
})

const getLimitedPrestasi = (limitData) => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Prestasi"), orderBy('tanggal', 'desc'), limit(limitData)))
            .then(querySnapshot => {
                let data = [];
                querySnapshot.forEach(doc => {
                    data.push({
                        ...doc.data(),
                        id: doc.id
                    });
                    prestasiBeranda.innerHTML += addElPrestasi(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch(error => {
                reject(error);
            });
    });
};

getLimitedPrestasi(3)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
// END TAMPIL PRESTASI