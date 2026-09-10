(function () {

  'use strict';


  /* =========================================================
     Elements
     ========================================================= */

  var modal = document.getElementById('certificateModal');
  var viewer = document.getElementById('certificateViewer');
  var closeButton = document.getElementById('certificateClose');

  var certificateButtons =
    document.querySelectorAll('.view-certificate');

  var filterButtons =
    document.querySelectorAll('.cert-filter');

  var searchInput =
    document.getElementById('certificateSearch');

  var certificateCards =
    document.querySelectorAll('.certificate-card');

  var noResults =
    document.getElementById('noResults');


  /* =========================================================
     Open Certificate
     ========================================================= */

  function openCertificate(pdfPath) {

    if (!modal || !viewer) return;

    viewer.src = pdfPath;

    modal.classList.add('is-open');

    modal.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

  }


  /* =========================================================
     Close Certificate
     ========================================================= */

  function closeCertificate() {

    if (!modal || !viewer) return;

    modal.classList.remove('is-open');

    modal.setAttribute('aria-hidden', 'true');

    viewer.src = '';

    document.body.style.overflow = '';

  }


  /* =========================================================
     Certificate Buttons
     ========================================================= */

  certificateButtons.forEach(function (button) {

    button.addEventListener('click', function () {

      var pdfPath = button.getAttribute('data-pdf');

      if (pdfPath) {
        openCertificate(pdfPath);
      }

    });

  });


  /* =========================================================
     Close Button
     ========================================================= */

  if (closeButton) {

    closeButton.addEventListener('click', closeCertificate);

  }


  /* =========================================================
     Close On Background Click
     ========================================================= */

  if (modal) {

    modal.addEventListener('click', function (event) {

      if (event.target === modal) {
        closeCertificate();
      }

    });

  }


  /* =========================================================
     Close On Escape
     ========================================================= */

  document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {
      closeCertificate();
    }

  });


  /* =========================================================
     Filter + Search
     ========================================================= */

  var currentFilter = 'all';
  var currentSearch = '';


  function filterCertificates() {

    var visibleCount = 0;

    certificateCards.forEach(function (card) {

      var category =
        card.getAttribute('data-category') || '';

      // var name =
      //   card.getAttribute('data-name') || '';

      var matchesFilter =
        currentFilter === 'all' ||
        category === currentFilter;

      var name =
        card.getAttribute('data-name') || '';

      var searchTerms =
        currentSearch.toLowerCase().split(/\s+/).filter(Boolean);

      var searchableText =
        name.toLowerCase();

      var matchesSearch =
        searchTerms.every(function (term) {
          return searchableText.includes(term);
        });

      var visible =
        matchesFilter && matchesSearch;

      card.style.display =
        visible ? 'flex' : 'none';

      if (visible) {
        visibleCount++;
      }

    });


    if (noResults) {

      noResults.style.display =
        visibleCount === 0 ? 'block' : 'none';

    }

  }


  /* =========================================================
     Category Buttons
     ========================================================= */

  filterButtons.forEach(function (button) {

    button.addEventListener('click', function () {

      filterButtons.forEach(function (item) {

        item.classList.remove('active');

      });

      button.classList.add('active');

      currentFilter =
        button.getAttribute('data-filter') || 'all';

      filterCertificates();

    });

  });


  /* =========================================================
     Search
     ========================================================= */

  if (searchInput) {

    searchInput.addEventListener('input', function () {

      currentSearch =
        searchInput.value.trim();

      filterCertificates();

    });

  }


})();