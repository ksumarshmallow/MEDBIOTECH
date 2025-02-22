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
    const selectedDrugs = Array.from(
        document.querySelectorAll('.checkbox-group .form-check-input:checked')
    ).map(checkbox => checkbox.id);

    const selectedSources = Array.from(
        document.querySelectorAll('.checkbox-group[data-category="sources"] .orange-checkbox:checked')
    ).map(checkbox => checkbox.id);

    const selectedCatSymptoms = Array.from(
        document.querySelectorAll('.checkbox-group[data-category="categories"] .orange-checkbox:checked')
    ).map(checkbox => checkbox.id);

    const minYear = parseInt(document.getElementById('input-min').value);
    const maxYear = parseInt(document.getElementById('input-max').value);

    const filteredReviews = reviewsData.filter(review => {
        const matchesDrug = selectedDrugs.length === 0 || selectedDrugs.includes(review.Лекарство);
        const matchesSource = selectedSources.length === 0 || selectedSources.includes(review.Источник);
        const matchesYear = review.Год >= minYear && review.Год <= maxYear;
        const reviewCatSymptoms = review.НР.split('; ').map(source => source.trim());
        const matchesCatSymptoms = selectedCatSymptoms.length === 0 || 
                                  selectedCatSymptoms.some(cat => reviewCatSymptoms.includes(cat));
        
        // console.log(`${selectedCatSymptoms}, ${reviewCatSymptoms.some(source => source.includes(selectedCatSymptoms))}`)
        // console.log(`Отзыв: ${review.Лекарство}, Источник: ${review.Источник}, Год: ${review.Год}, НР: ${reviewCatSymptoms}`);

        return matchesDrug && matchesSource && matchesYear && matchesCatSymptoms;
    });

    updateTable(filteredReviews);  // Обновляем таблицу с отфильтрованными данными
}

// Обновляет таблицу на основе отфильтрованных данных
export function updateTable(filteredReviews) {
    const searchResults = document.getElementById('search-results');

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
    console.log(`${uniqueSymptoms}`)

    const uniqueSources = [...new Set(filteredReviews.map(review => review.Источник))];
    const totalSources = uniqueSources.length;

    const allCategories = filteredReviews.flatMap(review => review.НР.split(';'));
    const uniqueCategories = [...new Set(allCategories.map(cat => cat.trim()))];
    const totalCategories = uniqueCategories.length;

    // Обновляем блок "Общие сведения"
    document.getElementById('total-reviews').textContent = filteredReviews.length;
    document.getElementById('total-sources').textContent = totalSources;
    document.getElementById('total-symptoms').textContent = totalUniqueSymptoms;
    document.getElementById('total-categories').textContent = totalCategories;

    updateCharts(filteredReviews);
}

// Обновление Графиков
let nrChartInstance = null;
let sourcesChartInstance = null;
let timelineChartInstance = null;

function updateCharts(filteredReviews) {
    // 2. Распространенность НР
    const nrData = {};
    filteredReviews.forEach(review => {
        review.НР.split('; ').forEach(nr => {
            nrData[nr] = (nrData[nr] || 0) + 1;
        });
    });
    const nrLabels = Object.keys(nrData);
    const nrValues = Object.values(nrData);

    // Рассчитываем проценты
    const total = nrValues.reduce((sum, value) => sum + value, 0);
    const nrPercentages = nrValues.map(value => ((value / total) * 100).toFixed(2));

    // Сортируем категории по убыванию процентов
    const sortedData = nrLabels
        .map((label, index) => ({
            label,
            value: nrValues[index],
            percentage: nrPercentages[index]
        }))
        .sort((a, b) => b.value - a.value);

    // Обновляем круговую диаграмму
    if (nrChartInstance) nrChartInstance.destroy();
    const nrChartCanvas = document.getElementById('nr-chart').getContext('2d');

    const colors = ['#BAD8E1', '#BAC0E1', '#E1BACD', '#D6E1BA', '#DCDCDC', '#F54C19']
    
    nrChartInstance = new Chart(nrChartCanvas, {
        type: 'doughnut',
        data: {
            labels: sortedData.map(item => item.label),
            datasets: [{
                label: 'Количество отзывов',
                data: sortedData.map(item => item.value),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '50%',
            plugins: {
                legend: {
                    display: false, // Скрываем легенду
                },
                title: {
                    display: false,
                    text: 'Распространенность НР'
                }
            }
        }
    });

    // Обновляем список категорий справа
    const categoriesList = document.getElementById('nr-categories-list');
    categoriesList.innerHTML = sortedData
    .map((item, index) => `
        <li>
            <span style="color: ${nrChartInstance.data.datasets[0].backgroundColor[index]}">⬤</span>
            ${item.label}, ${item.percentage}%
        </li>
    `)
    .join('');


    // 3. Источники сбора отзывов
    const sourcesData = {};
    filteredReviews.forEach(review => {
        sourcesData[review.Источник] = (sourcesData[review.Источник] || 0) + 1;
    });
    const sourcesLabels = Object.keys(sourcesData);
    const sourcesValues = Object.values(sourcesData);

    if (sourcesChartInstance) sourcesChartInstance.destroy();
    const sourcesChartCanvas = document.getElementById('sources-chart').getContext('2d');
    sourcesChartInstance = new Chart(sourcesChartCanvas, {
        type: 'pie',
        data: {
            labels: sourcesLabels,
            datasets: [{
                label: 'Количество отзывов',
                data: sourcesValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // 4. Отзывы по шкале времени
    const timelineData = {};
    filteredReviews.forEach(review => {
        timelineData[review.Год] = (timelineData[review.Год] || 0) + 1;
    });
    const timelineLabels = Object.keys(timelineData).sort();
    const timelineValues = timelineLabels.map(year => timelineData[year]);

    if (timelineChartInstance) timelineChartInstance.destroy();
    const timelineChartCanvas = document.getElementById('timeline-chart').getContext('2d');
    timelineChartInstance = new Chart(timelineChartCanvas, {
        type: 'line',
        data: {
            labels: timelineLabels,
            datasets: [{
                label: 'Количество отзывов',
                data: timelineValues,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}