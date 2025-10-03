# Discord Backend

A Node.js/Express server that powers real-time chat functionality. This guide covers local setup and troubleshooting common connectivity issues.

## Prerequisites

- Node.js 16+
- npm
- A MongoDB instance (Atlas cluster, local `mongod`, or Docker container)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and customise it:
   ```bash
   copy .env.example .env
   ```
   Update `MONGO_URI` with either:
   - A MongoDB Atlas connection string **with your current IP whitelisted**.
   - A local connection string, e.g. `mongodb://127.0.0.1:27017/discord`.
3. Start the development server:
   ```bash
   npm start
   ```

### Running MongoDB locally with Docker (optional)

If you do not have MongoDB installed locally, you can use Docker:

```bash
# start MongoDB in the background
docker run --name discord-mongo -p 27017:27017 -d mongo:6
```

Then set `MONGO_URI=mongodb://127.0.0.1:27017/discord` in your `.env` file.

## Troubleshooting MongoDB Atlas connections

- Ensure the connection string copied into `MONGO_URI` matches the credentials created in Atlas.
- In the Atlas dashboard, add your current machine IP (or `0.0.0.0/0` for testing) to the Network Access whitelist.
- After updating the whitelist, restart `npm start` so the backend retries the connection.

If the connection still fails, double-check that two-factor authentication and username/password are correct, and verify that your network allows outbound traffic on ports `27015-27017`.
