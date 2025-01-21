import os
import joblib
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
    file.save(f"{app.config['UPLOAD_FOLDER']}/{file.filename}")
    return make_response({"message": "File uploaded"}, 200)

@app.route("/train", methods=["POST"])
def train():
    mymodel = Model()
    mymodel.train()
    joblib.dump(mymodel, "static/model.pkl")
    return make_response({"message": "Model trained"}, 200)

@app.route("/predict", methods=["POST"])
def predict():
    mymodel = joblib.load("static/model.pkl")
    data = request.form.to_dict()
    prediction = mymodel.predict(data)
    metrics = mymodel.metrics()
    return make_response({"prediction": prediction, "metrics": {"accuracy": metrics[0], "f1-score": metrics[1]}}, 200)


if __name__ == "__main__":
    app.run(debug=True, port=5000)