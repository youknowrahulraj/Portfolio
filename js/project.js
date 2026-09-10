  const filters = document.querySelectorAll(".filter");
    const cards = document.querySelectorAll(".project-card");

    filters.forEach(filter => {
      filter.addEventListener("click", () => {
        filters.forEach(btn => btn.classList.remove("active"));
        filter.classList.add("active");

        const value = filter.dataset.filter;

        cards.forEach(card => {
          const categories = card.dataset.category.split(" ");
          card.style.display = value === "all" || categories.includes(value) ? "" : "none";
        });
      });
    });
    (function () {

    'use strict';

    var filterButtons = document.querySelectorAll('.filter');
    var projectCards = document.querySelectorAll('.project-card');
    var searchInput = document.getElementById('projectSearch');

    var currentFilter = 'all';
    var currentSearch = '';

    function filterProjects() {

        var visibleCount = 0;

        projectCards.forEach(function (card) {

            var categories =
                card.getAttribute('data-category') || '';

            var searchData =
                card.getAttribute('data-search') || '';

            var matchesFilter =
                currentFilter === 'all' ||
                categories.split(' ').includes(currentFilter);

            var searchTerms =
                currentSearch
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(Boolean);

            var searchableText =
                searchData.toLowerCase();

            var matchesSearch =
                searchTerms.every(function (term) {
                    return searchableText.includes(term);
                });

            var visible =
                matchesFilter && matchesSearch;

            card.style.display =
                visible ? '' : 'none';

            if (visible) {
                visibleCount++;
            }

        });

    }


    /* ===============================
       Filter Buttons
       =============================== */

    filterButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            filterButtons.forEach(function (item) {
                item.classList.remove('active');
            });

            button.classList.add('active');

            currentFilter =
                button.getAttribute('data-filter') || 'all';

            filterProjects();

        });

    });


    /* ===============================
       Search
       =============================== */

    if (searchInput) {

        searchInput.addEventListener('input', function () {

            currentSearch =
                searchInput.value.trim();

            filterProjects();

        });

    }


})();