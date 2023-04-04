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
const judulEkstrakulikuler = document.querySelector(".judulEkstrakulikuler");
const isiEkstrakulikuler = document.querySelector(".isiEkstrakulikuler");
const btnEkstrakulikuler = document.querySelector(".btnEkstrakulikuler");
const input_img = document.querySelector('.input-img');
const editJudulEkstrakulikuler = document.querySelector('.editModal')
const editIsiEkstrakulikuler = document.querySelector(".editTextarea")
const simpanBtn = document.querySelector(".btnSimpan")
var fileItem;
var fileName;


let dataInputAdmin = {
	judul: "",
	isi: "",
	url_img: "",
};

async function getFile() {
	fileItem = input_img.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addEkstrakulikuler(dataInputAdmin)
		console.log(resp);
		if (resp) {
			Swal.fire({
				icon: 'success',
				title: 'Data berhasil disimpan',
				showConfirmButton: false,
				timer: 1500
			})
			setTimeout(() => {
				location.reload()
			}, 1610);
		}
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
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					dataInputAdmin = {
						...dataInputAdmin,
						url_img: downloadURL
					}
					resolve(true)
				});
			}
		);
	})
}
// END UPLOAD IMAGE

judulEkstrakulikuler.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

isiEkstrakulikuler.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

const addEkstrakulikuler = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Ekstrakulikuler"), data)
			.then(() => {
				console.log("succes !!!")
				resolve(true) //TRIGGER SWEET ALERT SUCCES
			})
	});
};

btnEkstrakulikuler.addEventListener("click", async () => {
	fileItem = input_img.files[0];
	dataInputAdmin = {
		...dataInputAdmin,
		url_img: fileItem
	}
	const { judul, isi, url_img } =dataInputAdmin;
	if (judul== "" || isi== "" || url_img== undefined ) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Data tidak boleh kosong !!!',
		})
	}
	else {
		console.log(dataInputAdmin)
		getFile()
	}
})
// END INPUT BERITA SEKOLAH


// TAMPIL BERITA SEKOLAH
// DATA TABEL
let dataEkstrakulikuler = [];

const getAllEkstrakulikuler = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Ekstrakulikuler"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataEkstrakulikuler.push({
						...doc.data(),
						id: doc.id
					})
					// if(dataEkstrakulikuler.length <= 5){
					// 	beritaSekolah.innerHTML += addElEkstrakulikuler(doc.data(), doc.id)
					// }
				});
				console.log(dataEkstrakulikuler)
				$(document).ready(function () {
					$('#table1').DataTable({
						lengthMenu: [
							[5, 8, 10],
							[5, 8, 10],
						],
						scrollY: false,
						destroy: true,
						data: dataEkstrakulikuler,
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
							{ data: 'isi' },
							{
								render: function (data, type, JsonResultRow, meta) {
									return `
									<button title="Edit" class="editData" data-bs-toggle="modal" id=${JsonResultRow.id} data-bs-target="#staticBackdrop"><i id=${JsonResultRow.id} class="fas fa-edit"></i></button>
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
getAllEkstrakulikuler()
//  END DATA TABEL


// EDIT BERITA SEKOLAH
async function getFileUpdateEkstrakulikuler() {
	const id = localStorage.getItem("idUpdate")
	fileItem = input_img.files[0];
	fileName = fileItem.name;

	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const update = await updateEkstrakulikuler(id, dataInputAdmin)
		console.log(update)
		if (resp) {
			Swal.fire({
				icon: 'success',
				title: 'Data berhasil disimpan',
				showConfirmButton: false,
				timer: 1500
			})
			setTimeout(() => {
				location.reload()
			}, 1610);
		}
	}
}

const getDataEkstrakulikuler = (id) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDoc(doc(db, "Ekstrakulikuler", id))
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

editJudulEkstrakulikuler.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

editIsiEkstrakulikuler.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

const updateEkstrakulikuler = (id, data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		setDoc(doc(db, "Ekstrakulikuler", id), data, { merge: true })
			.then(() => {
				resolve(true)
			}).catch((error) => {
				reject(error)
				console.log(error)
			});
	});
};

simpanBtn.addEventListener("click", async () => {
	fileItem = input_img.files[0];
	dataInputAdmin = {
		...dataInputAdmin,
		url_img: fileItem
	}
	const { judul, isi, url_img } =dataInputAdmin;
	if (judul== "" || isi== "" || url_img== undefined ) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Data harus disunting !!!',
		})
	}
	else {
		console.log(dataInputAdmin)
		await getFileUpdateEkstrakulikuler()
	}
})
// END EDIT BERITA SEKOLAH


// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Ekstrakulikuler", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel", e.target.id)
	} else if (e.target.classList.value == "editData") {
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataEkstrakulikuler(e.target.id)
		if (resp) {
			editJudulEkstrakulikuler.value = resp.judul
			editIsiEkstrakulikuler.value = resp.isi
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
//  END BUTTON ACTION
// END TAMPIL BERITA SEKOLAH