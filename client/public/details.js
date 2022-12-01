const deleteItem = async (e) => {
    const id = e.target.getAttribute('data-id');

    const response = await fetch(`/cloth-details/${id}`, {
        method: 'DELETE',
    });
    if (response.status !== 200 || response.status !== 204) {
        showError(response.error);
    }
    window.location = '/home'
}

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


const deleteItemBtn = document.querySelector("#deleteItem");
deleteItemBtn.addEventListener("click", deleteItem);
