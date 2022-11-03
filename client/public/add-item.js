let styles = [];
const addStyle = () => {
    const select = document.querySelector('#style');
    const selectedStyle = select.options[select.selectedIndex].value;
    const place = document.querySelector('#styles > ul');
    place.insertAdjacentHTML('beforeend', `
        <li class="list-group-item" value="${selectedStyle}">${selectedStyle}</li>
    `);
    styles.push(selectedStyle); 
    console.log(styles);
};

let colors = [];
const addColor = () => {
    const pickedColor = document.querySelector('#colorInput').value;
    const place = document.querySelector('#colors');
    place.insertAdjacentHTML('beforeend', `
        <li id=${pickedColor}  class="w-10 block text-center" style="width: 40px; height: 40px; padding:1rem; border-radius:50%; background-color: ${pickedColor}"></li>
    `);
    colors.push(pickedColor);
};


let fabrics = [];
const addFabric = () => {
    const part = document.querySelector('#part').value;
    const fabric = document.querySelector('#fabric').value;
    const place = document.querySelector('#fabrics');
    place.insertAdjacentHTML('beforeend', `    
        <li id="${part}" class="list-group-item">${part}</li>
        <li id="${fabric}"  class="list-group-item">${fabric}</li>`
    );
    let fabricObj = {};
    fabricObj[part] = fabric;

    fabrics.push(fabricObj);
    console.log((fabrics));
};

let laundryIcons = [];
const addLaundryIcons = () => {

};

const addStyleBtn = document.querySelector("#addStyleBtn");
addStyleBtn.addEventListener("click", addStyle);

const addColorBtn = document.querySelector("#addColorBtn");
addColorBtn.addEventListener("click", addColor);

const addFabricBtn = document.querySelector("#addFabricBtn");
addFabricBtn.addEventListener("click", addFabric);
 
const handleAddCloth = async () => {
    const seasonsSection = document.querySelector('#seasons');
    const seasonsCheckboxes = seasonsSection.querySelectorAll('input[type=checkbox]:checked');
    const sesonsToDB = Array.prototype.map.call(seasonsCheckboxes, ({ value }) => value);

    const styleSection = document.querySelector('#styles');
    const stylesLi = styleSection.querySelectorAll('li');
    const stylesToDB = Array.prototype.map.call(stylesLi, (item) => item.textContent);

    const formValue = {
        name: document.getElementById('clothName').value,
        availability: document.getElementById('availabilityCheck').checked,
        seasons: sesonsToDB,
        styles: stylesToDB,
        image: document.querySelector('input[name=image]').files[0],
        colors: colors,
        fabrics: fabrics
    };
    console.log(formValue);
    //const formDataValidated = validateSignInUpForm(formValue);

    if (formDataValidated = true) {
        const formData  = new FormData();
        for(const name in formValue) {
            formData.append(name, formValue[name]);
          }
        
        const response = await fetch('/add-cloth', {
            method: 'POST',
            body: formData
        });
        console.log(response)
        if (response.status !== 200) {
            const responseBody = await response.json();
            console.log(responseBody);
            showError(responseBody.error);
        }
        else {
            window.location = '/home';
        }
    }
};

const addClothBtn = document.getElementById("addCloth");
addClothBtn.addEventListener("click", handleAddCloth);