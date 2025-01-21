document.getElementById('upload-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        displayDataPreview(res.data);
        document.getElementById('train-button').classList.remove('hidden');
    } else {
        alert('Failed to upload file.');
    }
});

document.getElementById('train-button').addEventListener('click', async () => {
    const response = await fetch('/train', {
        method: 'POST'
    });

    if (response.ok) {
        document.getElementById('train-button').disabled = true;
        const label = document.createElement('label');
        label.textContent = 'Model Trained!';
        document.getElementById('data-preview-section').appendChild(label);
        const fields = await response.json();
        displayPredictionForm(fields);
    } else {
        alert('Failed to train model.');
    }
});

document.getElementById('predict-button').addEventListener('click', async () => {
    const form = document.getElementById('predict-form');
    const formData = new FormData(form);

    const response = await fetch('/predict', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        displayPredictionResult(result);
    } else {
        alert('Failed to predict.');
    }
});

function displayDataPreview(data) {
    const previewSection = document.getElementById('data-preview-section');
    previewSection.classList.remove('hidden');

    const previewDiv = document.getElementById('data-preview');
    previewDiv.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        if (index === 3) {
            th.style.backgroundColor = 'orange';
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.slice(0, 50).forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach((header, index) => {
            const td = document.createElement('td');
            td.textContent = row[header];
            if (index === 3) {
                td.style.backgroundColor = 'orange';
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    previewDiv.appendChild(table);
}

function displayPredictionForm(fields) {
    const predictionSection = document.getElementById('prediction-section');
    predictionSection.classList.remove('hidden');

    const form = document.getElementById('predict-form');
    form.innerHTML = '';

    fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = field.name;
        const input = document.createElement('input');
        input.type = field.type;
        input.name = field.name;
        form.appendChild(label);
        form.appendChild(input);
    });

    document.getElementById('predict-button').classList.remove('hidden');
}

function displayPredictionResult(result) {
    const resultDiv = document.getElementById('prediction-result');
    resultDiv.innerHTML = JSON.stringify(result, null, 2);
}