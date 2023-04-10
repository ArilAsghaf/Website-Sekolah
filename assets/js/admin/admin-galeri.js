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



const keteranganGaleri = document.querySelector(".keteranganGaleri")
const tanggalGaleri = document.querySelector(".tanggalGaleri")
const btnGaleri = document.querySelector(".btnGaleri")
const inputImg = document.querySelector('.input-img')
const editKetGaleri = document.querySelector('.editKetGaleri')
const editTanggalGaleri = document.querySelector(".editTanggalGaleri")
const simpanBtn = document.querySelector(".btnSimpan")
const inputImgEdit = document.querySelector(".input-img-edit")
var fileItem;
var fileName;

// INPUT GALERI SEKOLAH
let dataInputAdmin = {
	keterangan: "",
	url_img: "",
	tanggal: "",
};

// BATAS KARAKTER
const ket = document.querySelector(".keteranganGaleri")
const editKet = document.querySelector(".editKetGaleri"),
count = document.querySelector(".count"),
maxLength = ket.getAttribute("maxlength"),
editMaxLength = ket.getAttribute("maxlength"),
editCount = document.querySelector(".editCount");

ket.onkeyup = () => {
    count.innerText = maxLength - ket.value.length;
}

editKet.onkeyup = () => {
    editCount.innerText = editMaxLength - editKet.value.length;
}
// END BATAS KARAKTER

async function getFile() {
	fileItem = inputImg.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addGaleri(dataInputAdmin)
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
		var tanggalGaleriObj = new Date(data);
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
		var day = tanggalGaleriObj.getDate();
		var month = months[tanggalGaleriObj.getMonth()];
		var year = tanggalGaleriObj.getFullYear();

		return day + ' ' + month + ' ' + year;
	}
}
// END TIMESTAMP

keteranganGaleri.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		keterangan: e.target.value
	}
})

tanggalGaleri.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		tanggal: e.target.value
	}
})

const addGaleri = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Galeri"), data)
			.then(() => {
				console.log("succes !!!")
				resolve(true)
			})
	});
};

btnGaleri.addEventListener("click", async () => {
	fileItem = inputImg.files[0];
	dataInputAdmin = {
		...dataInputAdmin,
		url_img: fileItem
	}
	const { keterangan, tanggal, url_img } =dataInputAdmin;
	if (keterangan== "" || tanggal== "" || url_img== undefined ) {
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
// END INPUT GALERI SEKOLAH


// TAMPIL GALERI SEKOLAH
// DATA TABEL
let dataGaleri = [];

const getAllGaleri = () => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDocs(collection(db, "Galeri"))
			.then(querySnapshot => {
				querySnapshot.forEach((doc) => {
					dataGaleri.push({
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
						data: dataGaleri,
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
							{ data: 'keterangan' },
							{
								render: function (data, type, JsonResultRow, meta) {
									return changeTimestamp(JsonResultRow.tanggal)
								}
							},
							{
								render: function (data, type, JsonResultRow, meta) {
									return `
									<button title="Edit" class="editData" data-bs-toggle="modal" id=${JsonResultRow.id} data-bs-target="#modalEdit"><i id=${JsonResultRow.id} class="fas fa-edit"></i></button>
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
getAllGaleri()
//  END DATA TABEL


// EDIT GALERI SEKOLAH
async function getFileUpdateGaleri() {
	const id = localStorage.getItem("idUpdate")
	fileItem = inputImgEdit.files[0];
	fileName = fileItem.name;

	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const update = await updateGaleri(id, dataInputAdmin)
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

const getDataGaleri = (id) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDoc(doc(db, "Galeri", id))
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

editKetGaleri.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		keterangan: e.target.value
	}
})

editTanggalGaleri.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		tanggal: e.target.value
	}
})

const updateGaleri = (id, data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		setDoc(doc(db, "Galeri", id), data, { merge: true })
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
	const { keterangan, tanggal, url_img } =dataInputAdmin;
	if (keterangan== "" || tanggal== "" || url_img== undefined ) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Data harus disunting !!!',
		})
	}
	else {
		console.log(dataInputAdmin)
		await getFileUpdateGaleri()
	}
})
// END EDIT GALERI SEKOLAH


// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Galeri", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel", e.target.id)
	} else if (e.target.classList.value == "editData") {
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataGaleri(e.target.id)
		if (resp) {
			editKetGaleri.value = resp.keterangan
			editTanggalGaleri.value = resp.tanggal
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
//  END BUTTON ACTION
// END TAMPIL GALERI SEKOLAH


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