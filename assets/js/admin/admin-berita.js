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



const judulBerita = document.querySelector(".judulBerita")
const tanggalBerita = document.querySelector(".tanggalBerita")
const isiBerita = document.querySelector(".isiBerita")
const btnBerita = document.querySelector(".btnBerita")
const inputImg = document.querySelector('.input-img')
const editJudulBerita = document.querySelector('.editJudulBerita')
const editTanggalBerita = document.querySelector(".editTanggalBerita")
const editIsiBerita = document.querySelector(".editIsiBerita")
const simpanBtn = document.querySelector(".btnSimpan")
const inputImgEdit = document.querySelector(".input-img-edit")
var fileItem;
var fileName;
// const kategoriData = document.querySelector(".kategoriData")

// INPUT BERITA SEKOLAH
let dataInputAdmin = {
	judul: "",
	isi: "",
	url_img: "",
	tanggal: "",
	// kategori: "",
	// tgl_uploud: + new Date()
};

async function getFile() {
	fileItem = inputImg.files[0];
	fileName = fileItem.name;
	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const resp = await addBerita(dataInputAdmin)
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


// TIMESTAMP
const changeTimestamp = (data) => {
	if(data !== undefined){
		var tanggalBeritaObj = new Date(data);

		// Daftar nama bulan dalam bahasa Indonesia
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

		// Mengambil nilai tanggal, bulan, dan tahun dari objek Date
		var day = tanggalBeritaObj.getDate();
		var month = months[tanggalBeritaObj.getMonth()];
		var year = tanggalBeritaObj.getFullYear();

		// Menggabungkan nilai tanggal, bulan, dan tahun menjadi format yang diinginkan
		return day + ' ' + month + ' ' + year;
	}
}
// const changeTimestamp = (data) => {
// 	const tanggal = new Date(data);
// 	const tgl = tanggal.getDate();
// 	const bln = tanggal.getMonth();
// 	const thn = tanggal.getFullYear();
// 	const dataBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
// 	const bulan = dataBulan[bln];

// 	return tgl + " " + bulan + " " + thn;
// }
// END TIMESTAMP

judulBerita.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

tanggalBerita.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		tanggal: e.target.value
	}
})

isiBerita.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

// kategoriData.addEventListener("change", e => {
// 	dataInputAdmin = {
// 		...dataInputAdmin,
// 		kategori: e.target.value
// 	}
// })

const addBerita = (data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		addDoc(collection(db, "Berita"), data)
			.then(() => {
				console.log("succes !!!")
				resolve(true) //TRIGGER SWEET ALERT SUCCES
			})
	});
};

btnBerita.addEventListener("click", async () => {
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
// END INPUT BERITA SEKOLAH


// TAMPIL BERITA SEKOLAH
// DATA TABEL
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
				// console.log(dataBerita)
				$(document).ready(function () {
					$('#table1').DataTable({
						lengthMenu: [
							[3, 5, 7],
							[3, 5, 7],
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
							{
								render: function (data, type, JsonResultRow, meta) {
									return changeTimestamp(JsonResultRow.tanggal)
								}
							},
							// {
							// 	render: function (data, type, JsonResultRow, meta) {
							// 		return changeTimestamp(JsonResultRow.tgl_uploud)
							// 	}
							// },
							{ data: 'isi' },
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
getAllBerita()
//  END DATA TABEL


// EDIT BERITA SEKOLAH
async function getFileUpdateBerita() {
	const id = localStorage.getItem("idUpdate")
	fileItem = inputImgEdit.files[0];
	fileName = fileItem.name;

	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const update = await updateBerita(id, dataInputAdmin)
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

editJudulBerita.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		judul: e.target.value
	}
})

editTanggalBerita.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		tanggal: e.target.value
	}
})

editIsiBerita.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

const updateBerita = (id, data) => {
	return new Promise((resolve, reject) => {
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
		await getFileUpdateBerita()
	}
})
// END EDIT BERITA SEKOLAH


// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnDelete btn-primary") {
		const id = localStorage.getItem("idDel")
		const db = getFirestore(app);
		await deleteDoc(doc(db, "Berita", id));
		localStorage.removeItem("idDel")
		location.reload()
	} else if (e.target.classList.value == "btnDeleteId") {
		localStorage.setItem("idDel", e.target.id)
	} else if (e.target.classList.value == "editData") {
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataBerita(e.target.id)
		if (resp) {
			editJudulBerita.value = resp.judul
			editTanggalBerita.value = resp.tanggal
			editIsiBerita.value = resp.isi
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
//  END BUTTON ACTION
// END TAMPIL BERITA SEKOLAH


// LOGOUT
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
// END LOGOUT



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