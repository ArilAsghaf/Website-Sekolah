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



const judulAgenda = document.querySelector(".judulAgenda")
const tanggalAgenda = document.querySelector(".tanggalAgenda")
const isiAgenda = document.querySelector(".isiAgenda")
const btnAgenda = document.querySelector(".btnAgenda")
const inputImg = document.querySelector(".input-img")
const editJudulAgenda = document.querySelector('.editJudulAgenda')
const editTanggalAgenda = document.querySelector(".editTanggalAgenda")
const editIsiAgenda = document.querySelector(".editIsiAgenda")
const simpanBtn = document.querySelector(".btnSimpan")
const inputImgEdit = document.querySelector(".input-img-edit")
var fileItem;
var fileName;

// INPUT AGENDA SEKOLAH
let dataInputAdmin = {
	judul: "",
	isi: "",
	url_img: "",
	tanggal: "",
};

async function getFile() {
	fileItem = inputImg.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addAgenda(dataInputAdmin)
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


// TIMESTAMP
const changeTimestamp = (data) => {
	if(data !== undefined){
		var tanggalAgendaObj = new Date(data);
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
		var day = tanggalAgendaObj.getDate();
		var month = months[tanggalAgendaObj.getMonth()];
		var year = tanggalAgendaObj.getFullYear();
		
		return day + ' ' + month + ' ' + year;
	}
}
// END TIMESTAMP

judulAgenda.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

tanggalAgenda.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		tanggal: e.target.value
	}
})

isiAgenda.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

const addAgenda = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Agenda"), data)
			.then(() => {
				console.log("succes !!!")
				resolve(true)
			})
	});
};

btnAgenda.addEventListener("click", async () => {
	fileItem = inputImg.files[0];
	dataInputAdmin = {
		...dataInputAdmin,
		url_img: fileItem
	}
	const { judul, tanggal, isi, url_img } =dataInputAdmin;
	if (judul== "" || tanggal== "" || isi== "" || url_img== undefined ) {
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
// END INPUT AGENDA SEKOLAH


// TAMPIL AGENDA SEKOLAH
// DATA TABEL
let dataAgenda = [];

const getAllAgenda = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Agenda"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataAgenda.push({
						...doc.data(),
						id: doc.id
					})
				});
				$(document).ready(function () {
					$('#table1').DataTable({
						lengthMenu: [
							[3, 5, 7],
							[3, 5, 7],
						],
						scrollY: false,
						destroy: true,
						data: dataAgenda,
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
									return changeTimestamp(JsonResultRow.tanggal)
								}
							},
							{ data: 'isi' },
							{
								render: function (data, type, JsonResultRow, meta) {
									return `
									<button title="Edit" class="editData" id=${JsonResultRow.id} data-bs-toggle="modal" data-bs-target="#modalEdit"><i class="fas fa-edit"></i></button>
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
getAllAgenda()
// END DATA TABEL


// EDIT AGENDA SEKOLAH
async function getFileUpdateAgenda() {
	const id = localStorage.getItem("idUpdate")
	fileItem = inputImgEdit.files[0];
	fileName = fileItem.name;

	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const update = await updateAgenda(id, dataInputAdmin)
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

const getDataAgenda = (id) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDoc(doc(db, "Agenda", id))
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

editJudulAgenda.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

editTanggalAgenda.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		tanggal: e.target.value
	}
})

editIsiAgenda.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

const updateAgenda = (id, data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		setDoc(doc(db, "Agenda", id), data, { merge: true })
			.then(() => {
				resolve(true)
			}).catch((error) => {
				reject(error)
				console.log(error)
			});
	});
};

simpanBtn.addEventListener("click", async () => {
	fileItem = inputImgEdit.files[0];
	dataInputAdmin = {
		...dataInputAdmin,
		url_img: fileItem
	}
	const { judul, tanggal, isi, url_img } =dataInputAdmin;
	if (judul== "" || tanggal== "" || isi== "" || url_img== undefined ) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Data harus disunting !!!',
		})
	}
	else {
		console.log(dataInputAdmin)
		await getFileUpdateAgenda()
	}
})
// END EDIT AGENDA SEKOLAH


// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Agenda", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel",e.target.id)
	} else if (e.target.classList.value == "editData") {
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataAgenda(e.target.id)
		if (resp) {
			editJudulAgenda.value = resp.judul
			editTanggalAgenda.value = resp.tanggal
			editIsiAgenda.value = resp.isi
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
// END BUTTON ACTION
// END TAMPIL AGENDA SEKOLAH


// LOGOUT
const logout = document.querySelector(".logout")
const uid = localStorage.getItem("uid")

logout.addEventListener("click", () => {
	localStorage.clear()
	window.location.href = "admin-login.html"
})

if(uid == undefined) {
	window.location.href = "admin-login.html"
}
// END LOGOUT