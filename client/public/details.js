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

const deleteItemBtn = document.querySelector("#deleteItem");
deleteItemBtn.addEventListener("click", deleteItem);
