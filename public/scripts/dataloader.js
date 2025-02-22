// Подгружаем данные
export let reviewsData = [];

export function resetFilters() {
    // Сброс фильтров: чекбоксов, диапазона дат, поиска
    document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Сброс диапазона дат
    document.getElementById('input-min').value = 2000;
    document.getElementById('input-max').value = 2025;
    rangeSlider.noUiSlider.set([2000, 2025]);

    // Сброс поиска
    document.querySelector('.search-bar').value = '';

    // Обновление таблицы с полными данными
    updateTable(reviewsData);
}

export function loadCSVData() {
    Papa.parse("../data/results.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            reviewsData = results.data;
            console.log("Data loaded:", reviewsData);
            filterReviews();  // При загрузке данных сразу применяем фильтры
        }
    });
}

// Фильтрация данных
export function filterReviews() {
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

    updateTable(filteredReviews);  // Обновляем таблицу с отфильтрованными данными
}

// Обновляет таблицу на основе отфильтрованных данных
export function updateTable(filteredReviews) {
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
