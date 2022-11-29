
const addClothBtn = document.getElementById("addClothMenuBtn");
addClothBtn.addEventListener("click", () => {
    window.location = "/cloth-form";
});


const homeMenuBtn = document.getElementById("homeMenuBtn");
homeMenuBtn.addEventListener("click", () => {
    window.location = "/home";
});

const searchMenuBtn = document.getElementById("searchMenuBtn");
searchMenuBtn.addEventListener('click', () => {
    window.location = "/home#searchSection";
 
});
const scrollUpMenyBtn = document.getElementById('scrollUpMenyBtn');
scrollUpMenyBtn.addEventListener('click', () => {
    window.scrollBy({
        top: -window.innerHeight,
        left: 0,
        behavior: 'smooth'
    })
});