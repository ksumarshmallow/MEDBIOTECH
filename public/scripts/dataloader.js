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
        document.querySelectorAll('.checkbox-group#drugs .form-check-input:checked')
    ).map(checkbox => checkbox.id);

    const selectedSources = Array.from(
        document.querySelectorAll('.checkbox-group#resources .form-check-input:checked')
    ).map(checkbox => checkbox.id);

    const selectedCatSymptoms = Array.from(
        document.querySelectorAll('.checkbox-group#categories .form-check-input:checked')
    ).map(checkbox => checkbox.id);

    console.log(selectedDrugs)

    const minYear = parseInt(document.getElementById('input-min').value);
    const maxYear = parseInt(document.getElementById('input-max').value);

    const filteredReviews = reviewsData.filter(review => {
        const matchesDrug = selectedDrugs.length === 0 || selectedDrugs.includes(review.Лекарство);
        const matchesSource = selectedSources.length === 0 || selectedSources.includes(review.Источник);
        const matchesYear = review.Год >= minYear && review.Год <= maxYear;
        const reviewCatSymptoms = review.НР.split('; ').map(source => source.trim());
        const matchesCatSymptoms = selectedCatSymptoms.length === 0 || 
                                  selectedCatSymptoms.some(cat => reviewCatSymptoms.includes(cat));

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

    const sourcesChartCanvas = document.getElementById('sources-bar-chart').getContext('2d');

    if (sourcesChartInstance) sourcesChartInstance.destroy();
    sourcesChartInstance = new Chart(sourcesChartCanvas, {
        type: 'bar',
        data: {
            labels: sourcesLabels,
            datasets: [{
                label: 'Количество отзывов',
                data: sourcesValues,
                backgroundColor: '#BAD8E1',
                borderColor: '#BAD8E1',
                borderWidth: 0,
                barPercentage: 0.75,   //  ширина одного бара
                categoryPercentage: 0.8   // ширина всех
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                    text: 'Источники сбора отзывов'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#333',
                        font: {
                            size: 0,
                            weight: 'bold'
                        },
                        padding: 10
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#333',
                        font: {
                            size: 16,
                            weight: 'normal'
                        },
                        align: 'left',
                        crossAlign: 'near',
                        padding: 10
                    }
                }
            }
        }
    });

    // 4. Отзывы по шкале времени
    const timelineData = {};

    //  группировка по лекарствам и годам
    filteredReviews.forEach(review => {
        if (!timelineData[review.Лекарство]) {
            timelineData[review.Лекарство] = {};
        }
        timelineData[review.Лекарство][review.Год] = 
            (timelineData[review.Лекарство][review.Год] || 0) + 1;
    });
    
    const timelineLabels = [...new Set(filteredReviews.map(r => r.Год))].sort();

    let maxReviews = 0;
    Object.keys(timelineData).forEach(drug => {
        Object.values(timelineData[drug]).forEach(reviews => {
            if (reviews > maxReviews) {
                maxReviews = reviews;
            }
        });
    });

    // для каждого лекарства свой датасет
    function generateMultiGradientColors(colors, count) {
        if (count <= colors.length) {
            return colors.slice(0, count); // Если лекарств мало, берем готовые цвета
        }
    
        const resultColors = [];
        for (let i = 0; i < count; i++) {
            const ratio = i / (count - 1);
            const index = Math.floor(ratio * (colors.length - 1)); // Находим, между какими цветами интерполировать
            const nextIndex = Math.min(index + 1, colors.length - 1);
            
            const start = colors[index].match(/\w\w/g).map(c => parseInt(c, 16));
            const end = colors[nextIndex].match(/\w\w/g).map(c => parseInt(c, 16));
    
            const color = start.map((c, j) => Math.round(c + (end[j] - c) * (ratio * (colors.length - 1) - index)));
            resultColors.push(`#${color.map(c => c.toString(16).padStart(2, '0')).join('')}`);
        }
        return resultColors;
    }
    
    // const baseColors = ['#BAD8E1', '#BAC0E1', '#E1BACD', '#D6E1BA', '#DCDCDC', '#F54C19'];
    const baseColors = ['#78C2E1', '#7898E1', '#E178B3', '#B7E178', '#E1E178', '#F54C19'];
    
    const drugNames = Object.keys(timelineData);
    const drugColors = generateMultiGradientColors(baseColors, drugNames.length);    

    const datasets = drugNames.map((drug, index) => ({
        label: drug,
        data: timelineLabels.map(year => timelineData[drug][year] || 0),
        borderColor: drugColors[index] || '#9966FF',
        backgroundColor: drugColors[index] || '#9966FF',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
    }));

    if (timelineChartInstance) timelineChartInstance.destroy();
    const timelineChartCanvas = document.getElementById('timeline-chart').getContext('2d');

    timelineChartInstance = new Chart(timelineChartCanvas, {
        type: 'line',
        data: {
            labels: timelineLabels,
            datasets: datasets
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'start',
                    labels: {
                        color: '#333',
                        boxHeight: 1,
                        boxWidth: 30,
                        font: {
                            size: 14
                        },
                    }
                },
                tooltip: {
                    enabled: true,
                    intersect: false
                },
            },
            scales: {
                x: {
                    ticks: { color: '#B9B9B9', font: { size: 14 } },
                    grid: { display: false }
                },
                y: {
                    ticks: { color: '#B9B9B9', font: { size: 14 }, stepSize: 1},
                    grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                    beginAtZero: true,
                    // min: -0.1,
                    // suggestedMin: -0.1,
                    // max: maxReviews + 1,
                    // suggestedMax: maxReviews + 1,
                }
            }
        }
    });
}