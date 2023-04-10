// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { doc, setDoc, getFirestore, getDoc, updateDoc,orderBy, Timestamp, addDoc, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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



// TIMESTAMP
const changeTimestamp = (data) => {
	if(data !== undefined){
		var tanggalBeritaObj = new Date(data);
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
		var day = tanggalBeritaObj.getDate();
		var month = months[tanggalBeritaObj.getMonth()];
		var year = tanggalBeritaObj.getFullYear();
        
		return day + ' ' + month + ' ' + year;
	}
}
// END TIMESTAMP

// LIMIT HEADLINE
const limitBodyText = (text, long) => {
    if (text.length > long) {
        return text.substring(0, long) + "...";
    } else {
        return text;
    }
};
// END LIMIT HEADLINE

// TAMPIL BERITA SEKOLAH
const prestasi = document.querySelector(".prestasi");
const addElPrestasi = (data, id) => {
    return `
    <div class="pres-item">
        <div class="row">
            <div class="col-md-6">
                <img class="pres-item-thumbnail" src=${data.url_img}>
            </div>
            <div class="col-md-6">
                <div class="pres-item-title">
                    <h3>${data.judul}</h3>
                    <div class="pres-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${changeTimestamp(data.tanggal)}  </span>
                    <span><i class="fas fa-map-marked-alt"></i> ${data.lokasi}</span>
                    </div>
                </div>
                <div class="pres-item-body">
                    <p>${limitBodyText(data.isi, 400)}</p>
                </div>
            </div>
        </div>
    </div>
    `
}

window.addEventListener("click", (e) => {
    if (e.target.classList == "btnPage") {
        localStorage.setItem("idPrestasi", e.target.id)
    }
})

let dataTemp = []

const getAllPrestasi = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Prestasi"), orderBy('tanggal', 'desc'))) //??? tgl_upload
            .then(querySnapshot => {
                let data = []
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        id:doc.id
                    })
                    prestasi.innerHTML += addElPrestasi(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getAllPrestasi()
// END TAMPIL BERITA SEKOLAH


// SEARCH
// const cariPrestasi = document.querySelector(".cariPrestasi")
// let dataSearch = {
//     txt : ''
// }
// btnSearch.addEventListener('click', async() => {
//     prestasi.innerHTML = ''
//     dataTemp[0].forEach(data => {
//         if(data.judul == cariPrestasi.value.toUpperCase()){
//             prestasi.innerHTML += addElPrestasi(data, data.id)
//             pagination.style.display = 'none';
//         }else if(data.judul != cariPrestasi.value.toUpperCase()){
//             pagination.style.display = 'none';
//         }else if (cariPrestasi.value == '') {
//             prestasi.innerHTML += addElPrestasi(data, data.id)
//             pagination.style.display = 'flex';
//         } 
//     })
// })

// cariPrestasi.addEventListener("change", async (e) => {
//     dataSearch = {
//         txt : e.target.value
//     }
    
// })
// END SEARCH


// PAGE LIST
function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
        return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}

$(async function () {
    const data = await getAllPrestasi()
    var numberOfItems = data.length
    var limitPerPage = 4;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7;
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".prestasi .pres-item").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagination li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("pagination-item").addClass(item ? "current-pagination" : "dots").toggleClass("active", item === currentPage).append($("<a>").addClass("pagination-link").attr({ href: "javascript:void(0)" }).text(item || "...")).insertBefore(".next-pagination");
        });

        $(".previous-pagination").toggleClass("disable", currentPage === 1);
        $(".next-pagination").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".pagination").append(
        $("<li>").addClass("pagination-item").addClass("previous-pagination").append($("<a>").addClass("pagination-link").attr({ href: "javascript:void(0)" }).text("Prev")),
        $("<li>").addClass("pagination-item").addClass("next-pagination").append($("<a>").addClass("pagination-link").attr({ href: "javascript:void(0)" }).text("Next"))
    );

    $(".prestasi").show();
    showPage(1);

    $(document).on("click", ".pagination li.current-pagination:not(.active)", function () {
        return showPage(+$(this).text());
    });

    $(".next-pagination").on("click", function () {
        return showPage(currentPage + 1);
    });

    $(".previous-pagination").on("click", function () {
        return showPage(currentPage - 1);
    });
});
// END PAGE LIST