import { toggleListVisibility } from './scripts/toggle.js';
import { showMoreButton } from './scripts/showMore.js';
import { initializeRangeSlider } from './scripts/rangeSlider.js';
import { initializeSearch } from './scripts/search.js';
import { loadCSVData, filterReviews, resetFilters } from './scripts/dataloader.js';

document.addEventListener('DOMContentLoaded', function () {
    loadCSVData();
    toggleListVisibility();
    showMoreButton();
    initializeRangeSlider();
    initializeSearch();

    document.getElementById('apply-button').addEventListener('click', filterReviews);

    document.getElementById('reset-button').addEventListener('click', resetFilters);
});
