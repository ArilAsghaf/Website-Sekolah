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



// INPUT GALERI SEKOLAH
const keteranganGaleri = document.querySelector(".keteranganGaleri");
const btnGaleri = document.querySelector(".btnGaleri");
const input_img = document.querySelector('.input-img');
const editKeteranganGaleri = document.querySelector('.editKeteranganGaleri')
const simpanBtn = document.querySelector(".btnSimpan")
const tanggalGaleri = document.querySelector(".tanggalGaleri") // ????
var fileItem;
var fileName;


let dataInputAdmin = {
	keterangan: "",
	url_img: "",
	tanggal: "",
};

const ket = document.querySelector(".keteranganGaleri"),
count = document.querySelector(".count"),
maxLength = ket.getAttribute("maxlength");

ket.onkeyup = () => {
    count.innerText = maxLength - ket.value.length;
}

async function getFile() {
	fileItem = input_img.files[0];
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
				// Upload completed successfully, now we can get the download URL
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


// TIMESTAMP ?????????????
const changeTimestamp = (data) => {
	if(data !== undefined){
		var tanggalGaleriObj = new Date(data);
	
		// Daftar nama bulan dalam bahasa Indonesia
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
	
		// Mengambil nilai tanggal, bulan, dan tahun dari objek Date
		var day = tanggalGaleriObj.getDate();
		var month = months[tanggalGaleriObj.getMonth()];
		var year = tanggalGaleriObj.getFullYear();
	
		// Menggabungkan nilai tanggal, bulan, dan tahun menjadi format yang diinginkan
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

tanggalGaleri.addEventListener("change", e => { // ????
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
				resolve(true) //TRIGGER SWEET ALERT SUCCES
			})
	});
};

btnGaleri.addEventListener("click", async () => {
	fileItem = input_img.files[0];
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
				console.log(dataGaleri)
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
								render: function (data, type, JsonResultRow, meta) { // ??????
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
	fileItem = input_img.files[0];
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

editKeteranganGaleri.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		keterangan: e.target.value
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
	fileItem = input_img.files[0];
	dataInputAdmin = {
		...dataInputAdmin,
		url_img: fileItem
	}
	const { keterangan, isi, url_img } =dataInputAdmin;
	if (keterangan== "" || isi== "" || url_img== undefined ) {
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
			editKeteranganGaleri.value = resp.keterangan
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
//  END BUTTON ACTION
// END TAMPIL GALERI SEKOLAH



const logout = document.querySelector(".logout")
const uid = localStorage.getItem("uid")

logout.addEventListener("click", () => {
	localStorage.clear()
	window.location.href = "admin-login.html"
})
//cek if user login atau tidak
if(uid == undefined) {
	window.location.href = "admin-login.html"
}