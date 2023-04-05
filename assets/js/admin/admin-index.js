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


// EDIT SAMBUTAN
const isiSambutan = document.querySelector(".isiSambutan")
const simpanBtn = document.querySelector(".btnSimpan")
const input_img = document.querySelector('.input-img-edit')
var fileItem;
var fileName;


let dataInputAdmin = {
	isi: "",
	url_img: ""
};

// async function getFile() {
// 	fileItem = input_img.files[0];
// 	fileName = fileItem.name;
// 	const resp = await uploadImage(fileItem, fileName)
// 	if (resp) {
// 		const resp = await addSambutan(dataInputAdmin)
// 		console.log(resp);
// 		if (resp) {
// 			Swal.fire({
// 				icon: 'success',
// 				title: 'Data berhasil disimpan',
// 				showConfirmButton: false,
// 				timer: 1500
// 			})
// 			setTimeout(() => {
// 				location.reload()
// 			}, 1610);
// 		}
// 	}
// }

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

isiSambutan.addEventListener("change", e => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

// const addSambutan = (data) => {
// 	return new Promise((resolve, reject) => {
// 		const db = getFirestore(app);
// 		addDoc(collection(db, "Sambutan"), data)
// 			.then(() => {
// 				console.log("succes !!!")
// 				resolve(true)
// 			})
// 	});
// };

// simpanBtn.addEventListener("click", async () => {
// 	fileItem = input_img.files[0];
// 	dataInputAdmin = {
// 		...dataInputAdmin,
// 		url_img: fileItem
// 	}
// 	const {isi, url_img } =dataInputAdmin;
// 	if (isi== "" || url_img== undefined ) {
// 		Swal.fire({
// 			icon: 'error',
// 			title: 'Oops...',
// 			text: 'Data tidak boleh kosong !!!',
// 		})
// 	}
// 	else {
// 		console.log(dataInputAdmin)
// 		getFile()
// 	}
// })
// END EDIT SAMBUTAN


// TAMPIL SAMBUTAN
const sambutan = document.querySelector(".sambutan");
const addElSambutan = (data, id,) => {
    return `
	<h4>Sambutan</h4>
	<div class="card">
		<img src=${data.url_img} alt="">
	</div>
	<p>${data.isi}</p>
	<button type="submit" class="btnSunting" id="sunting" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Sunting</button>
` 
}
///// ?????????
let dataTemp = []

const getAllSambutan = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(collection(db, "Sambutan"))
            .then(querySnapshot => {
                let data = []
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        id: doc.id
                    })
                    sambutan.innerHTML += addElSambutan(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getAllSambutan()
// END TAMPIL SAMBUTAN


// EDIT BERITA SEKOLAH
async function getFileUpdateSambutan() {
	const id = localStorage.getItem("idUpdate")
	fileItem = input_img.files[0];
	fileName = fileItem.name;

	const resp = await uploadImage(fileItem, fileName)
	if (resp) {
		const update = await updateSambutan(id, dataInputAdmin)
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

const getDataSambutan = (id) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		getDoc(doc(db, "Sambutan", id))
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

isiSambutan.addEventListener("change", (e) => {
	dataInputAdmin = {
		...dataInputAdmin,
		isi: e.target.value
	}
})

const updateSambutan = (id, data) => {
	return new Promise((resolve, reject) => {
		const db = getFirestore(app);
		setDoc(doc(db, "Sambutan", id), data, { merge: true })
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
	const {isi, url_img } =dataInputAdmin;
	if (isi== "" || url_img== undefined ) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Data harus disunting !!!',
		})
	}
	else {
		console.log(dataInputAdmin)
		await getFileUpdateSambutan()
	}
})
// END EDIT BERITA SEKOLAH


// BUTTON ACTION
window.addEventListener("click", async (e) => {
	if (e.target.classList.value == "btnSunting") {
		localStorage.setItem("idUpdate", e.target.id)
		const resp = await getDataSambutan(e.target.id)
		if (resp) {
			isiSambutan.value = resp.isi
			dataInputAdmin = {
				...dataInputAdmin,
				url_img: resp.url_img
			}
		}
	}
})
//  END BUTTON ACTION


// LOGOUT
const logout = document.querySelector(".logout")
logout.addEventListener("click", () => {
	localStorage.clear()
	window.location.href = "admin-login.html"
})

const uid = localStorage.getItem("uid")
if(uid == undefined) { //cek if user login atau tidak
	window.location.href = "admin-login.html"
}
// END LOGOUT