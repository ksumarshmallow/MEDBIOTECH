// ----------------------------------------------
// Разворачивание списка и кнопка еще 
// ----------------------------------------------

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

// ------------------------
// Диапазон Дат
// ------------------------
document.addEventListener('DOMContentLoaded', function () {
    const rangeSlider = document.getElementById('range-slider');
    const inputMin = document.getElementById('input-min');
    const inputMax = document.getElementById('input-max');
    const resetButton = document.getElementById('reset-button');

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

    // Функция для проверки и корректировки значений
    const validateInput = (input, isMin) => {
        let value = parseInt(input.value);

        // Если значение пустое или NaN, устанавливаем минимальное/максимальное значение по умолчанию
        if (isNaN(value)) {
            value = isMin ? 2000 : 2025;
        }

        // Проверка на допустимые значения
        if (value < 2000) value = 2000;
        if (value > 2025) value = 2025;

        // Корректировка, если min > max или max < min
        if (isMin) {
            const max = parseInt(inputMax.value);
            if (value > max) value = max;
        } else {
            const min = parseInt(inputMin.value);
            if (value < min) value = min;
        }

        // Обновляем значение в поле
        input.value = value;

        // Обновляем ползунки
        if (isMin) {
            rangeSlider.noUiSlider.set([value, null]);
        } else {
            rangeSlider.noUiSlider.set([null, value]);
        }
    };

    // Проверка и корректировка при потере фокуса (для текстового ввода)
    inputMin.addEventListener('blur', () => validateInput(inputMin, true));
    inputMax.addEventListener('blur', () => validateInput(inputMax, false));

    // Проверка и корректировка при изменении значения с помощью стрелочек
    inputMin.addEventListener('input', (e) => {
        // Проверяем, было ли изменение вызвано стрелочками
        if (e.inputType === "insertText" || e.inputType === "deleteContentBackward") {
            // Если это текстовый ввод, ничего не делаем
            return;
        }
        // Если это стрелочки, сразу обновляем
        validateInput(inputMin, true);
    });
    inputMax.addEventListener('input', (e) => {
        // Проверяем, было ли изменение вызвано стрелочками
        if (e.inputType === "insertText" || e.inputType === "deleteContentBackward") {
            // Если это текстовый ввод, ничего не делаем
            return;
        }
        // Если это стрелочки, сразу обновляем
        validateInput(inputMax, false);
    });

    // Сброс всех фильтров
    resetButton.addEventListener('click', () => {
        // Сброс текстовых полей
        inputMin.value = 2000;
        inputMax.value = 2025;

        // Сброс ползунков
        rangeSlider.noUiSlider.set([2000, 2025]);
    });
});

// ------------------------------------------
// Поиск
// ------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const drugs = [
        'Авиандр',
        'Алимемазин и синонимы',
        'Андипал',
        'Афобазол',
        'Баета',
        'Инозин Пранобекс',
        'Нейромексол',
        'Радия-223 хлорид',
        'Эсциталопрам'
    ];

    const toggleDropdownButton = document.getElementById('toggle-dropdown');
    const dropdownResults = document.getElementById('search-results-dropdown');
    const selectedDrugsContainer = document.getElementById('selected-drugs');
    const searchBar = document.querySelector('.search-bar'); // Добавлено определение searchBar
    let selectedIndex = -1;

    // Функция для отображения выпадающего списка
    function showDropdown() {
        dropdownResults.innerHTML = '';
        drugs.forEach(drug => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = drug;
            item.addEventListener('click', () => selectDrug(drug));
            dropdownResults.appendChild(item);
        });
        dropdownResults.style.display = 'block';
    }

    // Функция для скрытия выпадающего списка
    function hideDropdown() {
        dropdownResults.style.display = 'none';
    }

    // Функция для выбора лекарства
    function selectDrug(drug) {
        // Проверяем, является ли выбранный элемент лекарством
        if (drugs.includes(drug)) {
            // Добавляем лекарство в список выбранных
            const selectedDrug = document.createElement('span');
            selectedDrug.className = 'selected-drug';
            selectedDrug.textContent = drug;
            selectedDrug.addEventListener('click', () => removeDrug(drug));
            selectedDrugsContainer.appendChild(selectedDrug);

            // Отмечаем соответствующий чекбокс
            const checkbox = document.getElementById(drug);
            if (checkbox) {
                checkbox.checked = true;
            }

            // Убираем выбранное лекарство из списка
            const index = drugs.indexOf(drug);
            if (index !== -1) {
                drugs.splice(index, 1);
            }

            // Скрываем выпадающий список
            hideDropdown();
        }
    }

    // Функция для удаления лекарства
    function removeDrug(drug) {
        // Удаляем лекарство из списка выбранных
        const selectedDrug = Array.from(selectedDrugsContainer.children).find(
            el => el.textContent === drug
        );
        if (selectedDrug) {
            selectedDrug.remove();
        }

        // Снимаем отметку с соответствующего чекбокса
        const checkbox = document.getElementById(drug);
        if (checkbox) {
            checkbox.checked = false;
        }

        // Возвращаем лекарство в список
        if (!drugs.includes(drug)) {
            drugs.push(drug);
            drugs.sort();
        }
    }

    // Обработчик для кнопки открытия/закрытия выпадающего списка
    toggleDropdownButton.addEventListener('click', function () {
        if (dropdownResults.style.display === 'block') {
            hideDropdown();
        } else {
            showDropdown();
        }
    });

    // Обработчик для search-bar
    searchBar.addEventListener('click', function () {
        if (dropdownResults.style.display === 'block') {
            hideDropdown();
        } else {
            showDropdown();
        }
    });

    // Обработчик для перемещения по списку с помощью стрелочек
    document.addEventListener('keydown', function (e) {
        const items = dropdownResults.querySelectorAll('.dropdown-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < items.length - 1) {
                selectedIndex++;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                selectedIndex--;
            }
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            items[selectedIndex].click();
        }

        // Выделяем текущий элемент
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    });

    // Скрытие выпадающего списка при клике вне его
    document.addEventListener('click', function (e) {
        if (!toggleDropdownButton.contains(e.target) && !dropdownResults.contains(e.target) && !searchBar.contains(e.target)) {
            hideDropdown();
        }
    });

    // Обработчик для чекбоксов
    document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const drug = this.id;
    
            // Проверяем, является ли выбранный элемент лекарством
            if (drugs.includes(drug)) {
                if (this.checked) {
                    // Если чекбокс отмечен, добавляем лекарство
                    if (!Array.from(selectedDrugsContainer.children).some(el => el.textContent === drug)) {
                        selectDrug(drug);
                    }
                } else {
                    // Если чекбокс снят, удаляем лекарство
                    removeDrug(drug);
                }
            }
        });
    });

    // Функция для обновления ширины выпадающего списка
    function updateDropdownWidth() {
        const searchBar = document.querySelector('.search-bar');
        const dropdownResults = document.getElementById('search-results-dropdown');

        if (searchBar && dropdownResults) {
            const searchBarWidth = searchBar.offsetWidth;
            dropdownResults.style.width = `${searchBarWidth}px`;
        }
    }

    // Вызов функции при загрузке страницы и изменении размера окна
    updateDropdownWidth();
    window.addEventListener('resize', updateDropdownWidth);
});