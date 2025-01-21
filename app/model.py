import pandas as pd
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

class Model:

    def __init__(self, data_path):
        self.data = pd.read_csv("./data/data.csv")
        self.data.rename(columns={"DefectStatus": "target"}, inplace=True)
        cols = self.data.columns.tolist()
        cols = cols[:-1] + [cols[-1]]
        self.data = self.data[cols]
        self.__split_data()


    def __split_data(self):
        X = self.data.drop("target", axis=1)
        y = self.data["target"]
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)


    def train(self):
        self.model = RandomForestClassifier()
        self.model.fit(self.X_train, self.y_train)
        acc = accuracy_score(self.y_test, self.model.predict(self.X_test))
        f1 = f1_score(self.y_test, self.model.predict(self.X_test))
        return round(acc, 2)*100, round(f1, 2)
    

    def predict(self, data):
       data = data[self.data.columns[:-1]]
       return self.model.predict(data)[0]
