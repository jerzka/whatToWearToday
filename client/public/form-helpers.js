export const validateSignInUpForm = (formValue) => {
  
    if ((!formValue.email || formValue.email === "")) {
      showError('Please provide an email')
      return false;
    }
    
    if (!formValue.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      showError('Please provide a valid email')
      return false;
    }
  
    if ((!formValue.password || formValue.password === "")) {
      showError('Please provide a password')
      return false;
    }
  
    return true;
}

export const showError = (errorMessage) => {
    const body = document.getElementsByTagName('body')[0]
    console.log( body)
    const randomNumber = Math.random()
    const id = `toast-${randomNumber}`
    body.insertAdjacentHTML('beforeend', `    
    <div id="${id}" class="toast errorToast position-fixed align-items-center text-bg-danger show border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                ${errorMessage}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                aria-label="Close"></button>
        </div>
    </div>`)
}

export const showHidePassword = () => {
    const icon = document.getElementById('showIcon');
    const passwordInput = document.getElementById("passwordInput");
    if (icon.classList.contains("fa-eye")){
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        passwordInput.type = "text";
    }
    else{
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
        passwordInput.type = "password";
    }
}