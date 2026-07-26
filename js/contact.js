var firstNameInput = document.getElementById("firstName");
var lastNameInput = document.getElementById("lastName");

var phoneNumberInput = document.getElementById("phoneNumber");
var emailAddressInput = document.getElementById("emailAddress"); 
var total=document.querySelectorAll("input");


var contacts =JSON.parse(localStorage.getItem("contacts"))||[];

function validateForm(element){
    var regex=
    {
        firstName:/^[\u0600-\u06FFa-zA-Z\s]{2,50}$/,
        lastName:/^[\u0600-\u06FFa-zA-Z\s]{2,50}$/,

        phoneNumber:/^01[0125][0-9]{8}$/,
        emailAddress:/^[^\s@]+@[^\s@]+\.[^\s@]{3}$/
}


if (regex[element.id].test(element.value)){
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    element.nextElementSibling.classList.add("d-none");

return true;

}
else
{
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.nextElementSibling.classList.remove("d-none");

return false;
}
    
}



function checkSweet(){
if (firstNameInput.value===""||lastNameInput.value===""|| phoneNumberInput.value===""||emailAddressInput.value===""|| validateForm(firstNameInput)===false ||validateForm(phoneNumberInput)===false ||validateForm(emailAddressInput)===false) {
  Swal.fire({
  title: 'Error!',
  text: 'Do you want to continue',
  icon: 'error',
  confirmButtonText: 'Cool'
})

return false;
}
else 
  return true;

}





function addContact() {
  if(!checkSweet()){
    return
  }
for (var i=0;i<total.length;i++)
total[i].classList.remove("is-valid");
  var contact = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,

    phoneNumber: phoneNumberInput.value,
    emailAddress: emailAddressInput.value,
   
  };

  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));

  clearInput();


Swal.fire({
  icon: "success",
  title: "Your work has been saved",
  // showConfirmButton: false,
  timer: 1500
});

}


function clearInput(){
    firstNameInput.value=null; 
    lastNameInput.value=null;  

      phoneNumberInput.value=null;
    emailAddressInput.value=null;
    
}
