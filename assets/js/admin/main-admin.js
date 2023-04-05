// ACTIVE SIDEBAR ???????
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});
// END ACTIVE SIDEBAR ??????


// TOGGLE SIDEBAR
const menuBar = document.querySelector('#dashboard nav .fas.fa-bars');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})
// END TOGGLE SIDEBAR


// SWITCH MODE
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})
// END SWITCH MODE


// RESPONSIVE NAVBAR
// const searchButton = document.querySelector('#dashboard nav form .form-input button');
// const searchButtonIcon = document.querySelector('#dashboard nav form .form-input button .fas');
// const searchForm = document.querySelector('#dashboard nav form');


// searchButton.addEventListener('click', function (e) {
// 	if (window.innerWidth < 576) {
// 		e.preventDefault();
// 		searchForm.classList.toggle('show');
// 		if (searchForm.classList.contains('show')) {
// 			searchButtonIcon.classList.replace('fa-search', 'fa-times');
// 		} else {
// 			searchButtonIcon.classList.replace('fa-times', 'fa-search');
// 		}
// 	}
// })

// if (window.innerWidth < 768) {
// 	sidebar.classList.add('hide');
// } else if (window.innerWidth > 576) {
// 	searchButtonIcon.classList.replace('fa-times', 'fa-search');
// 	searchForm.classList.remove('show');
// }

// window.addEventListener('resize', function () {
// 	if (this.innerWidth > 576) {
// 		searchButtonIcon.classList.replace('fa-times', 'fa-search');
// 		searchForm.classList.remove('show');
// 	}
// })
// END RESPONSIVE NAVBAR



// UPLOAD GAMBAR
// const imgArea = document.querySelector(".img-area");
// const fileName = document.querySelector(".file-name");
// const cancelBtn = document.querySelector("#cancel-btn");
// const btnImage = document.querySelector("#btn-image");
// const selectImage = document.querySelector(".select-image");
// const img = document.querySelector(".img");
// var regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\, \$\=\!\-\#\(\)\ . \%\+\~\_ ]+$/;
// function btnImageActive(){
//     btnImage.click();
// }
// btnImage.addEventListener("change", function(){
//     const file = this.files[0];
//     if(file){
//         const reader = new FileReader();
//         reader.onload = function(){
//             const result = reader.result;
//             img.src = result;
//             imgArea.classList.add("active");
//         }
//         cancelBtn.addEventListener("click", function(){
//             img.src = "";
//             imgArea.classList.remove("active");
//         }); // ???
//         reader.readAsDataURL(file);
//     }
//     if(this.value){
//         let valueStore = this.value.match(regExp);
//         fileName.textContent = valueStore;
//     }
// });
// END UPLOAD GAMBAR


// EDIT GAMBAR
const editImgArea = document.querySelector(".edit-img-area");
const filenameEdit = document.querySelector(".filename-edit");
const cancelBtnEdit = document.querySelector("#cancel-btn-edit");
const btnImageEdit = document.querySelector("#btn-image-edit");
const selectImageEdit = document.querySelector(".select-image-edit");
const imgEdit = document.querySelector(".img-edit");
var regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\, \$\=\!\-\#\(\)\ . \%\+\~\_ ]+$/;
function btnImageEditActive(){
    btnImageEdit.click();
}

btnImageEdit.addEventListener("change", function(){
    const file = this.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(){
            const result = reader.result;
            imgEdit.src = result;
            editImgArea.classList.add("active");
        }
        cancelBtnEdit.addEventListener("click", function(){
            imgEdit.src = "";
            editImgArea.classList.remove("active");
        }); // ???
        reader.readAsDataURL(file);
    }
    if(this.value){
        let valueStore = this.value.match(regExp);
        filenameEdit.textContent = valueStore;
    }
});
// END EDIT GAMBAR