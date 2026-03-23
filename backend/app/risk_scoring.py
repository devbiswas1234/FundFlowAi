def calculate_risk_score(patterns):

    score = 0

    if patterns["circular"]:
        score += 40

    if patterns["layering"]:
        score += 30

    if patterns["structuring"]:
        score += 20

    if patterns["dormant"]:
        score += 50

    if patterns["anomalies"]:
        score += 25

    return min(score,100)