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



// INPUT BERITA SEKOLAH
const judulPrestasi = document.querySelector(".judulPrestasi");
const lokasiPrestasi = document.querySelector(".lokasiPrestasi");
const isiPrestasi = document.querySelector(".isiPrestasi");
const btnPrestasi = document.querySelector(".btnPrestasi");
const input_img = document.querySelector(".input-img");
var fileItem;
var fileName;
var fileText = document.querySelector(".fileText"); // ???
var img = document.querySelector(".img-area"); // ???

let dataInputUser = {
	judul: "",
    lokasi: "",
	isi: "",
	url_img: "",
	tgl_uploud: + new Date()
};

async function getFile() {
	fileItem = input_img.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addPrestasi(dataInputUser)
		console.log(resp);
	}
}

// UPLOAD IMAGE
function uploadImage(file, name) {
	return new Promise((resolve, reject) => {
		const storage = getStorage(app);
		const uploadTask = uploadBytesResumable(refStorage(storage, `gambar/${name}`), file)
		uploadTask.on('state_changed',
			(snapshot) => {
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				console.log(progress)
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
				}
			},
			(error) => {
				reject(error)
			},
			() => {
				// Upload completed successfully, now we can get the download URL
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					dataInputUser = {
						...dataInputUser,
						url_img: downloadURL
					}
					resolve(true)
				});
			}
		);
	})
}
// END UPLOAD IMAGE

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

judulPrestasi.addEventListener("change", e => {
	dataInputUser = {
		...dataInputUser,
		judul: e.target.value
	}
})

lokasiPrestasi.addEventListener("change", e => {
	dataInputUser = {
		...dataInputUser,
		lokasi: e.target.value
	}
})

isiPrestasi.addEventListener("change", e => {
	dataInputUser = {
		...dataInputUser,
		isi: e.target.value
	}
})

const addPrestasi = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Prestasi"), data)
			.then(() => {
				console.log("succes !!!")
			})
	});
};

btnPrestasi.addEventListener("click", async () => {
	// uploadImage()
	getFile()
})
// END INPUT BERITA SEKOLAH


// TAMPIL BERITA SEKOLAH
// const prestasi = document.querySelector(".prestasi");

// const AddElPrestasi = (data, id) => {
// 	return `
// 	<tr>
// 		<td><img src=${data.url_img} alt=""></td>
// 		<td>${data.judul}</td>
// 		<td>${changeTimestamp(data.tgl_uploud)}</td>
//         <td>${data.lokasi}</td>
// 		<td>${data.isi}</td>
// 		<td >
// 			<button title="Edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fas fa-edit"></i></button>
// 			<button id=${id} class="btnDelete" title="Hapus"><i class="fas fa-trash"></i></button>
// 		</td>
// 	</tr>
// 	`
// }

let dataBerita = [];

const getAllPrestasi = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Prestasi"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataBerita.push({
						...doc.data(),
						id: doc.id
					})
				});
				console.log(dataBerita)
				$(document).ready(function () {
					$('#table1').DataTable({
						destroy: true,
						data: dataBerita,
						columnDefs: [{
							"defaultContent": "-",
							"targets": "_all"
						}],
						columns: [
							{
								render: function (data, type, JsonResultRow, meta) {
									return '<img src="' + JsonResultRow.url_img + '"/>'
								}
							},
							{ data: 'judul' },
							{ render: function (data, type, JsonResultRow, meta) {
								return changeTimestamp(JsonResultRow.tgl_uploud)
								
							} },
							{ data: 'lokasi' },
							{ data: 'isi' },
							{
								render: function (data, type, JsonResultRow, meta) {
									return `
									<button title="Edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fas fa-edit"></i></button>
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
getAllPrestasi()


window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete") {
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Prestasi", e.target.id));
		location.reload()
	}
})
// END TAMPIL BERITA SEKOLAH