$(document).ready(function () {
  //password toggle config
  $(document).on('click', '#showPassword', function(e){
    const passwordInput = $('#user_password');
    const isChecked = $(this).is(':checked');
    passwordInput.attr('type', isChecked ? 'text' : 'password');
  });

  $(document).off('submit', '#loginForm'); // prevent duplicate bindings
  $(document).on('submit', '#loginForm', function (e) {
    e.preventDefault(); // Prevent default form submission
  
    const loginData = {
      user_npn: $('#user_npn').val().trim(),
      user_password: $('#user_password').val().trim(),
    };
  
    const apiUrl = 'https://api1.simplyworkcrm.com/api:HC_dTCXW/portal_user/login';
  
    $.ajax({
      url: apiUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(loginData),
      success: function (response) {
        const payloadToSave = {
          npn_id: response.npn_id,
          user_id: response.user_id,
          user_type: response.user_type,
        };

        const encoded = btoa(JSON.stringify(payloadToSave)); 
        const date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;

        document.cookie = `authData=${encoded};${expires};path=/;Secure`;
        // Redirect to page-blank.html
        window.location.href = 'page-blank.html?page=dashboard';

        
      },
      error: function (xhr, status, error) {
        // Try to parse the error response body (if it's JSON)
        let message = 'Something went wrong. Please try again.';
  
        try {
          const errResponse = JSON.parse(xhr.responseText);
          if (errResponse && errResponse.message) {
            message = errResponse.message;
          }
        } catch (err) {
          console.error('Failed to parse error response:', err);
        }
  
        console.error('Login Error:', xhr.status, message);
        alert(message);
      }
    });
  });
  
   

});




// let passwordToggle;
// let passwordField; 

// document.addEventListener("DOMContentLoaded", () => {

//     document.getElementById("loginForm").addEventListener("submit", function (event) {
//         // Prevent the default form submission behavior
//         event.preventDefault();
//         // Define the form fields to collect
//         const formElements = ["user_npn", "user_password"];
//         // Collect values from the form fields
//         const formData = {};
//         formElements.forEach(field => {
//             const inputElement = document.getElementById(field);
//             if (inputElement) {
//                 formData[field] = inputElement.value.trim();
//             }
//         });
    
    
    
//         // API Endpoint
//         const apiUrl = "https://api1.simplyworkcrm.com/api:DX_C7qPf/auth/login";
//         // Send the data to the API
//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             body: JSON.stringify(formData)
//         })
    
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} - ${response.statusText}`);
//             }
//             return response.json();
//         })
    
//         .then(data => {
//             console.log("API Response:", data);
//             // If the auth token is in data.authToken, store it in localStorage
//             // You could also use sessionStorage if you want it to vanish when the tab closes.
//             if (data.VIPAPortalUser.status == "active" && data.VIPAPortalUser.user_type== "admin") {
//                 localStorage.setItem("npn", data.VIPAPortalUser.user_npn);
//                 localStorage.setItem("user_id", data.VIPAPortalUser.id);
//                 localStorage.setItem("type", data.VIPAPortalUser.user_type);
//                 localStorage.setItem("status", data.VIPAPortalUser.status);
//                 setAuth("a", data.authToken, data.auth_exp);
//                 // Redirect user to the main page (modify this URL as needed)
//                 window.location.href = "/main";
//             }else if(data.VIPAPortalUser.status == "active" && data.VIPAPortalUser.user_type== "agent"){
//                 sessionStorage.setItem("authToken", data.authToken);
//                 sessionStorage.setItem("npn", data.VIPAPortalUser.user_npn);
//                 sessionStorage.setItem("user_id", data.VIPAPortalUser.id);
//                 sessionStorage.setItem("type", data.VIPAPortalUser.user_type);
//                 sessionStorage.setItem("status", data.VIPAPortalUser.status);
    
//                 // Redirect user to the main page (modify this URL as needed)
//                 window.location.href = "/createrecord-ext";
//             }else {
//                 alert("You're access has not yet been approved, please reach out to our staff.");
//             }
    
    
    
            
    
//         })
    
//         .catch(error => {
    
//             console.error("Error submitting form:", error);
    
//             alert("Failed to login.");
    
//         });
    
//     });
// });


// function setAuth(name, value, seconds){
//     const ms = seconds * 1000;

//     const date = new Date();
//     date.setTime(date.getTime() + ms);
  
//     const expires = "expires=" + date.toUTCString();
//     document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
// }





