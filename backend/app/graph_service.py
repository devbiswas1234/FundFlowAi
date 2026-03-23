import os
from neo4j import GraphDatabase

URI = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "dev@2535q")

driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))


def sanitize_neo4j_data(data):
    if isinstance(data, dict):
        return {k: sanitize_neo4j_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_neo4j_data(item) for item in data]
    elif hasattr(data, 'iso_format'):
        return data.iso_format()
    return data

def run_query(query, parameters=None):
    with driver.session() as session:
        result = session.run(query, parameters)
        records = [record.data() for record in result]
        return sanitize_neo4j_data(records)