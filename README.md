# Heart Disease Risk Predictor

A machine learning web application that predicts cardiovascular disease risk from 13 clinical patient parameters. Built as a full-stack project combining a trained ML model with a Flask backend and a responsive frontend.

**[Live Demo](https://heartdiseaseriskpredictor.onrender.com/)**

---

## What It Does

A patient's clinical data — including chest pain type, max heart rate, cholesterol, and ECG results — is entered into a form. The app feeds those values into a trained Logistic Regression model and returns a risk prediction (High Risk / Low Risk) along with a confidence percentage. The entire prediction happens in real time without a page reload.

The goal was to explore whether routine, non-invasive clinical measurements alone could reliably flag cardiovascular disease risk — without expensive imaging or genetic testing.

---

## Results

| Model | Cross-Val Accuracy | AUC Score |
|---|---|---|
| Logistic Regression | 80.5% | 0.84 |
| Random Forest (tuned) | 75.4% | 0.86 |
| XGBoost | 68.7% | 0.78 |

- Best accuracy: **Logistic Regression at 80.5%** (5-fold cross-validation)
- Best discriminative ability: **Random Forest at AUC 0.86**
- Top predictors identified: maximum heart rate (`thalach`), thalassemia type (`thal`), number of major vessels (`ca`), and chest pain type (`cp`)
- Logistic Regression outperforming more complex models on this dataset is a meaningful finding — with n < 300, simpler models generalize better and resist overfitting

---

## How It Works

```
User inputs 13 clinical values
        ↓
StandardScaler normalizes the features
        ↓
Logistic Regression model predicts probability
        ↓
Result + confidence % returned via Flask API
        ↓
JavaScript renders result without page reload
```

The model was trained in Python using scikit-learn on the UCI Cleveland Heart Disease dataset. The trained model and scaler are saved as `.pkl` files and loaded by the Flask backend at startup. The frontend communicates with the backend through a single `/predict` POST endpoint that accepts JSON and returns a prediction and confidence score.

Hyperparameter tuning was performed on the Random Forest model using `GridSearchCV` across 36 parameter combinations. The final deployed model is Logistic Regression, which achieved the highest cross-validated accuracy on this dataset size.

---

## File Structure

```
heart_app/
├── app.py                        # Flask backend, /predict API route
├── heart_disease_model.pkl       # Trained Logistic Regression model
├── scaler.pkl                    # Fitted StandardScaler
├── requirements.txt
├── templates/
│   ├── index.html                # Main assessment page
│   └── about.html                # About & methodology page
└── static/
    ├── style.css
    └── script.js
```

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/davidachinivu/Heart-Disease-Risk-Predictor
cd heart_app

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the app
python app.py

# 4. Open in browser
http://127.0.0.1:5000
```

---

## Tech Stack

- **Machine learning:** Python, scikit-learn, XGBoost, pandas, NumPy
- **Backend:** Flask
- **Frontend:** HTML, CSS, JavaScript (vanilla, no frameworks)
- **Model persistence:** joblib
- **Development environment:** Google Colab

---

## Dataset

UCI Heart Disease Dataset — Cleveland Subset

- **Source:** UC Irvine Machine Learning Repository
- **Collectors:** Andras Janosi MD, William Steinbrunn MD, Matthias Pfisterer MD, Robert Detrano MD PhD — Cleveland Clinic Foundation, 1988
- **Downloaded from:** [Kaggle — cherngs/heart-disease-cleveland-uci](https://www.kaggle.com/datasets/cherngs/heart-disease-cleveland-uci) (mirror of UCI original)
- **Records:** 297 patients · 13 features · binary classification target
- **Citation:** Janosi, A., Steinbrunn, W., Pfisterer, M., & Detrano, R. (1989). Heart Disease [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C52P4X

---

## Limitations

- Small dataset (297 patients) from a single institution limits generalizability
- Model has not been clinically validated — for educational purposes only
- No imaging, genetic, or longitudinal data included

---

*This project was built as part of an Applied Machine Learning course. All data is publicly available and no patient identifiers are present in the dataset.*
