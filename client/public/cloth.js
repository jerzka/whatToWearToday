const cloth = {
    name: undefined,
    availability: undefined,
    seasons: [],
    styles: [],
    photos: [],
    colors: [],
    fabrics: [],
    laundryIcons: [],
    editedItem: {},

    setSeason: (event) => {
        const value = event.target.value;

        if (event.target.checked) {
            cloth.seasons.push(value);
        }
        else {
            const indexToRemove = cloth.seasons.indexOf(value);
            if (indexToRemove > -1) {
                cloth.seasons.splice(indexToRemove, 1);
            }
        }
        console.log(cloth.seasons);
    },
    getSeasons: () => {
        cloth.seasons = [];
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
            <ul class="list-group-custom col p-0 justify-content-center">
                <li class="list-group-item" id="${selectedStyle}">${selectedStyle}</li>
                <button id="delete_${selectedStyle}" type="button" class="btn btn-delete btn-primary">
                    <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
                </button>
            </ul`);
        const deleteStyleBtn = document.querySelector(`#delete_${selectedStyle}`);
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
                <button id="delete_${pickedColor}" type="button" class="btn btn-delete btn-primary">
                    <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
                </button>
            </ul>`);
        const deleteColorBtn = document.querySelector(`#delete_${pickedColor}`);
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
                <button id="delete_${part}" type="button" class="btn btn-delete btn-primary">
                    <i class="fa fa-minus fa-lg text-white" aria-hidden="true"></i>
                </button>
            </ul>`
        );
        const deleteFabricBtn = document.querySelector(`#delete_${part}`);
        deleteFabricBtn.addEventListener("click", (event) => deleteBtn(cloth.fabrics, event));

        cloth.fabrics.push(fabricObj);
    },
    addLaundryIcons: () => {

    },
    setName: () => {
        const newValue = document.getElementById('name').value;
        if (cloth.isFeatureChanged(cloth.editedItem.name, newValue)) {
            cloth.name = newValue;
        }
    },
    setAvailability: () => {
        const newValue = document.getElementById('availabilityCheck').checked
        if (cloth.isFeatureChanged(cloth.editedItem.availability, newValue)) {
            cloth.availability = newValue;
        }
    },
    setPhoto: () => {
       const newValue = document.querySelector('input[name=image]').files[0];
        if (cloth.isFeatureChanged(cloth.editedItem.photo, newValue)) {
            cloth.photos = newValue;
        }
        console.log(cloth.photos)

    },
    getEditedItem: () => {
        cloth.editedItem.name = JSON.stringify(document.getElementById('name').value),
            cloth.editedItem.availability = JSON.stringify(document.getElementById('availabilityCheck').checked),
            cloth.editedItem.seasons = JSON.stringify(cloth.seasons),
            cloth.editedItem.styles = JSON.stringify(cloth.styles),
            cloth.editedItem.photo = document.getElementById('photo').src,
            cloth.editedItem.colors = JSON.stringify(cloth.colors),
            cloth.editedItem.fabrics = JSON.stringify(cloth.fabrics)
        return cloth.editedItem;
    },
    isFeatureChanged: (editedValue, formValue) => {
         console.log("cloth.editedItem:", editedValue);
        console.log("JSON.stringify(formValue)", JSON.stringify(formValue));
        return (editedValue !== JSON.stringify(formValue));
    },
    handleSubmit: async (event) => {
        const id = event.target.getAttribute("data-id");

        const formDataValidated = validateForm(cloth);

        if (formDataValidated) {

            const formValue = {
                ...(cloth.name ? { name: cloth.name } : undefined),
                ...(cloth.availability ? { availability: cloth.availability } : undefined),
                ...(cloth.isFeatureChanged(cloth.editedItem.seasons, cloth.seasons) ? { seasons: cloth.seasons } : undefined),
                ...(cloth.isFeatureChanged(cloth.editedItem.styles, cloth.styles) ? { styles: cloth.styles } : undefined),
                ...(cloth.isFeatureChanged(cloth.editedItem.colors, cloth.colors) ? { colors: cloth.colors } : undefined),
                ...(cloth.isFeatureChanged(cloth.editedItem.fabrics, cloth.fabrics) ? { fabrics: cloth.fabrics } : undefined)
            };
            console.log(formValue);

            let response;
            const formData = new FormData();
            for (const name in formValue) {
                formData.append(name, JSON.stringify(formValue[name]));
            }
            if (document.querySelector('input[name=image]').files[0] != null) {
                formData.append("photo", document.querySelector('input[name=image]').files[0]);
            }

            if (id != null) {
                response = await putData(`/update-cloth/${id}`, formData)

            } else {
                    response = await postData('/add-cloth', formData)
                }
            
            window.location = `/cloth-details/${id}`
        }
    },

    setItemFeatures: (feature) => {
        if (document.getElementById(feature).hasChildNodes()) {
            const featuresUls = document.getElementById(feature).children;
            for (const child of featuresUls) {
                const featureLi = child.getElementsByTagName('li');
                if (feature == "fabrics") {
                    let fabricObj = {};
                    fabricObj[featureLi[0].id] = featureLi[1].id;
                    cloth.fabrics.push(fabricObj);
                }
                else {
                    cloth[feature].push(featureLi[0].id);
                }
                const deleteStyleBtn = child.getElementsByTagName('button');
                deleteStyleBtn[0].addEventListener("click", (event) => deleteBtn(cloth[feature], event));
            }
        }
    },

    init: () => {
        if (window.location.pathname.split('/').length > 2) {
            cloth.getSeasons();
            cloth.setItemFeatures("styles");
            cloth.setItemFeatures("photos");
            cloth.setItemFeatures("colors");
            cloth.setItemFeatures("fabrics");
            cloth.editedItem = cloth.getEditedItem();
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
        toDelete = arr.findIndex(item => item[event.currentTarget.id.split("_")[1]]);
    }
    else {
        toDelete = arr.indexOf(event.currentTarget.id.split("_")[1]);
    }

    if (toDelete !== -1) {
        arr.splice(toDelete, 1);
        event.currentTarget.parentElement.remove();
    }

    console.log(cloth.photos)

}


const validateForm = (formValue) => {
    console.log(document.querySelectorAll('input[type=checkbox]:checked'));

    if ((!formValue.name || formValue.name === "") && !cloth.editedItem.name) {
        showError("Please provide a cloth's name");
        return false;
    }

    if (formValue.seasons.length == 0) {
        showError("Please select at least one season");
        return false;
    }

    if (formValue.styles.length == 0) {
        showError("Please select at least one style");
        return false;
    }

    if(!formValue.image && formValue.photos.length == 0){
        showError("Please upload a photo");
        return false;  
    }

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
inputName.addEventListener('focusout', cloth.setName);

const availabilitySwitch = document.querySelector('#availabilityCheck');
availabilitySwitch.addEventListener("change", cloth.setAvailability);

const seasonsSection = document.querySelector('#seasons');
const seasonsCheckboxesNodes = seasonsSection.querySelectorAll('input[type=checkbox]');
for (let i = 0; i < seasonsCheckboxesNodes.length; i++) {
    seasonsCheckboxesNodes[i].addEventListener("click", cloth.setSeason);
}

const addStyleBtn = document.querySelector("#addStyleBtn");
addStyleBtn.addEventListener("click", cloth.addStyle);

const photoUploadInput = document.querySelector("#imgFile");
photoUploadInput.addEventListener("change", cloth.setPhoto);

const addColorBtn = document.querySelector("#addColorBtn");
addColorBtn.addEventListener("click", cloth.addColor);

const addFabricBtn = document.querySelector("#addFabricBtn");
addFabricBtn.addEventListener("click", cloth.addFabric);

const submitClothBtn = document.getElementById("submit");
submitClothBtn.addEventListener("click", cloth.handleSubmit);

cloth.init();
