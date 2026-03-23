# FundFlowAi Deployment Guide

I have set up your codebase to be ready for a free online deployment. Follow these steps to get your project live on the internet!

## 1. Push Your Code to GitHub
Ensure you have created the `fundflowAi` repository on your GitHub account and pushed the latest changes.
```powershell
# Inside your project folder
git push -u origin main
```

## 2. Set Up the Free Database (Neo4j AuraDB)
Since the project relies on Neo4j for the investigation graph, you need a free cloud instance.
1. Go to [Neo4j Aura](https://neo4j.com/cloud/platform/aura-graph-database/) and sign up.
2. Create a new **Free Instance**.
3. It will generate a text file containing your `NEO4J_URI`, `NEO4J_USERNAME` (usually `neo4j`), and `NEO4J_PASSWORD`. **Save this file!**

## 3. Deploy the Backend API (Render)
Render requires a credit card if you use the "Blueprint" feature. To avoid this and deploy completely for free, create a **Web Service** manually:
1. Go to [Render.com](https://render.com/) and sign up with GitHub.
2. Go to your Dashboard and click **New+** > **Web Service**.
3. Connect your GitHub repository (`fundflowAi`).
4. Fill in the details:
   - **Name**: `fundflowai-backend` (or similar)
   - **Language**: `Python`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Select the **Free** instance type.
5. Scroll down to **Advanced** > **Environment Variables** and add:
   - `NEO4J_URI`: e.g., `neo4j+s://xxxxxx.databases.neo4j.io`
   - `NEO4J_USERNAME`: `neo4j`
   - `NEO4J_PASSWORD`: Your AuraDB password
6. Click **Create Web Service**.
7. Once Render finishes deploying, copy the **Render URL** (e.g., `https://fundflowai-backend.onrender.com`).

*(Note: Free instances on Render spin down after 15 minutes of inactivity, so the first request might take 50 seconds to wake it up).*

## 4. Deploy the Frontend Dashboard (Vercel)
Vercel provides excellent free hosting for React apps.
1. Go to [Vercel](https://vercel.com/) and sign up with GitHub.
2. Click **Add New** > **Project** and import your `fundflowAi` repository.
3. In the "Configure Project" section:
   - Framework Preset should be `Create React App`
   - **Root Directory**: Select `frontend` (it's essential to click edit and choose `frontend`).
4. Open the **Environment Variables** panel and add:
   - Key: `REACT_APP_API_URL`
   - Value: The **Render URL** you got in Step 3 (e.g., `https://fundflowai-backend.onrender.com`)
5. Click **Deploy**.

**Congratulations! Your platform is now live!**

To verify it, visit the Vercel URL provided after the frontend deployment finishes.
