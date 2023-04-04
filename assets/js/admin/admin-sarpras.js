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
const judulSarpras = document.querySelector(".judulSarpras");
const btnSarpras = document.querySelector(".btnSarpras");
const input_img = document.querySelector('.input-img');
const editJudulSarpras = document.querySelector('.editModal')
const simpanBtn = document.querySelector(".btnSimpan")
var fileItem;
var fileName;


let dataInputAdmin = {
	judul: "",
	url_img: "",
};

async function getFile() {
	fileItem = input_img.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addSarpras(dataInputAdmin)
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

judulSarpras.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

const addSarpras = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Sarpras"), data)
			.then(() => {
				console.log("succes !!!")
				resolve(true) //TRIGGER SWEET ALERT SUCCES
			})
	});
};

btnSarpras.addEventListener("click", async () => {
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
let dataSarpras = [];

const getAllSarpras = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Sarpras"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataSarpras.push({
						...doc.data(),
						id: doc.id
					})
				});
				console.log(dataSarpras)
				$(document).ready(function () {
					$('#table1').DataTable({
						lengthMenu: [
							[5, 8, 10],
							[5, 8, 10],
						],
						scrollY: false,
						destroy: true,
						data: dataSarpras,
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
getAllSarpras()
//  END DATA TABEL


// EDIT BERITA SEKOLAH
async function getFileUpdateSarpras() {
	const id = localStorage.getItem("idUpdate")
	fileItem = input_img.files[0];
	fileName = fileItem.name;

	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const update = await updateSarpras(id, dataInputAdmin)
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

const getDataSarpras = (id) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDoc(doc(db, "Sarpras", id))
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

editJudulSarpras.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})


const updateSarpras = (id, data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		setDoc(doc(db, "Sarpras", id), data, { merge: true })
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
		await getFileUpdateSarpras()
	}
})
// END EDIT BERITA SEKOLAH


// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Sarpras", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel", e.target.id)
	} else if (e.target.classList.value == "editData") {
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataSarpras(e.target.id)
		if (resp) {
			editJudulSarpras.value = resp.judul
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
//  END BUTTON ACTION
// END TAMPIL BERITA SEKOLAH