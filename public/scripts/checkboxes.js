export async function loadData() {
    const response = await fetch('../data/dataset_description.json');
    return await response.json();
}

export function createCheckboxGroup(id, label, data, visibleItems = 4) {
    const container = document.createElement('div');
    container.className = 'checkbox-group';
    container.id = id;

    const heading = document.createElement('h3');
    heading.className = 'mt-4 d-flex justify-content-between align-items-center';
    heading.innerHTML = `${label} <span class="toggle-arrow"><i class="fas fa-chevron-down"></i></span>`;
    container.appendChild(heading);

    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';

    console.log(container)

    data.forEach((item, index) => {
        const formCheck = document.createElement('div');
        formCheck.className = 'form-check';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${item}`;
        checkbox.className = 'form-check-input';

        const labelElement = document.createElement('label');
        labelElement.className = 'form-check-label';
        labelElement.htmlFor = `${item}`;
        labelElement.textContent = item;

        formCheck.appendChild(checkbox);
        formCheck.appendChild(labelElement);

        if (index >= visibleItems) {
            formCheck.style.display = 'none';
        }

        checkboxContainer.appendChild(formCheck);
    });

    container.appendChild(checkboxContainer);

    if (data.length > visibleItems) {
        const showMoreButton = document.createElement('button');
        showMoreButton.type = 'button';
        showMoreButton.className = 'btn-show-more';
        showMoreButton.textContent = 'Еще';

        showMoreButton.addEventListener('click', () => {
            const hiddenItems = checkboxContainer.querySelectorAll('.form-check[style="display: none;"]');
            hiddenItems.forEach(item => item.style.display = 'block');
            showMoreButton.style.display = 'none';
        });

        container.appendChild(showMoreButton);
    }

    return container;
}

export async function init() {
    const data = await loadData();

    data.drugs.sort();
    data.resources.sort();
    data.categories.sort();

    const filtersContainer = document.querySelector('.filters-container form');

    const drugsGroup = createCheckboxGroup('drugs', 'Лекарственный препарат', data.drugs);
    const sourcesGroup = createCheckboxGroup('resources', 'Источник', data.resources);
    const categoriesGroup = createCheckboxGroup('categories', 'Категории нежелательных реакций', data.categories);

    filtersContainer.appendChild(drugsGroup);
    filtersContainer.appendChild(sourcesGroup);
    filtersContainer.appendChild(categoriesGroup);
}