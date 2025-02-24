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

        // Сброс чекбоксов
        document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Обновление таблицы сразу после сброса
        filterReviews();
        loadCSVData()
    });
});

// ------------------------------------------
// Поиск
// ------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    let drugs = [
        'Авиандр', 'Алимемазин и синонимы', 'Андипал', 'Афобазол',
        'Баета', 'Инозин Пранобекс', 'Нейромексол', 'Радия-223 хлорид', 'Эсциталопрам'
    ];

    const toggleDropdownButton = document.getElementById('toggle-dropdown');
    const dropdownResults = document.getElementById('search-results-dropdown');
    const selectedDrugsContainer = document.getElementById('selected-drugs');
    const searchBar = document.querySelector('.search-bar');
    const resetButton = document.getElementById('reset-button');
    let selectedIndex = -1;

    // Сброс всех фильтров
    resetButton.addEventListener('click', () => {
        // Удаление всех отображенных выбранных препаратов
        document.querySelectorAll('.selected-drug').forEach(selectedDrug => {
            selectedDrug.remove();
        });

        // Сброс всех чекбоксов в фильтре
        document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Перезагрузка таблицы с полными данными
        updateTable(reviewsData);

        renderDropdown();
    });

    function renderDropdown() {
        dropdownResults.innerHTML = drugs.map(drug =>
            `<div class="dropdown-item">${drug}</div>`
        ).join('');
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => selectDrug(item.textContent));
        });
    }

    function toggleDropdown(show = true) {
        dropdownResults.style.display = show ? 'block' : 'none';
        if (show) renderDropdown();
    }

    function selectDrug(drug) {
        if (!drugs.includes(drug)) return;

        const selectedDrug = document.createElement('span');
        selectedDrug.className = 'selected-drug';
        selectedDrug.textContent = drug;
        selectedDrug.addEventListener('click', () => removeDrug(drug));
        selectedDrugsContainer.appendChild(selectedDrug);

        const checkbox = document.getElementById(drug);
        if (checkbox) checkbox.checked = true;

        drugs = drugs.filter(d => d !== drug);
        renderDropdown();
        toggleDropdown(false);
    }

    function removeDrug(drug) {
        const selectedDrug = [...selectedDrugsContainer.children].find(el => el.textContent === drug);
        if (selectedDrug) selectedDrug.remove();

        const checkbox = document.getElementById(drug);
        if (checkbox) checkbox.checked = false;

        if (!drugs.includes(drug)) {
            drugs.push(drug);
            drugs.sort();
        }
        renderDropdown();
    }

    toggleDropdownButton.addEventListener('click', () => toggleDropdown(dropdownResults.style.display !== 'block'));

    document.addEventListener('keydown', (e) => {
        const items = [...dropdownResults.querySelectorAll('.dropdown-item')];
        if (!items.length) return;
        
        if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) e.preventDefault();
        if (e.key === 'ArrowDown' && selectedIndex < items.length - 1) selectedIndex++;
        if (e.key === 'ArrowUp' && selectedIndex > 0) selectedIndex--;
        if (e.key === 'Enter' && selectedIndex >= 0) items[selectedIndex].click();

        items.forEach((item, index) => item.classList.toggle('selected', index === selectedIndex));
    });

    document.addEventListener('click', (e) => {
        if (![toggleDropdownButton, dropdownResults, searchBar].some(el => el.contains(e.target))) {
            toggleDropdown(false);
        }
    });

    document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            this.checked ? selectDrug(this.id) : removeDrug(this.id);
        });
    });

    function updateDropdownWidth() {
        dropdownResults.style.width = `${searchBar.offsetWidth}px`;
    }

    updateDropdownWidth();
    window.addEventListener('resize', updateDropdownWidth);
});

// ---------------------------------------------------
// ПОДГРУЖАЕМ ДАННЫЕ
// ---------------------------------------------------
let reviewsData = [];

function loadCSVData() {
    Papa.parse("data/results.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            reviewsData = results.data;
            console.log("Data loaded:", reviewsData);
            filterReviews();
        }
    });
}

// Адаптируем фильтрацию
function filterReviews() {
    const selectedDrugs = Array.from(document.querySelectorAll('.checkbox-group .form-check-input:checked')).map(checkbox => checkbox.id);
    const selectedSources = Array.from(document.querySelectorAll('.checkbox-group .orange-checkbox:checked')).map(checkbox => checkbox.id);
    const minYear = parseInt(document.getElementById('input-min').value);
    const maxYear = parseInt(document.getElementById('input-max').value);

    const filteredReviews = reviewsData.filter(review => {
        const matchesDrug = selectedDrugs.length === 0 || selectedDrugs.includes(review.Лекарство);
        const matchesSource = selectedSources.length === 0 || selectedSources.includes(review.Источник);
        const matchesYear = review.Год >= minYear && review.Год <= maxYear;

        return matchesDrug && matchesSource && matchesYear;
    });

    updateTable(filteredReviews);
}

// Обновляет таблицу на основе отфиьлтрованных данных
function updateTable(filteredReviews) {
    const searchResults = document.getElementById('search-results');
    const tableBody = document.querySelector('#reviews-table tbody');
    tableBody.innerHTML = ''; // Очищаем таблицу перед обновлением

    // Если отзывов нет, показываем сообщение
    if (filteredReviews.length === 0) {
        searchResults.innerHTML = `<p>Нет результатов, соответствующих фильтрам.</p>`;
        return;
    }

    // Собираем все симптомы в один массив
    const allSymptoms = filteredReviews.flatMap(review => review.Симптомы.split(';'));

    // Удаляем дубликаты и считаем уникальные симптомы
    const uniqueSymptoms = [...new Set(allSymptoms.map(symptom => symptom.trim()))];
    const totalUniqueSymptoms = uniqueSymptoms.length;

    // Добавляем строки в таблицу
    filteredReviews.forEach(review => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${review.Лекарство}</td>
            <td>${review.Источник}</td>
            <td>${review.НР}</td>
            <td>${review.Симптомы}</td>
            <td>${review.Год}</td>
        `;
        tableBody.appendChild(row);
    });

    // Обновляем статистику
    document.getElementById('total-reviews').textContent = filteredReviews.length;
    document.getElementById('total-symptoms').textContent = totalUniqueSymptoms;
    document.getElementById('reset-button').addEventListener('click', function () {
        
        // Сброс чекбоксов
        document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });
    
        // Сброс диапазона дат
        document.getElementById('input-min').value = 2000;
        document.getElementById('input-max').value = 2025;
        rangeSlider.noUiSlider.set([2000, 2025]);
    
        // Отображение всех данных (без фильтрации)
        updateTable(reviewsData);
    });

    // Показываем таблицу и статистику
    searchResults.innerHTML = `
        <div id="results-summary">
            <p>Всего отзывов: <span id="total-reviews">${filteredReviews.length}</span></p>
            <p>Всего симптомов: <span id="total-symptoms">${totalUniqueSymptoms}</span></p>
        </div>
        <table id="reviews-table" class="table">
            <thead>
                <tr>
                    <th>Лекарство</th>
                    <th>Источник</th>
                    <th>НР</th>
                    <th>Симптомы</th>
                    <th>Год</th>
                </tr>
            </thead>
            <tbody>
                ${filteredReviews.map(review => `
                    <tr>
                        <td>${review.Лекарство}</td>
                        <td>${review.Источник}</td>
                        <td>${review.НР}</td>
                        <td>${review.Симптомы}</td>
                        <td>${review.Год}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

document.getElementById('apply-button').addEventListener('click', filterReviews);
document.addEventListener('DOMContentLoaded', function () {
    loadCSVData(); // Загружаем данные из CSV
});