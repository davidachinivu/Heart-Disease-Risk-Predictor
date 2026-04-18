document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // UI Elements
    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('spinner');
    const btnText = btn.querySelector('span');
    const resultContainer = document.getElementById('result-container');
    
    // Show loading state
    btn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.textContent = "Analyzing...";
    resultContainer.classList.add('hidden');
    resultContainer.innerHTML = '';
    
    // Gather form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate 1 second delay for UX
    setTimeout(() => {
        fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.error) {
                showError(res.error);
            } else {
                showResult(res.prediction, res.confidence);
            }
        })
        .catch(err => {
            showError("Network error. Please make sure the Flask server is running.");
        })
        .finally(() => {
            // Restore button
            btn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = "Assess Risk";
        });
    }, 1000);
});

function showResult(prediction, confidenceVal) {
    const container = document.getElementById('result-container');
    container.classList.remove('hidden', 'high-risk', 'low-risk');
    
    const isHighRisk = prediction === 1;
    const confidencePercent = (confidenceVal * 100).toFixed(1);
    
    if (isHighRisk) {
        container.classList.add('high-risk');
        container.innerHTML = `
            <h2>High Risk Detected</h2>
            <p>Based on the clinical parameters provided, the model indicates a higher likelihood of cardiovascular disease.</p>
            <p style="margin-top: 10px; font-weight: 500;">Recommendation: We recommend scheduling a comprehensive cardiac evaluation with your healthcare provider to discuss preventative steps.</p>
            
            <div class="confidence-wrapper">
                <div class="confidence-label">
                    <span>Model Confidence</span>
                    <span>${confidencePercent}%</span>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
    } else {
        container.classList.add('low-risk');
        container.innerHTML = `
            <h2>Low Risk</h2>
            <p>Based on the clinical parameters provided, the model indicates a low risk profile for cardiovascular disease.</p>
            <p style="margin-top: 10px; font-weight: 500;">Recommendation: Continue maintaining your healthy lifestyle habits and routine check-ups.</p>
            
            <div class="confidence-wrapper">
                <div class="confidence-label">
                    <span>Model Confidence</span>
                    <span>${confidencePercent}%</span>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
    }
    
    // Animate the progress bar after a tiny delay to allow DOM render
    setTimeout(() => {
        const fill = container.querySelector('.progress-fill');
        if (fill) fill.style.width = `${confidencePercent}%`;
    }, 50);
    
    // Scroll to result smoothly
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(msg) {
    const container = document.getElementById('result-container');
    container.classList.remove('hidden', 'high-risk', 'low-risk');
    container.style.borderLeftColor = '#f39c12';
    container.style.backgroundColor = '#fdfae6';
    
    container.innerHTML = `
        <h2 style="color: #d35400;">Notice</h2>
        <p>${msg}</p>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
