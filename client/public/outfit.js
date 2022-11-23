
let canvas = document.getElementById("outfitCanvas");
let context = canvas.getContext("2d");

// canvas.style.background = '#c2c2c2';
canvas.width = canvas.clientWidth;
var heightRatio = 0.7;
canvas.height = canvas.width * heightRatio;

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let offsetX, offsetY;

const getOffsets = () => {
    console.log("get offset")
    const canvasOffsets = canvas.getBoundingClientRect();
    offsetX = canvasOffsets.left;
    offsetY = canvasOffsets.top;
}

getOffsets();
window.addEventListener('scroll', getOffsets);
window.addEventListener('resize', getOffsets);
canvas.addEventListener('resize', getOffsets);


let photos = [];
let current_photo_index = null;
let isDragging = false;
let startX, startY;

const isMouseInImage = (x, y, shape) => {
    let shapeLeft = shape.x;
    let shapeRight = shape.x + shape.width;
    let shapeTop = shape.y;
    let shapeBottom = shape.y + shape.height;

    if(x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom){
        return true;
    }
    return false;
}

const mouseDown = (event) => {
    event.preventDefault();
    console.log(canvas.clientWidth, canvas.clientHeight)
    startX = parseInt(event.clientX - offsetX);
    startY = parseInt(event.clientY - offsetY);

    let index = 0;
    for( let photo of photos){
        if(isMouseInImage(startX, startY, photo.imagePos)){
            console.log('yes');
            current_photo_index = index;
            isDragging = true;
            return;
        }
        else{
            console.log('no');
        }
        index++;
    }
}

const mouseUp = (event) => {
    if(!isDragging){
        return;
    }

    event.preventDefault();
    isDragging = false;
}

const mouseOut = (event) => {
    if(!isDragging){
        return;
    }

    event.preventDefault();
    isDragging = false;
}

const mouseMove = (event) => {
    if(!isDragging){
        return;
    }
    else{
        console.log('move with dragging');
        event.preventDefault();
        let mouseX = parseInt(event.clientX - offsetX);
        let mouseY = parseInt(event.clientY - offsetY);

        let dx = mouseX -startX;
        let dy = mouseY -startY;

        console.log(dx, dy);

        let currentPhoto = photos[current_photo_index];
        currentPhoto.imagePos.x += dx;
        currentPhoto.imagePos.y += dy;

        drawPhotos();

        startX = mouseX;
        startY = mouseY;
    }
}

const drawPhotos = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    for(let photo of photos){
        context.drawImage(photo.image, photo.imagePos.x, photo.imagePos.y, photo.imagePos.width, photo.imagePos.height);
    }
}

const addToCanvas = (photoID) => {
    console.log("Adding to canvas");
    const imageDOM = document.getElementById(photoID);
    const pickBtn = document.getElementById(`pickBtn_${photoID}`);
    pickBtn.setAttribute('disabled', true);
    imageDOM.style.opacity = 0.3;
    let image = new Image(imageDOM.width, imageDOM.height);
    image.src = imageDOM.currentSrc;
    let imagePos = {
        x: 0,
        y: 0,
        width: image.width/2,
        height: image.height/2
    };  
    photos.push({image, imagePos});
    drawPhotos();

}

canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseout', mouseOut)
canvas.addEventListener('mousemove', mouseMove);

let styles = [];

const init = () => {
    if(document.getElementById("styles").hasChildNodes()){
        const stylesUls = document.getElementById("styles").children;
        for(const child of stylesUls){
            const stylesLi = child.getElementsByTagName('li');
            styles.push(stylesLi[0].innerText);
            const deleteStyleBtn = child.getElementsByTagName('button');
            deleteStyleBtn[0].addEventListener("click", (e) => deleteBtn(styles, e), false);
        }             
    }

    photos = [];
    const pickButtons = document.querySelectorAll('[id*=pickBtn_]');
    for(const button of pickButtons){
        const id = button.id.split('_')[1];
        const carouselItem = document.getElementById(id);
        console.log("Adding event listener");
        button.addEventListener('click', () => { addToCanvas(id)});
    }

    const detailsButtons = document.querySelectorAll('[id*=detailsBtn_]');
    for(const button of detailsButtons){
        const id = button.id.split('_')[1];
        button.addEventListener('click', ()=>{ window.location = `/cloth-details/${id}`})
    }


}

const addStyle = () => {
    const select = document.querySelector('#styleOpt');
    const selectedStyle = select.options[select.selectedIndex].value;
    if(styles.indexOf(selectedStyle) !== -1){
        showError("This style has been already added");
        return false;  
    }

    const place = document.querySelector('#styles');
    place.insertAdjacentHTML('beforeend', `
        <ul id="${selectedStyle}" class="list-group-custom col p-0 justify-content-center">
            <li class="list-group-item" value="${selectedStyle}">${selectedStyle}</li>
            <button id="delete-${selectedStyle}" type="button" class="btn btn-delete btn-primary">
                <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
            </button>
        </ul`);
    const deleteStyleBtn = document.querySelector(`#delete-${selectedStyle}`);
    deleteStyleBtn.addEventListener("click", (e) => deleteBtn(styles, e), false);
    styles.push(selectedStyle); 
};

const deleteBtn = (arr, e) => {
    let toDelete;
    if(typeof arr[0] == "object"){
        toDelete = arr.findIndex(item => item[e.currentTarget.id.split("-")[1]]);
    }
    else{
        toDelete = arr.indexOf(e.currentTarget.id.split("-")[1]);
    }

    if(toDelete !== -1){
        arr.splice(toDelete, 1);
        e.currentTarget.parentElement.remove();
    }    
}

const handleSubmitOutfit = async () => {
    const seasonsSection = document.querySelector('#seasons');
    const seasonsCheckboxes = seasonsSection.querySelectorAll('input[type=checkbox]');
    const seasonsToDB = Array.prototype.map.call(seasonsCheckboxes, ({value, checked}) => ({[value]: checked}));

    const formValue = {
        name: document.getElementById('outfitName').value,
        availability: document.getElementById('availabilityCheck').checked,
        seasons: seasonsToDB,
        styles: styles,
        image: document.querySelector('input[name=image]').files[0],
    };
    console.log(formValue);
    
    const formDataValidated = validateForm(formValue);
    if(formDataValidated) {
        let response;
        if(formValue.id !== undefined){
            let photo;
            if(document.getElementById("photo").hasChildNodes()){
                photo = document.getElementsByTagName('img')[0].src; //localhost path
            }
            else{
                photo = document.querySelector('input[name=image]').files[0];
            }

            const dataValue = {
                id: document.getElementById('outfitID').innerText,
                name: document.getElementById('outfitName').value,
                availability: document.getElementById('availabilityCheck').checked,
                seasons: JSON.stringify(seasonsToDB),
                styles: JSON.stringify(styles),
                image: photo,
            };
        
            const formData  = new FormData();
            for(const name in dataValue) {
                formData.append(name, dataValue[name]);
              }
            
            response = await fetch('/update-outfit/:id', {
                method: 'POST',
                body: formData
            });
    
        }else{

            const dataValue = {
                name: document.getElementById('outfitName').value,
                availability: document.getElementById('availabilityCheck').checked,
                seasons: JSON.stringify(seasonsToDB),
                styles: JSON.stringify(styles),
                image: document.querySelector('input[name=image]').files[0],
                colors: JSON.stringify(colors),
                fabrics: JSON.stringify(fabrics)
            };
        
            const formData  = new FormData();
            for(const name in dataValue) {
                formData.append(name, dataValue[name]);
            }
            
            response = await fetch('/add-outfit', {
                method: 'POST',
                body: formData
            });
        }
        console.log(response);
        const responseBody = await response.json();
        if (response.status !== 200) {
            console.log(responseBody);
            showError(responseBody.error);
        }
        window.location = `/cloth-details/${responseBody.clothId}`
    }
};

const validateForm = (formValue) => {
    console.log(document.querySelectorAll('input[type=checkbox]:checked'));

    if(!formValue.name || formValue.name === ""){
        showError("Please provide a outfit 's name");
        return false;  
    }

    if(document.querySelectorAll('input[type=checkbox]:checked').length == 0){
        showError("Please select at least one season");
        return false;  
    }

    if(formValue.styles.length === 0){ 
        showError("Please select at least one style");
        return false;  
    }

    // if(!formValue.image){
    //     showError("Please upload a photo");
    //     return false;  
    // }


    return true;
};

const showError = (errorMessage) => {
    const body = document.getElementsByTagName('body')[0];
    console.log(body);
    const randomNumber = Math.random();
    const id = `toast-${randomNumber}`;
    body.insertAdjacentHTML('beforeend', `    
    <div id="${id}" class="toast errorToast position-fixed align-items-center text-bg-danger show border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                ${errorMessage}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                aria-label="Close"></button>
        </div>
    </div>`);
}


const addStyleBtn = document.querySelector("#addStyleBtn");
addStyleBtn.addEventListener("click", addStyle);

const submitOutfitBtn = document.getElementById("submitOutfit");
submitOutfitBtn.addEventListener("click", handleSubmitOutfit);

init();
