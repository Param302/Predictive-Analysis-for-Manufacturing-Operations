const upload_btn = document.getElementById('upload-button')

upload_btn.addEventListener('click', async (e) => {
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
        upload_btn.disabled = true;
        const res = await response.json();
        console.log(res.data);
        displayDataPreview(res.data);
        document.getElementById('train-button').classList.remove('hidden');
    } else {
        alert('Failed to upload file.');
    }
});

document.getElementById('train-button').addEventListener('click', async () => {
    btn = document.getElementById('train-button')
    btn.textContent = 'Training...';
    btn.disabled = true;

    const response = await fetch('/train', {
        method: 'POST'
    });

    if (response.ok) {
        btn.textContent = 'Model Trained!';
        const res = await response.json();
        console.log(res.fields);
        console.log(res);
        displayPredictionForm(res.fields);
        displayMetrics(res.metrics);
    } else {
        btn.disabled = false;
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

async function displayDataPreview(data) {
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

function displayMetrics(metrics) {
    document.getElementById('metrics').classList.remove('hidden');
    const accuracy = document.getElementById('accuracy-value');
    const f1_score = document.getElementById('f1-score-value');
    accuracy.textContent = metrics.accuracy;
    f1_score.textContent = metrics.f1_score;
}

function displayPredictionForm(fields) {
    const predictionSection = document.getElementById('prediction-section');
    predictionSection.classList.remove('hidden');

    const form = document.getElementById('predict-form');
    form.innerHTML = '';
    fields.sort((a, b) => a.name.localeCompare(b.name));
    fields.forEach(field => {
        const label = document.createElement('label');
        const span = document.createElement('span');
        span.textContent = field.name;
        const input = document.createElement('input');
        if (field.type === 'integer' || field.type === 'float') {
            input.type = 'number';
        } else {
            input.type = 'text';
        }
        input.name = field.name;
        input.required = true;
        label.appendChild(span);
        label.appendChild(input);
        form.appendChild(label);
        // form.appendChild(input);
    });

    document.getElementById('predict-button').classList.remove('hidden');
}

function displayPredictionResult(result) {
    const prediction = document.getElementById('prediction');
    const resultDiv = document.getElementById('prediction-result');
    if (result.prediction == 1) {
        resultDiv.textContent = 'Yes (1)';
        resultDiv.style.backgroundColor = '#ffcccc';
    } else {
        resultDiv.textContent = 'No (0)';
        resultDiv.style.backgroundColor = '#ccffcc';
    }
}