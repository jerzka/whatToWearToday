const handleSignin = async () => {
    const formValue = {
        email: document.getElementById("emailInput").value,
        password: document.getElementById("passwordInput").value
    };

    const formDataValidated = validateSignInUpForm(formValue);

    if (formDataValidated) {
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formValue.email,
                password: formValue.password
            })
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

}

const signInButton = document.getElementById("signinBtn");
signInButton.addEventListener('click', handleSignin);

const showBtn = document.getElementById("showButton");
showBtn.addEventListener("click", showHidePassword);