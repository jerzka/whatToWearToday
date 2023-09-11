const logoHomeBtn = document.getElementById("logo");
// logoHomeBtn.addEventListener("click", () => {
//     window.location = "/home";
// });

const signinBtn = document.getElementById("signinBtn");
signinBtn.addEventListener("click", () => {
    window.location = "/signin";
});


const toggleBtn = document.getElementsByClassName("navbar-toggler")[0];
toggleBtn.addEventListener("click", () =>{
let isCollapsed = toggleBtn.classList.contains("collapsed");
if(isCollapsed){
    toggleBtn.firstElementChild.classList.remove('navbar-toggler-icon');
    toggleBtn.firstElementChild.classList.add('navbar-toggler-icon-collapsed');
}
else{
    toggleBtn.firstElementChild.classList.remove('navbar-toggler-icon-collapsed');
    toggleBtn.firstElementChild.classList.add('navbar-toggler-icon');

}
});