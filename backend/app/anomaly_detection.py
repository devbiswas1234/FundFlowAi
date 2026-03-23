import pandas as pd
from sklearn.ensemble import IsolationForest
from app.graph_service import run_query


def get_transaction_data():

    query = """
    MATCH (a:Account)-[t:TRANSFER]->(b:Account)
    RETURN a.id AS sender,
           b.id AS receiver,
           t.amount AS amount
    """

    return run_query(query)


def detect_anomalies():

    data = get_transaction_data()

    df = pd.DataFrame(data)

    if df.empty:
        return []

    model = IsolationForest(contamination=0.02)

    df["anomaly"] = model.fit_predict(df[["amount"]])

    anomalies = df[df["anomaly"] == -1]

    return anomalies.to_dict(orient="records")