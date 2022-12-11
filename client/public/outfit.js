
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
        if(isMouseInImage(startX, startY, photo.photoCanvasPos)){
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
        currentPhoto.photoCanvasPos.x += dx;
        currentPhoto.photoCanvasPos.y += dy;

        drawPhotos();

        startX = mouseX;
        startY = mouseY;
    }
}

const drawPhotos = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    for(let photo of photos){
        context.drawImage(
            photo.photoImg, 
            photo.photoCanvasPos.x, 
            photo.photoCanvasPos.y, 
            photo.photoCanvasPos.width, 
            photo.photoCanvasPos.height);
    }
}

const addToCanvas = (photoID) => {
    console.log("Adding to canvas");
    const imageDOM = document.getElementById(photoID);
    const pickBtn = document.getElementById(`pickBtn_${photoID}`);
    pickBtn.setAttribute('disabled', true);
    imageDOM.style.opacity = 0.3;
    let image = new Image(imageDOM.width, imageDOM.height);
    image.crossOrigin = 'anonymous';
    image.src = imageDOM.currentSrc;
    let imagePos = {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
    };  
    photos.push({
        photoID: photoID,
        photoImg: image, 
        photoSrc: image.src,
        photoCanvasPos: imagePos});
    drawPhotos();
}

canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseout', mouseOut)
canvas.addEventListener('mousemove', mouseMove);

let categories = [];
let seasons = [];

const init = () => {
    if(document.getElementById("categories").hasChildNodes()){
        const categoryUls = document.getElementById("categories").children;
        for(const child of categoryUls){
            const categoryLi = child.getElementsByTagName('li');
            categories.push(categoryLi[0].innerText);
            const deleteBtn = child.getElementsByTagName('button');
            deleteBtn[0].addEventListener("click", (e) => deleteBtn(categories, e), false);
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

const canvasImage = () => {
    const canvasEl = document.querySelector('#outfitCanvas');
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image = canvasEl.toDataURL("image/png");
    const randomNumber = Math.floor(Math.random() * 1000000);
    const filename = 'outfit_'+randomNumber;
    const imageObj = {filename: filename, file: image};
    return imageObj;
};

const addCategory = () => {
    const select = document.querySelector('#categoryOpt');
    const selectedCategory = select.options[select.selectedIndex].value;
    if(categories.indexOf(selectedCategory) !== -1){
        showError("This style has been already added");
        return false;  
    }

    const place = document.querySelector('#categories');
    place.insertAdjacentHTML('beforeend', `
        <ul id="${selectedCategory}" class="list-group-custom col p-0 justify-content-center">
            <li class="list-group-item" value="${selectedCategory}">${selectedCategory}</li>
            <button id="delete-${selectedCategory}" type="button" class="btn btn-delete btn-primary">
                <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
            </button>
        </ul`);
    const deleteBtn = document.querySelector(`#delete-${selectedCategory}`);
    deleteBtn.addEventListener("click", (e) => deleteBtn(categories, e), false);
    categories.push(selectedCategory); 
};

const deleteBtn = (arr, event) => {
    let toDelete;
    if(typeof arr[0] == "object"){
        toDelete = arr.findIndex(item => item[e.currentTarget.id.split("-")[1]]);
    }
    else{
        toDelete = arr.indexOf(e.currentTarget.id.split("-")[1]);
    }

    if(toDelete !== -1){
        arr.splice(toDelete, 1);
        event.currentTarget.parentElement.remove();
    }    
}

const handleSubmit = async () => {
    const seasonsSection = document.querySelector('#seasons');
    const seasonsCheckboxesNodes = seasonsSection.querySelectorAll('input[type=checkbox]:checked');
    for (let i = 0; i < seasonsCheckboxesNodes.length; i++) {
        seasons.push(seasonsCheckboxesNodes[i].value);
    }
 let photosToDB=[];
    for (let i = 0; i < photos.length; i++) {
        photosToDB.push(photos[i].photoID);
    }

    const formValue = {
        title: document.getElementById('title').value,
        availability: document.getElementById('availabilityCheck').checked,
        privacy: document.getElementById('privacyCheck').checked,
        seasons: seasons,
        categories: categories,   
        image: canvasImage() ,
        clothes: photosToDB
    };
    console.log(formValue);
    
    const formDataValidated = validateForm(formValue);
    if(formDataValidated) {
        let response;
        if(formValue.id !== undefined){
            const dataValue = {
                id: document.getElementById('outfitID').innerText,
                title: document.getElementById('title').value,
                availability: document.getElementById('availabilityCheck').checked,
                seasons: JSON.stringify(seasonsToDB),
                styles: JSON.stringify(styles),
                image: formValue.photo
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
                title: document.getElementById('title').value,
                availability: document.getElementById('availabilityCheck').checked,
                privacy: document.getElementById('privacyCheck').checked,
                seasons: JSON.stringify(seasons),
                categories: JSON.stringify(categories),
                filename: formValue.image.filename,
                file: formValue.image.file,
                clothes: JSON.stringify(photosToDB),
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

        window.location = '/outfit-list';

    }
};

const validateForm = (formValue) => {
    console.log(document.querySelectorAll('input[type=checkbox]:checked'));

    if(!formValue.name || formValue.name === ""){
        showError("Please provide a outfit's name");
        return false;  
    }

    if(document.querySelectorAll('input[type=checkbox]:checked').length == 0){
        showError("Please select at least one season");
        return false;  
    }

    if(formValue.categories.length === 0){ 
        showError("Please select at least one category");
        return false;  
    }

    return true;
};

const addCategoryBtn = document.querySelector("#addCategoryBtn");
addCategoryBtn.addEventListener("click", addCategory);

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", handleSubmit);

init();
