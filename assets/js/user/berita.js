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
    const tanggal = new Date(data);
    const tgl = tanggal.getDate();
    const bln = tanggal.getMonth();
    const thn = tanggal.getFullYear();
    const dataBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bulan = dataBulan[bln];

    return tgl + " " + bulan + " " + thn;
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
const beritaSekolah = document.querySelector(".beritaSekolah");
const btnSearch = document.querySelector(".input-group-append")
const pagination = document.querySelector(".pagination")
const addElBerita = (data, id) => {
    return `
    <div class="berita-item">
        <div class="card">
            <img src=${data.url_img} alt="">
            <span>${changeTimestamp(data.tgl_uploud)}</span>
        </div>
        <div class="berita-item-title">
            <a href="isi-infor.html" ><h3 id=${id} class="btnPage">${data.judul}</h3></a>
        </div>
        <div class="berita-item-body">
            <p>${limitBodyText(data.isi, 100)}</p>
        </div>
    </div>
    `
}

window.addEventListener("click", (e) => {
    if (e.target.classList == "btnPage") {
        localStorage.setItem("idBerita", e.target.id)
    }
})

let dataLenth = 0
let dataTemp = []

const getAllBerita = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Berita"), orderBy('tgl_uploud', 'desc')))
            .then(querySnapshot => {
                let data = []
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        id:doc.id
                    })
                    beritaSekolah.innerHTML += addElBerita(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getAllBerita()
// END TAMPIL BERITA SEKOLAH


// SEARCH
const cariBerita = document.querySelector(".cariBerita")
let dataSearch = {
    txt : ''
}
btnSearch.addEventListener('click', async() => {
    beritaSekolah.innerHTML = ''
    if(cariBerita.value !== ''){
        dataTemp[0].forEach(data => {
            const searchData = data.judul.toLowerCase()
            console.log(cariBerita.value == '')
            if(searchData.includes(cariBerita.value)){
                beritaSekolah.innerHTML += addElBerita(data, data.id)
                pagination.style.display = 'none';
            }else if(!searchData.includes(cariBerita.value)){
                pagination.style.display = 'none';
            }
        })
    }else {
        location.reload()
    }
})

cariBerita.addEventListener("change", async (e) => {
    dataSearch = {
        txt : e.target.value
    }
    
})
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
    const data = await getAllBerita()
    var numberOfItems = data.length
    var limitPerPage = 4;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7;
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".beritaSekolah .berita-item").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

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

    $(".beritaSekolah").show();
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