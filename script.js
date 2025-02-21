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
    const rangeSlider = document.getElementById('range-slider');
    const inputMin = document.getElementById('input-min');
    const inputMax = document.getElementById('input-max');

    // Инициализация noUiSlider
    noUiSlider.create(rangeSlider, {
        start: [2000, 2025], // Начальные значения
        connect: true, // Оранжевая полоса между ползунками
        range: {
            'min': 2000,
            'max': 2025
        },
        step: 1 // Шаг
    });

    // Обновление текстовых полей при изменении ползунков
    rangeSlider.noUiSlider.on('update', (values) => {
        inputMin.value = Math.round(values[0]);
        inputMax.value = Math.round(values[1]);
    });

    // Обновление ползунков при изменении текстовых полей
    inputMin.addEventListener('input', () => {
        const min = parseInt(inputMin.value);
        const max = parseInt(inputMax.value);

        if (min > max) {
            inputMin.value = max; // Корректируем, если min > max
        }
        rangeSlider.noUiSlider.set([min, null]);
    });

    inputMax.addEventListener('input', () => {
        const min = parseInt(inputMin.value);
        const max = parseInt(inputMax.value);

        if (max < min) {
            inputMax.value = min; // Корректируем, если max < min
        }
        rangeSlider.noUiSlider.set([null, max]);
    });
});