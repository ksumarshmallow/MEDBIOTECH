export function toggleListVisibility() {
    document.querySelectorAll('.toggle-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const group = arrow.closest('.d-flex').nextElementSibling;
            const icon = arrow.querySelector('i');
            
            group.style.display = group.style.display === 'none' ? 'block' : 'none';
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
}
