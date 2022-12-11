const deleteItem = async (e) => {
    const id = e.target.parentElement.getAttribute('data-id');

    const response = await fetch(`/outfit-list/${id}`, {
        method: 'DELETE',
    });
    if (response.status !== 200 || response.status !== 204) {
        showError(response.error);
    }
    window.location = '/outfit-list'
}

const deleteBtns = document.querySelectorAll("button[name=delete]");

for(const btn of deleteBtns){
    btn.addEventListener('click', deleteItem);
}

