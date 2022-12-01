const cloth = {
    name: '',
    availability: true,
    seasons: [],
    styles: [],
    colors: [],
    fabrics: [],
    laundryIcons: [],

    getSeason: (event) =>{
        cloth.seasons.push(event.target.value);
    },
    getSeasons: () => {
        const seasonsSection = document.querySelector('#seasons');
        const seasonsCheckboxesNodes = seasonsSection.querySelectorAll('input[type=checkbox]:checked');
        for (let i = 0; i < seasonsCheckboxesNodes.length; i++) {
            cloth.seasons.push(seasonsCheckboxesNodes[i].value);
        }
    },
    addStyle: () => {
        const select = document.querySelector('#styleOpt');
        const selectedStyle = select.options[select.selectedIndex].value;
        if (selectedStyle === '') {
            showError("You didn't select any style");
            return false;
        } else if (cloth.styles.indexOf(selectedStyle) !== -1) {
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
        deleteStyleBtn.addEventListener("click", (event) => deleteBtn(cloth.styles, event));
        cloth.styles.push(selectedStyle);
    },
    addColor: () => {
        const pickedColor = document.querySelector('#colorInput').value.slice(1);
        if (cloth.colors.indexOf(pickedColor) !== -1) {
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
        deleteColorBtn.addEventListener("click", (event) => deleteBtn(cloth.colors, event), false);

        cloth.colors.push(pickedColor);
    },
    addFabric: () => {
        const part = document.querySelector('#part').value;
        const fabric = document.querySelector('#fabric').value;

        let fabricObj = {};
        fabricObj[part] = fabric;

        if (cloth.fabrics.length > 0 && cloth.fabrics.some(fabricObj => fabricObj[part] === fabric)) {
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
        deleteFabricBtn.addEventListener("click", (event) => deleteBtn(cloth.fabrics, event));

        cloth.fabrics.push(fabricObj);
    },
    addLaundryIcons: () => {

    },
    getName: () => {
        cloth.name = document.getElementById('name').value
    },
    getAvailability: () => {
        cloth.availability = document.getElementById('availabilityCheck').checked
    },
    getPhoto: () => {
        cloth.photo = document.querySelector('input[name=image]').files[0];
    },
    // setItemFeatures: (feature) => {
    //     if (document.getElementById(feature).hasChildNodes()) {
    //         const featuresUls = document.getElementById(feature.toString()).children;
    //         for (const child of featuresUls) {
    //             const featureLi = child.getElementsByTagName('li');
    //             feature.push(featureLi[0].innerText);
    //             const deleteStyleBtn = child.getElementsByTagName('button');
    //             deleteStyleBtn[0].addEventListener("click", (event) => deleteBtn(feature, event));
    //         }
    //     }
    // },
    getEditedItem: () => {
        const editedItemId = document.getElementById('clothID').innerText;
        if (editedItemId !== undefined) {
            cloth.editedItem.id = editedItemId,
            cloth.editedItem.name = JSON.stringify(document.getElementById('clothName').value),
            cloth.editedItem.availability = JSON.stringify(document.getElementById('availabilityCheck').checked),
            cloth.editedItem.seasons = JSON.stringify(cloth.seasons),
            cloth.editedItem.styles = JSON.stringify(cloth.styles),
            cloth.editedItem.photo = document.getElementById('photo_'+editedItemId).src,
            cloth.editedItem.colors = JSON.stringify(cloth.colors),
            cloth.editedItem.fabrics = JSON.stringify(cloth.fabrics)
        }
        return cloth.editedItem;
    },
    isFeatureChanged: (editedValue, formValue) => {
        console.log("cloth.editedItem:", cloth.editedItem[editedValue]);
        console.log("JSON.stringify(formValue)", JSON.stringify(formValue));
        let result = (cloth.editedItem[editedValue] !== JSON.stringify(formValue));
        console.log("cloth.editedItem[editedValue] == JSON.stringify(formValue)", result)
        return result;
    },
    handleSubmit: async (event) => {
        const id = event.target.getAttribute("data-id")
        const formValue = {
            ...(id ? {id: id} : undefined),
            ...(cloth.name ? {name: cloth.name} : undefined),
            ...(cloth.availability ? {availability: cloth.availability} : undefined),
            ...(cloth.seasons ? {seasons: JSON.stringify(cloth.seasons)} : undefined),
            ...(cloth.styles ? {styles: JSON.stringify(cloth.styles)} : undefined),
            ...(cloth.photo ? {photo: cloth.photo} : undefined),
            ...(cloth.colors ? {colors: JSON.stringify(cloth.colors)} : undefined),
            ...(cloth.fabrics ? {fabrics: JSON.stringify(cloth.fabrics)} : undefined)
        };
        console.log(formValue);

       const formDataValidated = validateForm(formValue);

            let response;
            const formData  = new FormData();
            for(const name in formValue) {
                formData.append(name, formValue[name]);
              }
            
            if(id != null){
                response = await putData(`/update-cloth/${id}`, formData)
         
            } else {
                if (formDataValidated) {

                response = await postData('/add-cloth', formData)
                }
            }
        if (response.status !== 200 || response.status !== 204) {
            console.log(response);
            showError(response.error);
        }
        window.location = `/cloth-details/${id}`
    },
    
    init: () => {
        cloth.getSeasons();

        if (document.getElementById("styles").hasChildNodes()) {
            const stylesUls = document.getElementById("styles").children;
            for (const child of stylesUls) {
                const stylesLi = child.getElementsByTagName('li');
                cloth.styles.push(stylesLi[0].innerText);
                const deleteStyleBtn = child.getElementsByTagName('button');
                deleteStyleBtn[0].addEventListener("click", (event) => deleteBtn(cloth.styles, event));

            }
        }

        if (document.getElementById("colors").hasChildNodes()) {
            const colorsUls = document.getElementById("colors").children;
            for (const child of colorsUls) {
                const colorsLi = child.getElementsByTagName('li');
                cloth.colors.push(colorsLi[0].id);
                const deleteColorBtn = child.getElementsByTagName('button');
                deleteColorBtn[0].addEventListener("click", (event) => deleteBtn(cloth.colors, event));

            }
        }

        if (document.getElementById("fabrics").hasChildNodes()) {
            const fabricsUls = document.getElementById("fabrics").children;
            for (const child of fabricsUls) {
                const fabricsLi = child.getElementsByTagName('li');
                let fabricObj = {};
                fabricObj[fabricsLi[0].id] = fabricsLi[1].id;
                cloth.fabrics.push(fabricObj);
                const deleteFabricBtn = child.getElementsByTagName('button');
                deleteFabricBtn[0].addEventListener("click", (event) => deleteBtn(cloth.fabrics, event));

            }
        }
    }
}

const putData = async (url = '', data = {}) => { 
    const response = await fetch(url, {
        method: 'PUT',
        body: data 
    });

    return response.json();
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        body: data
    });
    return response.json();
 }

const deleteBtn = (arr, event) => {
    let toDelete;
    if (typeof arr[0] == "object") {
        toDelete = arr.findIndex(item => item[event.currentTarget.id.split("-")[1]]);
    }
    else {
        toDelete = arr.indexOf(event.currentTarget.id.split("-")[1]);
    }

    if (toDelete !== -1) {
        arr.splice(toDelete, 1);
        event.currentTarget.parentElement.remove();
    }
}


const validateForm = (formValue) => {
    console.log(document.querySelectorAll('input[type=checkbox]:checked'));

    if (!formValue.name || formValue.name === "") {
        showError("Please provide a cloth's name");
        return false;
    }

    if (document.querySelectorAll('input[type=checkbox]:checked').length == 0) {
        showError("Please select at least one season");
        return false;
    }

    if (formValue.styles.length === 0) {
        showError("Please select at least one style");
        return false;
    }

    // if(!formValue.image){
    //     showError("Please upload a photo");
    //     return false;  
    // }

    if (formValue.colors.length === 0) {
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

const inputName = document.querySelector('#name')
inputName.addEventListener('focusout', cloth.getName);

const availabilitySwitch = document.querySelector('#availabilityCheck');
availabilitySwitch.addEventListener("change", cloth.getAvailability);

const seasonsSection = document.querySelector('#seasons');
const seasonsCheckboxesNodes = seasonsSection.querySelectorAll('input[type=checkbox]');
for (let i = 0; i < seasonsCheckboxesNodes.length; i++) {
    seasonsCheckboxesNodes[i].addEventListener("click", cloth.getSeason);
}

const addStyleBtn = document.querySelector("#addStyleBtn");
addStyleBtn.addEventListener("click", cloth.addStyle);

const photoUploadInput = document.querySelector("#imgFile");
photoUploadInput.addEventListener("change", cloth.getPhoto);

const addColorBtn = document.querySelector("#addColorBtn");
addColorBtn.addEventListener("click", cloth.addColor);

const addFabricBtn = document.querySelector("#addFabricBtn");
addFabricBtn.addEventListener("click", cloth.addFabric);

const submitClothBtn = document.getElementById("submit");
submitClothBtn.addEventListener("click", cloth.handleSubmit);

cloth.init();
