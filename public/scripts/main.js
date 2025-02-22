import { toggleListVisibility } from './toggle.js';
import { showMoreButton } from './showMore.js';
import { initializeRangeSlider } from './rangeSlider.js';
import { initializeSearch } from './search.js';
import { loadCSVData, filterReviews, resetFilters } from './dataloader.js';

document.addEventListener('DOMContentLoaded', function () {
    loadCSVData();
    toggleListVisibility();
    showMoreButton();
    initializeRangeSlider();
    initializeSearch();

    document.getElementById('apply-button').addEventListener('click', filterReviews);

    document.getElementById('reset-button').addEventListener('click', resetFilters);
});
