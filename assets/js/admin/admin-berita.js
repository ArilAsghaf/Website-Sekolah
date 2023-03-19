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
const judulBerita = document.querySelector(".judulBerita");
const isiBerita = document.querySelector(".isiBerita");
const btnBerita = document.querySelector(".btnBerita");
const input_img = document.querySelector('.input-img');
const inputJudul = document.querySelector('.editModal')
const btnImage = document.querySelector(".input-img-edit");
const inputBerita = document.querySelector(".editTextarea")
const simpanBtn = document.querySelector(".btnSimpan")
var fileItem;
var fileName;
var fileText = document.querySelector(".fileText"); // ???
var img = document.querySelector(".img-area"); // ???

let dataInputUser = {
	judul: "",
	isi: "",
	url_img: "",
	tgl_uploud: + new Date()
};

async function getFile() {
	fileItem = input_img.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addBerita(dataInputUser)
		console.log(resp);
	}
}

async function getFileUpdateBerita() {
	fileItem = input_img.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		console.log(resp)
	}
}

const getDataBerita = (id) => {
	return new Promise((resolve, reject) => {
	  const db = getFirestore(app);
	  getDoc(doc(db, "Berita", id))
	  .then(docSnap => {
		if (docSnap.exists()) {
		  resolve(docSnap.data())
		} else {
		  resolve("Data Kosong");
		}
	  })
	  .catch((error) => {
		reject(error)
	  });
	})
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

judulBerita.addEventListener("change", e => {
	dataInputUser = {
		...dataInputUser,
		judul: e.target.value
	}
})

inputJudul.addEventListener("change",(e) => {
	dataInputUser = {
		...dataInputUser,
		judul: e.target.value
	}
})

inputBerita.addEventListener("change",(e) => {
	dataInputUser = {
		...dataInputUser,
		isi: e.target.value
	}
})

isiBerita.addEventListener("change", e => {
	dataInputUser = {
		...dataInputUser,
		isi: e.target.value
	}
})

const addBerita = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Berita"), data)
			.then(() => {
				console.log("succes !!!")
			})
	});
};

 const updateBerita = (id, data) => {
	return new Promise((resolve , reject) => {
	  const db = getFirestore(app);
	  setDoc(doc(db, "Berita", id), data, { merge: true })
		.then(() => {
		  resolve(true)
		}).catch((error) => {
		  reject(error)
		  console.log(error)
		});
	});
  };

btnBerita.addEventListener("click", async () => {
	// uploadImage()
	getFile()
})
// END INPUT BERITA SEKOLAH


// TAMPIL BERITA SEKOLAH
// const beritaSekolah = document.querySelector(".beritaSekolah");

// const addElBerita = (data, id) => {
// 	return `
// 	<tr>
// 		<td><img src=${data.url_img} alt=""></td>
// 		<td>${data.judul}</td>
// 		<td>${changeTimestamp(data.tgl_uploud)}</td>
// 		<td>${data.isi}</td>
// 		<td >
// 			<button title="Edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fas fa-edit"></i></button>
// 			<button id=${id} class="btnDelete" title="Hapus"><i class="fas fa-trash"></i></button>
// 		</td>
// 	</tr>
// 	`
// }

let dataBerita = [];

const getAllBerita = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Berita"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataBerita.push({
						...doc.data(),
						id: doc.id
					})
					// if(dataBerita.length <= 5){
					// 	beritaSekolah.innerHTML += addElBerita(doc.data(), doc.id)
					// }
				});
				console.log(dataBerita)
				$(document).ready(function () {
					$('#table1').DataTable({
						lengthMenu: [
							[5, 8, 10],
							[5, 8, 10],
						],
						scrollY: false,
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
							{ data: 'isi' },
							{
								render: function (data, type, JsonResultRow, meta) {
									return `
									<button title="Edit" data-bs-toggle="modal" id=${JsonResultRow.id} data-bs-target="#staticBackdrop"><i id=${JsonResultRow.id} class="fas fa-edit"></i></button>
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
getAllBerita()

simpanBtn.addEventListener("click", async () => {
	const id = localStorage.getItem("idUpdate")
	
	const resp = await updateBerita(id, dataInputUser)
	console.log(resp)
})

// <button id=${JsonResultRow.id} class="btnDelete" title="Hapus"><i class="fas fa-trash"></i></button>


window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Berita", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel",e.target.id)
	}else if (e.target.classList.value == "fas fa-edit"){
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataBerita(e.target.id)
		if(resp){
			inputJudul.value = resp.judul
			inputBerita.value = resp.isi
			dataInputUser = {
				...dataInputUser,
				url_img : resp.url_img
			}
		}
	}
})
// END TAMPIL BERITA SEKOLAH

