const handleSignup = async () => {
  const formValue = {
    email: document.getElementById("emailInput").value,
    password: document.getElementById("passwordInput").value
  };

  const formDataValidated = validateSignInUpForm(formValue)

  if(formDataValidated) {
      const response = await fetch('/signup', {
          method: 'POST', 
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name: formValue.email.split("@")[0],
              email: formValue.email,
              password: formValue.password,
          }) 
      });
      console.log(response)
      if(response.status !== 200) {
          const responseBody = await response.json()
          console.log(responseBody)
          showError(responseBody.error)
      }
      else{
            window.location = '/signin';
    
      } 
  }
}

const signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", handleSignup);

const showBtn = document.getElementById("showButton");
showBtn.addEventListener("click", showHidePassword);