// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { doc, setDoc, getFirestore, orderBy, query, getDoc, updateDoc, Timestamp, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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
		var tanggalInfoObj = new Date(data);
		var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
		var day = tanggalInfoObj.getDate();
		var month = months[tanggalInfoObj.getMonth()];
		var year = tanggalInfoObj.getFullYear();
        
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

// TAMPIL INFO SEKOLAH
const infoSekolah = document.querySelector(".infoSekolah")
const btnSearch = document.querySelector(".input-group-append")
const pagination = document.querySelector(".pagination")
const addElInfo = (data, id) => {
    return `
	<div class="info-item">
        <div class="card">
            <img src=${data.url_img}>
            <span>${changeTimestamp(data.tanggal)}</span>
        </div>
        <div class="info-item-title">
            <a href="isi-info.html"><h3 id=${id} class="btnPage">${data.judul}</h3></a>
        </div>
        <div class="info-item-body">
            <p>${limitBodyText(data.isi, 400)}</p>
        </div>
    </div>
	`
}

// OPEN INFO
window.addEventListener("click", (e) => {
    if (e.target.classList == "btnPage") {
        localStorage.setItem("idInfo", e.target.id)
    }
})
// END OPEN INFO

let dataTemp = []


const getAllInfo = () => {
    return new Promise((resolve, reject) => {
        const db = getFirestore(app);
        getDocs(query(collection(db, "Info"), orderBy('tanggal', 'desc')))
            .then(querySnapshot => {
                let data = []
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        id: doc.id
                    })
                    infoSekolah.innerHTML += addElInfo(doc.data(), doc.id)
                });
                resolve(data)
                dataTemp.push(data)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
getAllInfo()
// END TAMPIL INFO SEKOLAH


// SEARCH
const cariInfo = document.querySelector(".cariInfo")
let dataSearch = {
    txt : ''
}

cariInfo.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        dataSearch = {
            txt: e.target.value
        };
        searchData();
    }
})
btnSearch.addEventListener('click', async() => {
	searchData();
});


function searchData() {
	infoSekolah.innerHTML = ''
    if(cariInfo.value !== ''){
        dataTemp[0].forEach(data => {
            const searchData = data.judul.toLowerCase()
            console.log(cariInfo.value == '')
            if(searchData.includes(cariInfo.value.toLowerCase())){
                infoSekolah.innerHTML += addElInfo(data, data.id)
                pagination.style.display = 'none';
            }else if(!searchData.includes(cariInfo.value)){
                pagination.style.display = 'none';
            }
        })
    }else {
        location.reload()
    }	
}
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
    const data = await getAllInfo()
    var numberOfItems = data.length
    var limitPerPage = 4;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7;
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".infoSekolah .info-item").hide().slice((currentPage - 1) * limitPerPage, Math.min(currentPage * limitPerPage, numberOfItems)).show();

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

    $(".infoSekolah").show();
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