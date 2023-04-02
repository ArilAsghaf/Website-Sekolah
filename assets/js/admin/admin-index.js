// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { doc, setDoc, getFirestore, getDoc, updateDoc, Timestamp, addDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
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


// TAMPIL KOTAK SARAN
// const tBodys = document.querySelector('tbody');
// const kotak_saran = document.querySelector('.kotak_saran');
// const input_img = document.querySelector('.input-img');
// const addEl = (data, id) => {
// 	return `
// 	<tr>
// 		<td>${data.nama}</td>
// 		<td>${data.email}</td>
// 		<td>${data.pesan}</td>
// 		<td>${data.subjek}</td>
// 		<td>
// 			<button id=${id} class="btnDelete"><i class="fas fa-trash"></i></button>
// 		</td>
// 	</tr>
// 	`
// }

// DATA TABEL
let dataKotakSaran = [];

const getAllSaran = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Saran"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataKotakSaran.push({
						...doc.data(),
						id: doc.id
					})
					// if(dataKotakSaran.length <= 5){
					// 	beritaSekolah.innerHTML += addElSaran(doc.data(), doc.id)
					// }
				});
				console.log(dataKotakSaran)
				$(document).ready(function () {
					$('#table1').DataTable({
						lengthMenu: [
							[5, 8, 10],
							[5, 8, 10],
						],
						scrollY: false,
						destroy: true,
						data: dataKotakSaran,
						columnDefs: [{
							"defaultContent": "-",
							"targets": "_all"
						}],
						columns: [
							{ data: 'nama' },
							{ data: 'email' },
							{ data: 'subjek' },
							{ data: 'pesan' },
							{
								render: function (data, type, JsonResultRow, meta) {
									return `
									<button class="btnDeleteId" id=${JsonResultRow.id} data-bs-toggle="modal" data-bs-target="#modalHapus" title="Hapus"><i class="fas fa-trash"></i></button>
									`
								}
							}
						],
					});
				});
			})
			.catch((error) => {
				reject(error)
			});
	})
}
getAllSaran()
//  END DATA TABEL

// const getAllSaran = () => {
// 	return new Promise((resolve, reject) => {
// 		const db = getFirestore(app);
// 		getDocs(collection(db, "Saran"))
// 			.then(querySnapshot => {
// 				querySnapshot.forEach((doc) => {
// 					kotak_saran.innerHTML += addEl(doc.data(), doc.id)
// 				});
// 			})
// 			.catch((error) => {
// 				reject(error)
// 			});
// 	})
// }
// getAllSaran()


// window.addEventListener("click", async (e) => {
// 	if (e.target.classList.value == "btnDelete") {
// 		const db = getFirestore(app);
// 		await deleteDoc(doc(db, "Saran", e.target.id));
// 		location.reload()
// 	}
// })

// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Saran", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel", e.target.id)
	}
})
//  END BUTTON ACTION
// END TAMPIL KOTAK SARAN