# Predictive Analysis for Manufacturing Operations

This project is a web application designed to perform predictive analysis on manufacturing operations data. The application allows users to upload a CSV file, train a machine learning model, and make predictions based on the trained model.

## Table of Contents

- Features
- Data
- Technologies
- Project Structure
- Installation
- Usage
- Endpoints

## Features

- Upload CSV files containing manufacturing data.
- Train a machine learning model using the uploaded data.
- Make predictions based on the trained model.
- Display data preview and model metrics.

## Data
Data have been used from [kaggle dataset](https://www.kaggle.com/datasets/rabieelkharoua/predicting-manufacturing-defects-dataset?select=manufacturing_defect_dataset.csv)

## Technologies
- Python >= 3.10.12
- Flask==3.1.0
- scikit-learn==1.6.1
- numpy==2.2.2
- pandas==2.2.3

### Flow
- The user uploads a CSV file containing manufacturing data.
- The application reads the uploaded file and displays a preview of the data.
- The user trains a machine learning model using the uploaded data.
- - Random Forest Classifier is used to train the model.
- - Data is split into training (80%) and testing (20%) sets.
- - The model is trained using the training data.
- - The model is evaluated using the testing data.
- Accuracy and F1 score are displayed as model metrics based on the testing data.
- The user makes predictions using the trained model.


## Project Structure

- [`app`](app ): Contains the main application code.
  - [`data`](data ): Directory for storing data files.
  - `static/`: Contains static files such as JavaScript, CSS, and the trained model.
  - `templates/`: Contains HTML templates.
  - [`app/main.py`](app/main.py ): Main Flask application file.
  - [`model.py`](app/model.py ): Contains the machine learning model class.
- [`data`](data ): Directory for storing additional data files.
- [`env`](env ): Python virtual environment directory.
- [`requirements.txt`](requirements.txt ): List of Python dependencies.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Param302/Predictive-Analysis-for-Manufacturing-Operations.git
   cd Predictive-Analysis-for-Manufacturing-Operations/app
   ```
2. Create and activate a virtual environment:
    ```sh
    python3 -m venv env
    source env/bin/activate
    ```
3. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
4. Run the Flask application:
    ```sh
    python main.py
    ```
5. Open a web browser and navigate to `http://localhost:5000`.

### Usage
Upload a CSV file and follow the instructions to train a machine learning model and make predictions.

### Endpoints
- `GET /`: Render the home page.
- `POST /upload`: Upload a CSV file (use CSV file in data folder).
- `POST /train`: Train the machine learning model.
- `POST /predict`: Make predictions using the trained model.



