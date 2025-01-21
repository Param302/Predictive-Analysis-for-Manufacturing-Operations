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
    metrics = mymodel.train()
    joblib.dump(mymodel, "static/model/model.pkl")
    fields = [{"name": col, "type": ("float" if "f" in mymodel.X_train[col].dtype.str else "integer" )} for col in mymodel.X_train.columns]
    print(fields)
    print(metrics)
    return make_response({"message": "Model trained", "fields": fields, "metrics": {"accuracy": metrics[0], "f1_score": metrics[1]}}, 200)

@app.route("/predict", methods=["POST"])
def predict():
    mymodel = joblib.load("static/model/model.pkl")
    data = request.form.to_dict()
    print(data)
    data = pd.DataFrame(data, index=[0])
    print(data)
    prediction = mymodel.predict(data)
    print(prediction)
    return make_response({"prediction": int(prediction)}, 200)


def get_data(file, n):
    data = pd.read_csv(file)
    # round all the values to 3 decimal places
    data = data.round(3)
    data.to_csv(file, index=False)
    return data.head(n).to_dict(orient="records")


if __name__ == "__main__":
    app.run(debug=True, port=5000)