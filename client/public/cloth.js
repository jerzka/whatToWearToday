let styles = [];
let colors = [];
let fabrics = [];
let laundryIcons = [];

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

    if(document.getElementById("colors").hasChildNodes()){
        const colorsUls = document.getElementById("colors").children;
        for(const child of colorsUls){
            const colorsLi = child.getElementsByTagName('li');
            colors.push(colorsLi[0].id);
            const deleteColorBtn = child.getElementsByTagName('button');
            deleteColorBtn[0].addEventListener("click", (e) => deleteBtn(colors, e), false);

        }        
    }

    if(document.getElementById("fabrics").hasChildNodes()){
        const fabricsUls = document.getElementById("fabrics").children;
        for(const child of fabricsUls){
            const fabricsLi = child.getElementsByTagName('li');
                let fabricObj = {};
                fabricObj[fabricsLi[0].id] = fabricsLi[1].id;
                fabrics.push(fabricObj);
                const deleteFabricBtn = child.getElementsByTagName('button');
                deleteFabricBtn[0].addEventListener("click", (e) => deleteBtn(fabrics, e), false);
    
        }
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

const addColor = () => {
    const pickedColor = document.querySelector('#colorInput').value.slice(1);
    if(colors.indexOf(pickedColor) !== -1){
        showError("This color has been already added");
        return false;  
    }
    const place = document.querySelector('#colors');
    place.insertAdjacentHTML('beforeend', `
        <ul class="col ul-colors-swatch">
            <li id=${pickedColor} style="background-color: #${pickedColor}"></li>
            <button id="delete-${pickedColor}" type="button" class="btn btn-delete btn-primary">
                <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
            </button>
        </ul>`);
    const deleteColorBtn = document.querySelector(`#delete-${pickedColor}`);
    deleteColorBtn.addEventListener("click", (e) => deleteBtn(colors, e), false);

    colors.push(pickedColor);
};

const addFabric = () => {
    const part = document.querySelector('#part').value;
    const fabric = document.querySelector('#fabric').value;

    let fabricObj = {};
    fabricObj[part] = fabric;

    if(fabrics.some(fabricObj => fabricObj[part] === fabric)){
        showError("This fabric has been already added");
        return false;  
    }

    const place = document.querySelector('#fabrics');
    place.insertAdjacentHTML('beforeend', `
        <ul id="${part}" class="list-group-half">    
            <li class="list-group-item">${part}</li>
            <li class="list-group-item">${fabric}</li>
            <button id="delete-${part}" type="button" class="btn btn-delete btn-primary">
                <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
            </button>
        </ul>`
    );
    const deleteFabricBtn = document.querySelector(`#delete-${part}`);
    deleteFabricBtn.addEventListener("click", (e) => deleteBtn(fabrics, e), false);

    fabrics.push(fabricObj);
};

const addLaundryIcons = () => {

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

const handleSubmitCloth = async () => {
    const seasonsSection = document.querySelector('#seasons');
    const seasonsCheckboxes = seasonsSection.querySelectorAll('input[type=checkbox]');
    const seasonsToDB = Array.prototype.map.call(seasonsCheckboxes, ({value, checked}) => ({[value]: checked}));

    const formValue = {
        name: document.getElementById('clothName').value,
        availability: document.getElementById('availabilityCheck').checked,
        seasons: seasonsToDB,
        styles: styles,
        image: document.querySelector('input[name=image]').files[0],
        colors: colors,
        fabrics: fabrics
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
                id: document.getElementById('clothID').innerText,
                name: document.getElementById('clothName').value,
                availability: document.getElementById('availabilityCheck').checked,
                seasons: JSON.stringify(seasonsToDB),
                styles: JSON.stringify(styles),
                image: photo,
                colors: JSON.stringify(colors),
                fabrics: JSON.stringify(fabrics)
            };
        
            const formData  = new FormData();
            for(const name in dataValue) {
                formData.append(name, dataValue[name]);
              }
            
            response = await fetch('/update-cloth/:id', {
                method: 'POST',
                body: formData
            });
    
        }else{

            const dataValue = {
                name: document.getElementById('clothName').value,
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
            
            response = await fetch('/add-cloth', {
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
        showError("Please provide a cloth's name");
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

    if(formValue.colors.length === 0){
        showError("Please pick at least one color");
        return false;  
    }

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

const addColorBtn = document.querySelector("#addColorBtn");
addColorBtn.addEventListener("click", addColor);

const addFabricBtn = document.querySelector("#addFabricBtn");
addFabricBtn.addEventListener("click", addFabric);

const submitClothBtn = document.getElementById("submitCloth");
submitClothBtn.addEventListener("click", handleSubmitCloth);

init();
