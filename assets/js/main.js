// BG NAVBAR
var navbar = document.getElementsByTagName('nav')[0];
var navbarTex = document.querySelectorAll('.nav-link')

window.addEventListener('scroll', function () {
    if (window.scrollY > 1) {
        navbar.classList.replace('bg-transparant', 'nav-color');
        // navbar.classList.replace('nav-link', 'nav-link2');
        // navbarTex.forEach(e => {
        //     e.classList.replace('nav-link', 'nav-link2')
        // })
    } else if (window.scrollY <= 0) {
        navbar.classList.replace('nav-color', 'bg-transparant');
        // navbar.classList.replace('nav-link2', 'nav-link');
        // navbarTex.forEach(e => {
        //     e.classList.replace('nav-link2', 'nav-link');
        // })
    }
});

// var navbar = document.querySelector('test')[0];
// window.addEventListener('scroll', function() {
//     console.log(window.scrollY);
//     if (window.scrollY > 1) {
//         navbar.classList.replace('nav-link', 'nav-link2');
//     } else if (window.scrollY <= 0) {
//         navbar.classList.replace('nav-link2', 'nav-link');
//     }
// });

// window.onscroll = function() {
//     var navbar = document.getElementById("test");
//     if (window.scrollY > 1) {
//       navbar.classList.add("nav-color");
//       navbar.classList.add("nav-link2");
//     } else if (window.scrollY <= 0) {
//       navbar.classList.remove("nav-colork");
//       navbar.classList.remove("nav-link2");
//     }
// };
// END BG NAVBAR


var scrollBtn = document.getElementById("admin");
// var lastScrollPosition = window.pageYOffset;

// window.addEventListener('scroll', function () {
//     var currentScrollPosition = window.pageYOffset;

//     if (lastScrollPosition > currentScrollPosition) {
//         scrollBtn.classList.remove("hide");
//     } else {
//         scrollBtn.classList.add("hide");
//     }

//     lastScrollPosition = currentScrollPosition;
// });

window.addEventListener('scroll', function () {
    if (window.scrollY > 1) {
        navbar.classList.replace('btnAdmin', 'btnAdmin2');
    } else if (window.scrollY <= 0) {
        navbar.classList.replace('btnAdmin2', 'btnAdmin');
    }
});