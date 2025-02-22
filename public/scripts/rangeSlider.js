export function initializeRangeSlider() {
    const rangeSlider = document.getElementById('range-slider');
    const inputMin = document.getElementById('input-min');
    const inputMax = document.getElementById('input-max');
    const resetButton = document.getElementById('reset-button');

    noUiSlider.create(rangeSlider, {
        start: [2000, 2025],
        connect: true,
        range: {
            'min': 2000,
            'max': 2025
        },
        step: 1
    });

    rangeSlider.noUiSlider.on('update', (values) => {
        inputMin.value = Math.round(values[0]);
        inputMax.value = Math.round(values[1]);
    });

    inputMin.addEventListener('blur', () => validateInput(inputMin, true));
    inputMax.addEventListener('blur', () => validateInput(inputMax, false));

    const validateInput = (input, isMin) => {
        let value = parseInt(input.value);

        if (isNaN(value)) {
            value = isMin ? 2000 : 2025;
        }

        if (value < 2000) value = 2000;
        if (value > 2025) value = 2025;

        if (isMin) {
            const max = parseInt(inputMax.value);
            if (value > max) value = max;
        } else {
            const min = parseInt(inputMin.value);
            if (value < min) value = min;
        }

        input.value = value;

        if (isMin) {
            rangeSlider.noUiSlider.set([value, null]);
        } else {
            rangeSlider.noUiSlider.set([null, value]);
        }
    };

    // текстовый вводы (enter)
    const handleInput = (input, isMin) => {
        input.addEventListener('blur', () => validateInput(input, isMin));
        input.addEventListener('input', (e) => {
            if (e.inputType === "insertText" || e.inputType === "deleteContentBackward") {
                return;
            }
            validateInput(input, isMin);
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                validateInput(input, isMin);
            }
        });
    };

    handleInput(inputMin, true);
    handleInput(inputMax, false);

    inputMin.addEventListener('blur', () => validateInput(inputMin, true));
    inputMax.addEventListener('blur', () => validateInput(inputMax, false));

    inputMin.addEventListener('input', (e) => {
        if (e.inputType === "insertText" || e.inputType === "deleteContentBackward") {
            return;
        }
        validateInput(inputMin, true);
    });
    inputMax.addEventListener('input', (e) => {
        if (e.inputType === "insertText" || e.inputType === "deleteContentBackward") {
            return;
        }

        validateInput(inputMax, false);
    });

    resetButton.addEventListener('click', () => {
        inputMin.value = 2000;
        inputMax.value = 2025;

        rangeSlider.noUiSlider.set([2000, 2025]);

        document.querySelectorAll('.checkbox-group .form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });

        filterReviews();
        loadCSVData()
    });
}
