function renderPagination(navContainerSelector, curPage, nextPage, prevPage, pageTotal) {
  const $ul = $(navContainerSelector).find('ul.pagination');
  $ul.empty();

  // Previous
  $ul.append(`
    <li class="page-item ${!prevPage ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${prevPage || curPage}">Previous</a>
    </li>
  `);

  // Max of 5 pages displayed around current page
  const maxPagesToShow = 5;
  const start = Math.max(1, curPage - Math.floor(maxPagesToShow / 2));
  const end = Math.min(pageTotal, start + maxPagesToShow - 1);

  for (let i = start; i <= end; i++) {
    $ul.append(`
      <li class="page-item ${i === curPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `);
  }

  // Next
  $ul.append(`
    <li class="page-item ${!nextPage ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${nextPage || curPage}">Next</a>
    </li>
  `);
}

function loadContactPage(page) {
  const npn_id = localStorage.getItem('npn_id');
  if (!npn_id) return;

  const apiUrl = 'https://api1.simplyworkcrm.com/api:HC_dTCXW/contact_data/{npn}';
  const query = $.param({
    npn_id: npn_id,
    'paging[page]': page,
    'paging[per_page]': 10, // or 30, etc.
    'paging[offset]': 0
  });

  $.get(`${apiUrl}?${query}`, function (res) {
    renderTable(res.items);
    renderPagination('#contactTBnav', res.curPage, res.nextPage, res.prevPage, res.pageTotal);
  });
}

function renderTable(contacts) {
  const $tbody = $('table tbody');
  $tbody.empty(); // Clear previous rows

  if (!Array.isArray(contacts) || contacts.length === 0) {
    $tbody.html('<tr><td colspan="7" class="text-center text-muted">No contacts found.</td></tr>');
    return;
  }

  contacts.forEach(contact => {
    const fullName = `${contact.first_name} ${contact.last_name}`;
    const state = contact.state?.split('?')[0] || '';
    const phone = contact.phone || '';
    const source = contact.lead_source || '';
    const policyCount = Array.isArray(contact.policy_data) ? contact.policy_data.length : 0;
    const rowHtml = `
      <tr>
        <!-- <td>
           <div class="custom-control custom-checkbox">
             <input type="checkbox" class="custom-control-input" id="${contact.id}">
             <label class="custom-control-label" for="${contact.id}"></label>
           </div>
         </td> --!>
        <td>
          <p class="mb-0 text-muted">
            <a href="#" class="contact-name" data-id="${contact.id}"><strong>${fullName}</strong></a>
          </p>
        </td>
        <td>
          <p class="mb-0 text-muted"><a href="#" class="text-muted">${phone}</a></p>
        </td>
        <td>
          <p class="mb-0 text-muted">${state}</p>
        </td>
        <td class="text-muted">
          <span>${source}</span>
        </td>
        <td>
          <p class="mb-0 text-muted">${policyCount}</p>
        </td>
        <td>
          <button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="text-muted sr-only">Action</span>
          </button>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#">Edit</a>
            <a class="dropdown-item" href="#">Delete</a>
          </div>
        </td>
      </tr>
    `;

    $tbody.append(rowHtml);
  });
  // Attach click handler AFTER the rows are added
  $('.contact-name').on('click', function (e) {
    e.preventDefault();
    const contactId = $(this).data('id');
    console.log(contactId);
    contactDetailLoad(contactId);
    history.pushState({ page: 'contacts' }, '', `?page=contacts_detail&id=${contactId}`);
    localStorage.setItem('lastPage', 'contacts_detail');
    // Example: load content into a div with id="main-content"
    // $('#main-content').load(`contact-detail.html?id=${contactId}`);
    
    // Alternatively, use fetch if you want more control:
    // fetch(`contact-detail.html?id=${contactId}`)
    //   .then(res => res.text())
    //   .then(html => $('#main-content').html(html));
  });
  
}



/*contact page ui script*/
$(document).ready(function () {
   //deletes the contact after confirmation
  //  $(document).on('click', '#delete_confirm', function (e) {
  //   const checkedIds = $('input[type="checkbox"]:checked')
  //     .map(function () {
  //       return this.id;
  //     })
  //     .get();
  //     console.log('✅ Checked IDs:', checkedIds);
    

  // }); 

  $(document).on('click', '#contactTBnav .page-link', function (e) {
    e.preventDefault();
    const page = parseInt($(this).data('page'));
    if (!isNaN(page)) {
      loadContactPage(page);
    }
  });

  $(document).on('change', 'input[type="checkbox"]', function () {
    const anyChecked = $('input[type="checkbox"]:checked').length > 0;
    $('#deletebtn').prop('disabled', !anyChecked);
  });

  loadContactPage(1);
});

function initPhoneMask() {
  const input = document.querySelector('#phone');
  if (input) {
    const iti = window.intlTelInput(input, {
      initialCountry: 'us',
      autoPlaceholder: 'polite',
      nationalMode: false,
      formatOnDisplay: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js"
    });

    // Wait a bit to ensure DOM is ready, then apply mask
    setTimeout(() => {
      $('#phone').mask('(000) 000-0000');
    }, 50);

    // Block letters manually
    input.addEventListener('keypress', function (e) {
      const char = String.fromCharCode(e.which);
      if (!/[0-9+ ()-]/.test(char)) {
        e.preventDefault();
      }
    });
  }
}

function initFormSubmit() {
  $(document).off('submit', '#create_contact'); // prevent duplicate bindings
  $(document).on('submit', '#create_contact', function (e) {
    e.preventDefault(); // stop the form from reloading the page
    const contactData = {
      first_name: $('#first_name').val().trim(),
      last_name: $('#last_name').val().trim(),
      phone: $('#phone').val().trim(),
      state: $('#state').val().trim(),
      birthday: $('#birthday').val(),
      lead_source: $('#lead_source').val().trim()
    };

    console.log('📦 Contact Submitted:', contactData);

    // Optionally close modal, reset form, etc.
  });
}

function contactDetailLoad(){
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



