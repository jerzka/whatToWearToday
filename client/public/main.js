const productConstructor = (product) => {
    return {
        cardTitle: product.prodName,
        cardImage: product.prodPhoto,
        cardDesc: product.prodDesc,
        cardPrice: (Math.random()*10).toFixed(2),
        get quantity() {
            return this._quantity;
        },
        set quantity(value){
            this._quantity = value;
        },
        sellOne: function(evt){
            console.log("one sold");
          
            if(this.quantity > 0){
                this.quantity -= 1; 
                evt.target.textContent = `Buy one of ${this.quantity}`;  
            }
            else{
                evt.target.classList.add('disabled');
                alert("Sorry, product is not available.");
            }
        },
        populate: function() {
            this.quantity = Number((Math.random()*10).toFixed());
            this.sellOne = this.sellOne.bind(this);
        }
    }
};

function render(product){
    const container = document.getElementById("productsContainer");
    const productNode = create(product);
    container.appendChild(productNode);
}

function create(product) {
    const productCol = document.createElement("div");
    productCol.className = "td col-12 col-md-4 my-5";
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    const cardImg = document.createElement('img');
    cardImg.src = product.cardImage;
    cardImg.className = "card-img-top";
    cardImg.alt = "Photo of product"
    const cardBody = document.createElement('div');
    cardBody.className = "card-body";
    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title";
    cardTitle.textContent = product.cardTitle;
    const cardDesc = document.createElement('p');
    cardDesc.className = "card-text";
    cardDesc.textContent = product.cardDesc;
    const cardPrice = document.createElement('p');
    cardPrice.className = "card-text font-weight-bold";
    cardPrice.textContent = `${product.cardPrice} CAD`;
    const cardOrderBtn = document.createElement('a');
    cardOrderBtn.className = "btn btn-primary";
    cardOrderBtn.href = "#productsContainer";
    cardOrderBtn.textContent = `Buy one of ${product.quantity}`;
    cardOrderBtn.addEventListener("click", product.sellOne);

    productCol.appendChild(cardDiv);
    cardDiv.appendChild(cardImg);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardDesc);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(cardOrderBtn);

    return productCol;
}

// });    
// const generateHTML = (product) => {
//     return `
//             <div class="td col-12 col-md-4 my-5">
//                 <div class="card">
//                     <img id="cardImg" src="${product.cardImage}" class="card-img-top" alt="Photo of product">
//                     <div class="card-body">
//                         <h5 id="cardTitle" class="card-title">${product.cardTitle}</h5>
//                         <p id="cardDesc" class="card-text">${product.cardDesc}</p>
//                         <p id="cardPrice" class="card-text font-weight-bold">${product.cardPrice}</p>
//                         <a id="cardOrderBtn" href="#productsContainer" title="Click to buy me a coffee" class="btn btn-primary"
//                             onclick=${product.sellOne}>Buy one of ${product.quantity}</a>
//                     </div
//                 </div>
//             </td>`;
// }

const fetchProducts = async () =>{
    const productsData = await fetch("products");
    const products = await productsData.json();
    products.map((product) => {
        const fullProduct = productConstructor(product);
        fullProduct.populate();
        render(fullProduct);
    });
}

fetchProducts();
