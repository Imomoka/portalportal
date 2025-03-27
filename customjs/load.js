//check if current param on !back and forward browser btn
window.addEventListener('popstate', function (event) {
  const page = new URLSearchParams(window.location.search).get('page');
  if (page === 'contacts') {
    contactload();
  } else if(page === 'contacts_detail'){
    contactdetailLoad();
  } 
  else {
    // Handle other pages or reset
    $('#main').html('');
  }
});



$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const currentPage = params.get('page');
  //check if current param after !reload
  if (currentPage === 'contacts') {
    contactload();
  } else if(currentPage === 'contacts_detail'){
    contactdetailLoad();
  }

  //loadcontact click event
  $(document).on('click', '#loadcontacts', function (e) {
    e.preventDefault();
    // Update the URL
    history.pushState({ page: 'contacts' }, '', '?page=contacts');
    localStorage.setItem('lastPage', 'contacts');
    contactload();
  });

  

});


function contactload(){
  //refresh nav
  $('.active').removeClass('active');
  $('#loadcontacts').addClass('active');

  $('#main').load('general_pages/contacts.html #contacts', function (response, status) {
    if (status === 'success') {
      $.getScript('customjs/contact-script.js')
        .done(function () {
          initPhoneMask();     // from contact-script.js
          initFormSubmit();    // now lives in contact-script.js ✅
        })
        .fail(function () {
          console.error('❌ Failed to load contact-script.js');
        });
    }
  });
}

function contactdetailLoad(){
  $('.active').removeClass('active');
  $('#loadcontacts').addClass('active');
  $('#main').load('general_pages/contact-detail.html #details', function (response, status) {
    if (status === 'success') {
      // $.getScript('customjs/contact-script.js')
      //   .done(function () {
      //     initPhoneMask();     // from contact-script.js
      //     initFormSubmit();    // now lives in contact-script.js ✅
      //   })
      //   .fail(function () {
      //     console.error('❌ Failed to load contact-script.js');
      //   });
    }
  });
}

function getDecodedAuthCookie() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('authData='));
  if (!cookie) return null;

  try {
    const encoded = cookie.split('=')[1];
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('Failed to decode auth cookie:', err);
    return null;
  }
}

// Example usage
const auth = getDecodedAuthCookie();
console.log('🔓 Auth:', auth);



