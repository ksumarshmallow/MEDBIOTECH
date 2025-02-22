export function showMoreButton() {
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
}
