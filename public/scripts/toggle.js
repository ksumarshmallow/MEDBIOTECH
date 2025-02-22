export function toggleListVisibility() {
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
}
