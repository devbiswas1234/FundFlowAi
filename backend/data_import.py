from neo4j import GraphDatabase
import csv
import os

URI = "neo4j://localhost:7687"
USERNAME = "neo4j"
PASSWORD = "dev@2535q"

# Get absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACCOUNTS_CSV = os.path.join(BASE_DIR, "data", "accounts.csv")
TRANSACTIONS_CSV = os.path.join(BASE_DIR, "data", "transactions.csv")

def import_data():
    driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))
    
    with driver.session() as session:
        # 1. Clear existing data
        print("Clearing existing data...")
        session.run("MATCH (n) DETACH DELETE n")
        
        # 2. Import Accounts
        print(f"Importing accounts from {ACCOUNTS_CSV}...")
        with open(ACCOUNTS_CSV, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            accounts = list(reader)
            
            query = """
            UNWIND $accounts AS row
            CREATE (a:Account {
                id: row.account_id,
                ownerName: row.customer_name,
                branch: row.branch,
                status: row.status
            })
            """
            session.run(query, accounts=accounts)
            print(f"Imported {len(accounts)} accounts.")
            
        # 3. Create Constraints/Indexes
        print("Creating indexes...")
        try:
            session.run("CREATE INDEX account_id_index FOR (a:Account) ON (a.id)")
        except Exception as e:
            print(f"Index creation caveat: {e}")
            
        # 4. Import Transactions
        print(f"Importing transactions from {TRANSACTIONS_CSV}...")
        with open(TRANSACTIONS_CSV, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            transactions = list(reader)
            
            # Batch import transactions for better performance
            query = """
            UNWIND $txs AS tx
            MATCH (source:Account {id: tx.from_account})
            MATCH (dest:Account {id: tx.to_account})
            CREATE (source)-[t:TRANSFER {
                id: tx.transaction_id,
                amount: toFloat(tx.amount),
                branch: tx.branch,
                channel: tx.channel,
                timestamp: tx.timestamp
            }]->(dest)
            """
            
            # Process in batches of 1000 to avoid out-of-memory errors on Neo4j
            batch_size = 1000
            for i in range(0, len(transactions), batch_size):
                batch = transactions[i:i+batch_size]
                session.run(query, txs=batch)
            
            print(f"Imported {len(transactions)} transactions.")

    driver.close()
    print("Data import complete!")

if __name__ == "__main__":
    import_data()
