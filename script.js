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
    const searchInput = document.getElementById('search-input');
    const dropdownResults = document.getElementById('search-results-dropdown');
    const appliedFiltersList = document.getElementById('applied-filters-list');
    const resetButton = document.getElementById('reset-button');
    let drugs = [
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

    let selectedIndex = -1;

    // Функция для отображения выпадающего списка
    function showDropdown(results) {
        dropdownResults.innerHTML = '';
        if (results.length > 0) {
            results.slice(0, 10).forEach(drug => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.textContent = drug;
                item.addEventListener('click', () => selectDrug(drug));
                dropdownResults.appendChild(item);
            });
            dropdownResults.style.display = 'block';
        } else {
            dropdownResults.style.display = 'none';
        }
    }

    // Функция для выбора лекарства
    function selectDrug(drug) {
        const selectedDrug = document.createElement('span');
        selectedDrug.className = 'selected-drug';
        selectedDrug.textContent = drug;
        selectedDrug.setAttribute('data-drug', drug);
        selectedDrug.addEventListener('click', () => removeDrug(drug));
    
        // Добавляем выбранный фильтр в search-input
        searchInput.appendChild(selectedDrug);
    
        // Добавляем пробел после выбранного лекарства
        const space = document.createTextNode(' ');
        searchInput.appendChild(space);
    
        // Убираем выбранное лекарство из списка
        drugs = drugs.filter(d => d !== drug);
        showDropdown(drugs);
    
        // Ставим галочку в соответствующем чекбоксе
        const checkbox = document.getElementById(drug);
        if (checkbox) {
            checkbox.checked = true;
        }
    
        // Перемещаем курсор после пробела
        const range = document.createRange();
        const selection = window.getSelection();
    
        // Устанавливаем курсор после пробела
        range.setStartAfter(space);
        range.collapse(true); // Сворачиваем диапазон до одной точки (курсора)
    
        // Очищаем текущие выделения и добавляем новый диапазон
        selection.removeAllRanges();
        selection.addRange(range);
    
        // Возвращаем фокус в поле поиска
        searchInput.focus();
    
        // Добавляем пустой текстовый узел для нового ввода
        const emptyTextNode = document.createTextNode('');
        searchInput.appendChild(emptyTextNode);
    
        // Перемещаем курсор в конец (после пустого текстового узла)
        range.setStart(emptyTextNode, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Функция для удаления лекарства
    function removeDrug(drug) {
        const selectedDrug = document.querySelector(`#search-input [data-drug="${drug}"]`);
        if (selectedDrug) {
            selectedDrug.classList.add('fade-out');
            selectedDrug.addEventListener('transitionend', () => {
                selectedDrug.remove();
            }, { once: true });
        }

        // Возвращаем лекарство в список
        if (!drugs.includes(drug)) {
            drugs.push(drug);
            drugs.sort(); // Сортируем список для удобства
        }

        // Убираем галочку в соответствующем чекбоксе
        const checkbox = document.getElementById(drug);
        if (checkbox) {
            checkbox.checked = false;
        }

        // Обновляем выпадающий список
        showDropdown(drugs);
    }

    function navigateDropdown(direction) {
        const items = dropdownResults.querySelectorAll('.dropdown-item');
        if (items.length === 0) return;
    
        // Снимаем выделение с текущего элемента
        if (selectedIndex >= 0 && selectedIndex < items.length) {
            items[selectedIndex].classList.remove('selected');
        }
    
        // Перемещаемся вверх или вниз
        if (direction === 'ArrowDown' && selectedIndex < items.length - 1) {
            selectedIndex++;
        } else if (direction === 'ArrowUp' && selectedIndex > 0) {
            selectedIndex--;
        }
    
        // Выделяем новый элемент
        if (selectedIndex >= 0 && selectedIndex < items.length) {
            items[selectedIndex].classList.add('selected');
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Обработка нажатий клавиш
    searchInput.addEventListener('keydown', (e) => {
        const items = dropdownResults.querySelectorAll('.dropdown-item');

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            navigateDropdown(e.key);
        } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < items.length) {
            e.preventDefault();
            items[selectedIndex].click();
        }
    });

    // Показываем весь список при фокусе на search input
    searchInput.addEventListener('focus', () => {
        showDropdown(drugs);
    });

    // Сбрасываем выделение при закрытии выпадающего списка
    searchInput.addEventListener('blur', () => {
        selectedIndex = -1;
        const items = dropdownResults.querySelectorAll('.dropdown-item');
        items.forEach(item => item.classList.remove('selected'));
    });

    // Обработка ввода в поисковую строку
    searchInput.addEventListener('input', function () {
        const query = searchInput.textContent.toLowerCase();
        const filteredDrugs = drugs.filter(drug => drug.toLowerCase().includes(query));
        showDropdown(filteredDrugs);
    });

    // Скрытие выпадающего списка при клике вне его
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !dropdownResults.contains(e.target)) {
            dropdownResults.style.display = 'none';
        }
    });

    // Обработка выбора чекбоксов справа
    document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const drug = this.id;
            if (this.checked) {
                if (!appliedFiltersList.querySelector(`[data-drug="${drug}"]`)) {
                    selectDrug(drug);
                }
            } else {
                removeDrug(drug);
            }
        });
    });

    // Обработка кнопки "Сбросить все"
    resetButton.addEventListener('click', function () {
        // Очищаем выбранные лекарства в поисковой строке
        searchInput.innerHTML = '';
        searchInput.textContent = '';

        // Сбрасываем чекбоксы
        document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Возвращаем все лекарства в список
        drugs = [
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

        // Обновляем выпадающий список
        showDropdown(drugs);

        // Скрываем выпадающий список
        dropdownResults.style.display = 'none';
    });

    // Синхронизация ширины выпадающего списка с search bar
    const searchBar = document.querySelector('.search-bar');
    function updateDropdownWidth() {
        if (searchBar && dropdownResults) {
            const searchBarWidth = searchBar.offsetWidth;
            dropdownResults.style.width = `${searchBarWidth}px`;
        }
    }
    updateDropdownWidth();
    window.addEventListener('resize', updateDropdownWidth);
});