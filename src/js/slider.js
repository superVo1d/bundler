$(function() {
    const nodes = document.getElementsByClassName('field__item-multiple');

    nodes.forEach((root) => {
        const data = eval(root.dataset.value)

        new Array(data.length)
            .fill()
            .map((key, i) => {
            const el = data[data.length - i - 1];

            const field__item = document.createElement("li");
            field__item.classList.add("field__item");

            const field__name = document.createElement("div");
            field__name.classList.add("field__name");

            const span = document.createElement("span");
            span.textContent = el.title.charAt(0).toUpperCase() + el.title.slice(1);

            field__name.appendChild(span);

            const field__value = document.createElement("div");
            field__value.classList.add("field__value");

            const input = `<input type="range" class="styled-slider slider-progress" 
                            data-name="${root.dataset.name}" 
                            data-value="${el.level}" data-edit="${root.dataset.edit}"/>`;

            field__value.innerHTML = input.trim();

            field__item.appendChild(field__name);
            field__item.appendChild(field__value);

            root.parentNode.insertBefore(field__item, root.nextSibling);
        });
    });

    for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
        e.style.setProperty('--value', e.dataset.value);
        $(e).val(e.dataset.value);

        if (e.dataset.edit === '0') e.disabled = 'disabled';

        e.style.setProperty('--min', e.min == '' ? '0' : e.min);
        e.style.setProperty('--max', e.max == '' ? '100' : e.max);

        e.addEventListener('input', () => {
            e.style.setProperty('--value', e.value);
            $(e).val(e.value);
        });
    }
});