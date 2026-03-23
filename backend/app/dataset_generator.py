import pandas as pd
import random
from faker import Faker

fake = Faker()

accounts = []
transactions = []

branches = ["Delhi","Mumbai","Pune","Bangalore","Hyderabad"]

# create accounts
for i in range(1000):
    accounts.append({
        "account_id": f"A{i}",
        "customer_name": fake.name(),
        "branch": random.choice(branches),
        "status": random.choice(["active","dormant"])
    })

# create transactions
for i in range(5000):
    sender = random.choice(accounts)["account_id"]
    receiver = random.choice(accounts)["account_id"]

    if sender != receiver:
        transactions.append({
            "transaction_id": f"T{i}",
            "from_account": sender,
            "to_account": receiver,
            "amount": random.randint(1000,100000),
            "branch": random.choice(branches),
            "channel": random.choice(["ATM","Online","UPI","Branch"]),
            "timestamp": fake.date_time_this_year()
        })

accounts_df = pd.DataFrame(accounts)
transactions_df = pd.DataFrame(transactions)

accounts_df.to_csv("../data/accounts.csv", index=False)
transactions_df.to_csv("../data/transactions.csv", index=False)

print("Dataset generated")