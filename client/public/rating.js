let ratingStars;
let id;
const starClassActive = "rating fa fa-star fa-lg";
const starClassInactive = "rating fa fa-star-o fa-lg";

const executeRating = (stars) => {
   let i;
   if (stars != null) {
      const starsLength = stars.length;
      stars.map((star) => {
         star.addEventListener('click', () => {
            i = stars.indexOf(star);

            if (star.className === starClassInactive) {
               for (i; i >= 0; --i) {
                  stars[i].className = starClassActive;
               }
            } else {
               for (i; i < starsLength; ++i) {
                  stars[i].className = starClassInactive;
               }
            }
         }
         )
      });
   }
}

const ratingModal = document.getElementById('ratingModal');
ratingModal.addEventListener('show.bs.modal', event => {
   const button = event.relatedTarget
   ratingStars = [...document.getElementsByClassName("rating")];

   // Extract info from data-bs-* attributes
   id = button.getAttribute('data-bs-id');
   const user = button.getAttribute('data-bs-user');
   const title = button.getAttribute('data-bs-title');

   const modalBodyTitle = ratingModal.querySelector('.modal-body h1')

   modalBodyTitle.innerHTML = `Leave your rating for <b>${title}</b> of 
                           <span class="span-bg">${user}</span>`

   rateScore = executeRating(ratingStars);

   const rateBtn = document.querySelector("#rateModalBtn");
   rateBtn.addEventListener("click", rate);

});

const rate = async () => {

   const rateScore = document.querySelectorAll(`[class="${starClassActive}"]`).length;
   const response = await fetch('/rate-outfit', {
      method: "PUT",
      headers: {
         'Content-Type': 'application/json'
     },
      body: JSON.stringify({
         id: id,
         rating: rateScore
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

};

