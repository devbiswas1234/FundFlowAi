from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.graph_service import run_query
from app.fraud_detection import get_fraud_alerts
from app.fraud_detection import get_account_risk
from app.anomaly_detection import detect_anomalies
from app.fraud_detection import branch_risk_heatmap

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test-db")
def test_db():
    query = """
    MATCH (a:Account)
    RETURN count(a) as total_accounts
    """
    
    result = run_query(query)
    return result

@app.get("/dashboard-metrics")
def dashboard_metrics():
    # Get total accounts
    accounts_q = "MATCH (a:Account) RETURN count(a) as total"
    total_accounts = run_query(accounts_q)[0]["total"]
    
    # Get total transactions
    tx_q = "MATCH ()-[t:TRANSFER]->() RETURN count(t) as total"
    total_tx = run_query(tx_q)[0]["total"]
    
    # Get high risk & alerts
    suspicious_tx_q = "MATCH (a)-[t:TRANSFER]->(b) WHERE t.amount > 50000 RETURN count(t) as total"
    suspicious_tx = run_query(suspicious_tx_q)[0]["total"]
    
    high_risk_q = "MATCH (a:Account) WHERE a.riskScore > 60 RETURN count(a) as total"
    high_risk_accts = run_query(high_risk_q)[0]["total"]

    return {
        "total_accounts": total_accounts,
        "suspicious_transactions": suspicious_tx,
        "high_risk_accounts": high_risk_accts,
        "total_transactions": total_tx
    }

@app.get("/fraud-alerts")
def fraud_alerts():
    return get_fraud_alerts()

@app.get("/fund-trace/{account_id}")
def fund_trace(account_id: str):

    query = """
    MATCH (a:Account)-[t:TRANSFER]-(b:Account)
    WHERE a.id = $account_id
    RETURN a.id AS a, coalesce(a.riskScore, 0) AS a_risk, b.id AS b, coalesce(b.riskScore, 0) AS b_risk, t.amount AS amount
    UNION
    MATCH path=(a:Account)-[:TRANSFER*3..5]->(b:Account)
    WHERE a.id = $account_id
    WITH path LIMIT 25
    UNWIND relationships(path) AS t
    WITH startNode(t) AS sn, endNode(t) AS en, t
    RETURN sn.id AS a, coalesce(sn.riskScore, 0) AS a_risk, en.id AS b, coalesce(en.riskScore, 0) AS b_risk, t.amount AS amount
    UNION
    MATCH path=(a:Account)-[:TRANSFER*2..4]->(a:Account)
    WHERE a.id = $account_id
    WITH path LIMIT 15
    UNWIND relationships(path) AS t
    WITH startNode(t) AS sn, endNode(t) AS en, t
    RETURN sn.id AS a, coalesce(sn.riskScore, 0) AS a_risk, en.id AS b, coalesce(en.riskScore, 0) AS b_risk, t.amount AS amount
    """

    return run_query(query, {"account_id": account_id})

@app.get("/anomalies")
def anomalies():

    return detect_anomalies()

@app.get("/risk-score")
def risk_score():

    return get_account_risk()

@app.get("/branch-risk")
def branch_risk():
    return branch_risk_heatmap()

@app.get("/account/{account_id}")
def get_account(account_id: str):
    query = """
    MATCH (a:Account {id: $account_id})
    RETURN a
    """
    result = run_query(query, {"account_id": account_id})
    if result:
        return result[0]["a"]
    return {"error": "Account not found"}

@app.get("/account/{account_id}/timeline")
def get_account_timeline(account_id: str):
    query = """
    MATCH (a:Account {id: $account_id})-[t:TRANSFER]->(b:Account)
    RETURN a.id as source, b.id as destination, t.amount as amount, toString(id(t)) as id, t.timestamp as timestamp
    ORDER BY t.timestamp DESC
    LIMIT 50
    """
    return run_query(query, {"account_id": account_id})

@app.get("/transactions")
def get_transactions(limit: int = 50, skip: int = 0):
    query = """
    MATCH (a:Account)-[t:TRANSFER]->(b:Account)
    RETURN toString(id(t)) as id, a.id as source, b.id as destination, t.amount as amount, t.timestamp as timestamp, t.channel as channel
    ORDER BY t.timestamp DESC
    SKIP $skip LIMIT $limit
    """
    return run_query(query, {"limit": limit, "skip": skip})

@app.get("/analytics")
def get_analytics():
    # Example distribution
    return {
        "risk_distribution": {
            "Low": 65,
            "Medium": 25,
            "High": 10
        },
        "pattern_distribution": {
            "Rapid Layering": 15,
            "Circular Transactions": 5,
            "Structuring": 20,
            "Dormant Activation": 8
        }
    }

# Simple In-Memory Case Store for MVP
cases_db = [
    {
        "id": "C-1001",
        "accountId": "A192",
        "riskScore": 82,
        "status": "investigating",
        "fraudPatterns": ["Rapid Layering", "Structuring"],
        "investigatorNotes": "Suspicious pattern of layering across multiple branches."
    },
    {
        "id": "C-1002",
        "accountId": "A85",
        "riskScore": 65,
        "status": "open",
        "fraudPatterns": ["Circular Transactions"],
        "investigatorNotes": ""
    }
]

@app.get("/cases")
def get_cases():
    return cases_db

from pydantic import BaseModel
class CaseUpdate(BaseModel):
    status: str
    investigatorNotes: str

@app.put("/cases/{case_id}")
def update_case(case_id: str, update: CaseUpdate):
    for c in cases_db:
        if c["id"] == case_id:
            c["status"] = update.status
            if update.investigatorNotes:
               c["investigatorNotes"] = update.investigatorNotes
            return c
    return {"error": "Case not found"}

from fastapi.responses import Response
from app.report_generator import generate_pdf_report

@app.get("/report/{case_id}")
def download_report(case_id: str):
    case_data = None
    for c in cases_db:
        if c["id"] == case_id:
            case_data = c
            break
            
    if not case_data:
        return {"error": "Case not found"}
        
    pdf_bytes = generate_pdf_report(case_data)
    
    headers = {
        'Content-Disposition': f'attachment; filename="Investigation_Report_{case_id}.pdf"'
    }
    
    return Response(content=pdf_bytes, headers=headers, media_type="application/pdf")
