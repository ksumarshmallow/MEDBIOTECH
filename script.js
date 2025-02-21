document.addEventListener('DOMContentLoaded', function () {
    // Логика для сворачивания/разворачивания списков
    const toggleArrows = document.querySelectorAll('.toggle-arrow');

    toggleArrows.forEach(toggleArrow => {
        const checkboxGroup = toggleArrow.closest('.d-flex').nextElementSibling;

        if (checkboxGroup && checkboxGroup.classList.contains('checkbox-group')) {
            toggleArrow.addEventListener('click', () => {
                const icon = toggleArrow.querySelector('i');

                if (checkboxGroup.style.display === 'none') {
                    checkboxGroup.style.display = 'block';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    checkboxGroup.style.display = 'none';
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        }
    });

    // Логика для кнопок "Еще"
    const btnShowMoreList = document.querySelectorAll('.btn-show-more');

    btnShowMoreList.forEach(btnShowMore => {
        const hiddenOptions = btnShowMore.previousElementSibling;

        if (hiddenOptions && hiddenOptions.classList.contains('hidden-options')) {
            btnShowMore.addEventListener('click', () => {
                if (hiddenOptions.style.display === 'none' || hiddenOptions.style.display === '') {
                    hiddenOptions.style.display = 'block';
                    btnShowMore.textContent = 'Скрыть';
                } else {
                    hiddenOptions.style.display = 'none';
                    btnShowMore.textContent = 'Еще';
                }
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Логика для скрытия/показа фильтра дат
    const toggleArrowDate = document.querySelector('.date-filter .toggle-arrow');
    const dateFilter = document.querySelector('.date-filter');

    if (toggleArrowDate && dateFilter) {
        toggleArrowDate.addEventListener('click', () => {
            const icon = toggleArrowDate.querySelector('i');

            if (dateFilter.style.display === 'none') {
                dateFilter.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                dateFilter.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }

    // Логика для выбора диапазона дат
    const rangeMin = document.getElementById('range-min');
    const rangeMax = document.getElementById('range-max');
    const selectedRange = document.querySelector('.selected-range');

    if (rangeMin && rangeMax && selectedRange) {
        // Функция для обновления текста диапазона
        const updateRangeText = () => {
            const min = rangeMin.value;
            const max = rangeMax.value;
            selectedRange.textContent = `с ${min} по ${max} год`;
        };

        // Обработчики событий для ползунков
        rangeMin.addEventListener('input', () => {
            if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
                rangeMin.value = rangeMax.value;
            }
            updateRangeText();
        });

        rangeMax.addEventListener('input', () => {
            if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
                rangeMax.value = rangeMin.value;
            }
            updateRangeText();
        });

        // Инициализация текста диапазона
        updateRangeText();
    }
});