AI Agent Launchpad

AI Agent Launchpad is a secure and community-driven platform for launching AI-driven tokens and integrating intelligent agents on the Solana blockchain. Built upon the sol-token-mill framework and the Eliza AI framework, the platform empowers users to create, manage, and interact with AI agents tied to tokens, while ensuring security, decentralized governance, and innovative features.
Table of Contents

    Features
    Technology Stack
    Getting Started
    Project Structure
    Deployment
    Contributing
    License

Features

    AI-Driven Interactions: Embed character-based AI agents into token pages for interactive user engagement.
    DAO Governance: Token-based voting on proposals, feature updates, and smart contract deployments.
    Bonding Curves: Dynamic token pricing using logarithmic bonding curves, powered by sol-token-mill.
    Referral & Rewards: Automated referral systems, burn-and-earn mechanics, and reward distribution.
    Marketplace (Future): Platform for sharing, buying, and selling AI logic modules.
    Engagement Tools: Live activity feeds, FOMO triggers, trending labels, and interactive charts.
    Video Integration: Use MuseTalk for AI-generated video introductions (optional integration).
    Security Measures: Rigorous code reviews, smart contract audits, and secure API interactions.
    Cross-Network Support: Seamless switching between Solana devnet and mainnet environments.

Technology Stack

    Blockchain: Solana, Rust, Anchor, sol-token-mill, Eliza framework
    Backend: Node.js, Express.js, Next.js API Routes
    Frontend: React, Next.js, TypeScript, Tailwind CSS
    Database: PostgreSQL, Prisma ORM
    Authentication: NextAuth.js, JWT
    Real-Time Communication: Socket.io
    DevOps & Deployment: Vercel, GitHub Actions, Docker
    Testing: Jest, React Testing Library

Getting Started
Prerequisites

    Node.js: Version 14.x or higher
    npm or Yarn: Package managers for JavaScript
    Git: Version control system
    PostgreSQL: Relational database system
    Docker (Optional): For containerization and managing services
    Solana CLI: For interacting with the Solana blockchain
    Rust & Anchor: For Solana smart contract development

Installation

    Clone the Repository:

git clone https://github.com/icch89/yozoon.git
cd yozoon

Install Dependencies:

npm install
# or
yarn install

Configure Environment Variables:

Create a .env file in the root directory and set required variables for Solana network configuration, database connection, and API keys as per your environment.

Setup Database:

Ensure PostgreSQL is installed and running. Configure your database credentials in the .env file and run:

npx prisma migrate dev --name init

Run the Development Server:

    npm run dev
    # or
    yarn dev

    The application should now be running on http://localhost:3000.

Project Structure

/contracts        # Solana smart contracts built with Rust and Anchor
/src              # Frontend and backend source code
/src/pages        # Next.js pages
/src/api          # Backend API routes for smart contract interactions
/src/components   # React components
/prisma           # Prisma schema and migration files
/tests            # Testing scripts and configurations

Deployment

To deploy AI Agent Launchpad:

    Configure environment variables for the production environment.

    Build the frontend and backend:

npm run build
# or
yarn build

Deploy smart contracts to Solana mainnet, integrate with the sol-token-mill pipeline, and ensure proper configuration for mainnet usage.

Use GitHub Actions or your chosen CI/CD pipeline to deploy to Vercel or a similar hosting provider.

Validate the deployment, switch configuration flags for mainnet, and conduct final tests on live environment.
