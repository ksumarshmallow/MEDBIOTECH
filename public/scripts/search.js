export function initializeSearch() {
    let drugs = ['Авиандр', 'Алимемазин и синонимы', 'Андипал', 'Афобазол', 'Баета', 'Инозин Пранобекс', 'Нейромексол', 'Радия-223 хлорид', 'Эсциталопрам'];
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

        // Перезагрузка списка препаратов
        drugs = [
            'Авиандр', 'Алимемазин и синонимы', 'Андипал', 'Афобазол', 
            'Баета', 'Инозин Пранобекс', 'Нейромексол', 'Радия-223 хлорид', 'Эсциталопрам'
        ];
        
        updateTable(reviewsData);
        renderDropdown();
    });

    // Функция для рендеринга выпадающего списка
    function renderDropdown() {
        dropdownResults.innerHTML = drugs.map(drug =>
            `<div class="dropdown-item">${drug}</div>`
        ).join('');
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => selectDrug(item.textContent));
        });
    }

    // Функция для переключения отображения выпадающего списка
    function toggleDropdown(show = true) {
        dropdownResults.style.display = show ? 'block' : 'none';
        if (show) renderDropdown();
    }

    // Выбор препарата из выпадающего списка
    function selectDrug(drug) {
        if (!drugs.includes(drug)) return;

         // Добавляем выбранный препарат в список выбранных
        const selectedDrug = document.createElement('span');
        selectedDrug.className = 'selected-drug';
        selectedDrug.textContent = drug;
        selectedDrug.addEventListener('click', () => removeDrug(drug));
        selectedDrugsContainer.appendChild(selectedDrug);

        // Синхронизируем с чекбоксом
        const checkbox = document.getElementById(drug);
        if (checkbox) checkbox.checked = true;

        // Убираем выбранный препарат из списка доступных
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
        
        if (e.key === 'ArrowDown' && selectedIndex < items.length - 1) {
            selectedIndex++;
        } else if (e.key === 'ArrowUp' && selectedIndex > 0) {
            selectedIndex--;
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            items[selectedIndex].click();
        }

        if (selectedIndex >= 0) {
            items[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        items.forEach((item, index) => item.classList.toggle('selected', index === selectedIndex));
    });

    // Закрытие выпадающего списка при клике вне его
    document.addEventListener('click', (e) => {
        if (![toggleDropdownButton, dropdownResults, searchBar].some(el => el.contains(e.target))) {
            toggleDropdown(false);
        }
    });

    // Синхронизация чекбоксов и выбранных препаратов
    document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectDrug(this.id);
            } else {
                removeDrug(this.id);
            }
        });
    });

    // Обновление ширины выпадающего списка
    function updateDropdownWidth() {
        dropdownResults.style.width = `${searchBar.offsetWidth}px`;
    }

    updateDropdownWidth();
    window.addEventListener('resize', updateDropdownWidth);
}
