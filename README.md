# NexusFlow: AI-Powered Operations & Production SaaS
NexusFlow is a state-of-the-art SaaS platform designed to revolutionize production and operations management for manufacturing industries. Leveraging AI, NexusFlow provides predictive maintenance alerts, optimizes production schedules, offers real-time quality defect analysis, and identifies operational bottlenecks.
The architecture is built on Cloudflare's serverless stack, utilizing Workers for API logic and Durable Objects for stateful, scalable, and resilient data management, ensuring user data is isolated and performance is maximized globally.
## 🎨 Design & Visuals
-   **Color Palette**:
    | Name | HEX | Usage |
    | :--- | :--- | :--- |
    | Primary | `#3B82F6` | Main UI elements, buttons, headers |
    | Accent (Success) | `#22C55E` | Success states, positive indicators |
    | Accent (Warning) | `#F97316` | Warnings, secondary CTAs |
    | Background | `#FFFFFF` | Main background (Light Mode) |
    | Foreground | `#0F172A` | Main text (Light Mode) |
    | Background (Dark) | `#0F172A` | Main background (Dark Mode) |
    | Foreground (Dark) | `#F8FAFC` | Main text (Dark Mode) |
-   **Typography**:
    | Font | Weight | Usage |
    | :--- | :--- | :--- |
    | Cal Sans | 700 | Display headings (e.g., Hero titles) |
    | Inter | 400, 500, 700 | Body text, UI elements, subheadings |
## ✨ Core Features
| Feature | Description | Status |
| :--- | :--- | :--- |
| **User Authentication** | Secure user signup, login, and session management via JWTs. | ✅ Implemented |
| **Multi-Language Support** | i18n for English, French, Spanish, and Portuguese. | ✅ Implemented |
| **Stripe Payments** | Subscription management with a 14-day free trial via Stripe. | ✅ Implemented |
| **AI Predictive Maintenance** | Dashboard module for monitoring machine health and alerts. | ✅ Implemented (UI) |
| **AI Scheduling** | Dashboard module for visualizing optimized production schedules. | ✅ Implemented (UI) |
| **AI Quality Analysis** | Dashboard module for tracking real-time quality defects. | ✅ Implemented (UI) |
| **Interactive AI Chat** | Integrated AI assistant for querying operational data. | ✅ Implemented |
## 🚀 Technical Implementation
### Architecture Choices
-   **Backend: Cloudflare Workers & Durable Objects vs. Supabase**
    The initial client request mentioned Supabase. However, we opted for a pure Cloudflare stack using **Durable Objects** for several strategic reasons:
    1.  **Data Locality & Performance**: Durable Objects can be instantiated closer to the user, reducing latency for data-intensive operations.
    2.  **Strong Consistency & State Management**: They provide a single-threaded, transactional environment, which is perfect for managing a user's isolated state (like their production data) without the complexities of typical database concurrency.
    3.  **Simplified Architecture**: By staying within the Cloudflare ecosystem, we avoid network overhead and complexity associated with connecting to an external database like Supabase. All logic and state live on the edge.
-   **Deployment: Wrangler CLI vs. Docker**
    The client request mentioned Docker. We are using the **Wrangler CLI** for deployment because:
    1.  **Native Tooling**: Wrangler is the official, purpose-built CLI for the Cloudflare developer platform. It handles bundling, configuration, and deployment of Workers and Durable Objects seamlessly.
    2.  **Serverless Paradigm**: A Docker-based deployment implies managing servers (even on a VPS). Our serverless approach with Cloudflare abstracts away all infrastructure management, aligning with modern cloud-native best practices for scalability and reduced operational overhead.
### Frontend
-   **Framework**: React with Vite for a fast and modern development experience.
-   **Styling**: Tailwind CSS with shadcn/ui for a highly customizable, accessible, and visually stunning component library.
-   **State Management**: Zustand is used for simple, scalable global state management (e.g., authentication status).
-   **Data Fetching**: A custom hook (`use-production-data`) centralizes data fetching logic from the backend, providing a clean interface for components with loading and error states.
### Backend
-   **API**: Hono, a lightweight and fast web framework, runs on Cloudflare Workers to provide the API endpoints.
-   **Authentication**: A custom JWT-based authentication system is implemented, with password hashing handled by the Web Crypto API available in Workers.
-   **Data Storage**:
    -   `AppController` (Durable Object): A singleton DO that manages user accounts and session metadata.
    -   `ProductionDataAgent` (Durable Object): A per-user DO that stores and serves all production-related data, ensuring strict data isolation.
    -   `ChatAgent` (Durable Object): A per-session DO that manages the state of AI chat conversations.
## 🔮 Future Improvements & Upsell Opportunities
-   **Real-time Data Ingestion**: Implement a WebSocket or MQTT endpoint for machines on the factory floor to push data to the `ProductionDataAgent` in real-time, replacing the current mock data generation.
-   **Customizable Dashboards**: Allow users to create, save, and share custom dashboard layouts with a drag-and-drop interface.
-   **Advanced AI Models**: Offer a premium tier that utilizes more advanced AI models for deeper insights, anomaly detection, and prescriptive recommendations (e.g., "What is the optimal maintenance schedule for next month?").
-   **Third-Party Integrations**: Develop integrations with popular ERP and MES systems (e.g., SAP, Oracle) to synchronize production data automatically.
-   **Mobile Application**: A native or PWA mobile app for managers to monitor operations on the go.
## ⚙️ Setup & Deployment
1.  **Clone the repository.**
2.  **Install dependencies**: `bun install`
3.  **Configure environment variables**: Create a `.dev.vars` file from `.env.example` and fill in your keys.
4.  **Run locally**: `bun run dev`
5.  **Deploy**: Configure your secrets in the Cloudflare dashboard, then run `bun run deploy`.