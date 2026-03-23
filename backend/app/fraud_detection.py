from app.graph_service import run_query
from app.risk_scoring import calculate_risk_score
from app.anomaly_detection import detect_anomalies

# Pattern 1 — Rapid Layering
def detect_rapid_layering():

    query = """
    MATCH path=(a:Account)-[:TRANSFER*3..5]->(b:Account)
    RETURN path
    LIMIT 10
    """

    return run_query(query)


# Pattern 2 — Circular Transactions
def detect_circular_transactions():

    query = """
    MATCH path=(a:Account)-[:TRANSFER*2..4]->(a)
    RETURN path
    LIMIT 10
    """

    return run_query(query)


# Pattern 3 — Structuring (many small transactions)
def detect_structuring():

    query = """
    MATCH (a:Account)-[t:TRANSFER]->(b:Account)
    WHERE t.amount < 10000
    RETURN a.id AS account, COUNT(t) AS small_transactions
    ORDER BY small_transactions DESC
    LIMIT 10
    """

    return run_query(query)


# Pattern 4 — Dormant Account Activation
def detect_dormant_activity():

    query = """
    MATCH (a:Account {status:'dormant'})-[t:TRANSFER]->(b:Account)
    RETURN a.id AS dormant_account, t.amount AS suspicious_amount
    ORDER BY suspicious_amount DESC
    LIMIT 10
    """

    return run_query(query)


# Combined fraud alerts
def get_fraud_alerts():
    layering = detect_rapid_layering()
    circular = detect_circular_transactions()
    structuring = detect_structuring()
    dormant = detect_dormant_activity()
    anomalies = detect_anomalies()

    return {
        "rapid_layering": layering,
        "circular_transactions": circular,
        "structuring": structuring,
        "dormant_activity": dormant,
        "anomalies": anomalies
    }

def get_account_risk():

    circular = detect_circular_transactions()
    layering = detect_rapid_layering()
    structuring = detect_structuring()
    dormant = detect_dormant_activity()
    anomalies = detect_anomalies()

    patterns = {
        "circular": len(circular) > 0,
        "layering": len(layering) > 0,
        "structuring": len(structuring) > 0,
        "dormant": len(dormant) > 0,
        "anomalies": len(anomalies) > 0
    }

    risk_score = calculate_risk_score(patterns)

    return {
        "risk_score": risk_score,
        "patterns": patterns
    }


def branch_risk_heatmap():

    query = """
    MATCH (a:Account)-[t:TRANSFER]->(b:Account)
    RETURN a.branch AS branch, count(t) AS transactions
    """

    data = run_query(query)

    results = []

    for row in data:
        risk = "LOW"

        if row["transactions"] > 30:
            risk = "HIGH"
        elif row["transactions"] > 15:
            risk = "MEDIUM"

        results.append({
            "branch": row["branch"],
            "transactions": row["transactions"],
            "risk": risk
        })

    return results