import os
import joblib
import pandas as pd
from flask import Flask, make_response, request, render_template
from model import Model

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "./data"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    filepath = f"{app.config['UPLOAD_FOLDER']}/data.csv"
    if os.path.exists(filepath):
        os.remove(filepath)
    
    file.save(filepath)
    data = get_data(filepath, 50)
    return make_response({"message": "File uploaded", "data": data}, 200)

@app.route("/train", methods=["POST"])
def train():
    data_path = f"{app.config['UPLOAD_FOLDER']}/data.csv"
    mymodel = Model(data_path)
    mymodel.train()
    joblib.dump(mymodel, "static/model.pkl")
    fields = [{"name": col, "type": mymodel.data[col].dtype} for col in mymodel.data.columns]
    return make_response({"message": "Model trained", "fields": fields}, 200)

@app.route("/predict", methods=["POST"])
def predict():
    mymodel = joblib.load("static/model.pkl")
    data = request.form.to_dict()
    prediction = mymodel.predict(data)
    metrics = mymodel.metrics()
    return make_response({"prediction": prediction, "metrics": {"accuracy": metrics[0], "f1-score": metrics[1]}}, 200)


def get_data(file, n):
    data = pd.read_csv(file)
    return data.head(n).to_dict(orient="records")

    ...


if __name__ == "__main__":
    app.run(debug=True, port=5000)