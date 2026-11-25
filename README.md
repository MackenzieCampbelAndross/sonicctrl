# SonicCtrl

> Per application audio management

## 1. Product Overview
SonicCtrl is an engineered standalone software solution designed as a high-performance per application audio management. Built upon a modern technology stack (Tauri 2, Rust, React, TypeScript, Windows Core Audio APIs), it delivers responsive, secure, and resilient capability directly to end users.

## 2. Problem Statement
Modern workflows require fast, reliable, and privacy-conscious tools that do not depend on opaque telemetry or bloated runtimes. SonicCtrl addresses the fragmentation, latency, and operational fragility found in legacy alternatives by providing a tightly integrated, local-first experience.

## 3. Product Objectives
- Provide instantaneous response times with low computational overhead.
- Ensure strict privacy and local-first data integrity without unauthorized external data transmission.
- Offer a polished, accessible, and intuitive user interface adhering to modern desktop/web ergonomics.
- Maintain high test coverage with verifiable automated builds.

## 4. Feature List
- **Application volume controls**: Comprehensive production-grade implementation.
- **Individual application volume profiles**: Comprehensive production-grade implementation.
- **Audio device switching**: Comprehensive production-grade implementation.
- **Default audio device selection**: Comprehensive production-grade implementation.
- **Custom sound profiles**: Comprehensive production-grade implementation.
- **Volume presets**: Comprehensive production-grade implementation.
- **Device discovery**: Comprehensive production-grade implementation.
- **Persistent settings**: Comprehensive production-grade implementation.
- **Background operation**: Comprehensive production-grade implementation.
- **Keyboard shortcuts**: Comprehensive production-grade implementation.

## 5. Screenshots
*(Visual previews and workflow diagrams will be captured directly from production builds and updated in subsequent release documentation).*

## 6. Architecture Overview
The system follows a clean modular architecture separating:
- **Presentation Layer**: Responsive user interface built with modern UI frameworks.
- **Core Domain Engine**: Strict business logic, state machines, and algorithmic processing.
- **Data Persistence**: Local embedded database / schema migrations with ACID guarantees.
- **Hardware & Native OS Layer**: Secure native integration layer.

Detailed architecture diagrams and sequence flows are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## 7. Technology Stack
- **Primary Stack**: Tauri 2, Rust, React, TypeScript, Windows Core Audio APIs
- **Testing**: Automated Unit, Integration, and Regression Test Suites
- **CI/CD**: Git-driven release gates and automated verification

## 8. Prerequisites
- Node.js (v20+ LTS) / npm or pnpm
- Rust Toolchain (v1.80+) where native desktop modules are employed
- Python (v3.11+) where microservices/scripts are utilized
- Git (v2.40+)

## 9. Installation Instructions
```bash
# Clone the repository
git clone https://github.com/MackenzieCampbelAndross/sonicctrl.git
cd sonicctrl

# Install dependencies
npm install # or relevant package manager per stack
```

## 10. Environment Configuration
Copy `.env.example` to `.env` and configure appropriate variables:
```bash
cp .env.example .env
```

## 11. Development Instructions
```bash
# Start development server
npm run dev
```

## 12. Production Build Instructions
```bash
# Build optimized production bundle
npm run build
```

## 13. Usage Guide
Refer to [DEVELOPMENT.md](DEVELOPMENT.md) for full interactive workflows, command shortcuts, and integration guides.

## 14. Project Structure
```text
sonicctrl/
├── src/               # Application source code
│   ├── components/    # Reusable UI widgets
│   ├── core/          # Business logic and domain models
│   ├── services/      # External integrations and native bridges
│   └── index.ts       # Entry point
├── tests/             # Automated test suites
├── docs/              # In-depth architectural designs
├── .env.example       # Sample environment configuration
├── ARCHITECTURE.md    # System architecture
├── CHANGELOG.md       # Version history
├── DEVELOPMENT.md     # Developer workflow
├── SPECIFICATION.md   # Product specification
├── TESTING.md         # QA & verification protocols
└── README.md          # Project documentation
```

## 15. Database Setup
Where local persistence is utilized, automatic schema migrations run on application startup.

## 16. API Documentation
Detailed internal API contracts and IPC message payloads are specified in [SPECIFICATION.md](SPECIFICATION.md).

## 17. Testing Instructions
```bash
# Run automated test suite
npm test
```
Refer to [TESTING.md](TESTING.md) for test matrices and performance benchmarks.

## 18. Security & Privacy Information
- No telemetry, analytics, or background tracking.
- Local data stored encrypted or in user-isolated application directories.
- Zero external transmissions without explicit user confirmation.

## 19. Known Limitations
- Initial release is optimized for desktop and modern evergreen web browsers.

## 20. Roadmap
- Phase 1: Core MVP launch with essential capabilities.
- Phase 2: Performance optimizations, custom theming, and plugin integrations.

## 21. Contribution Guidelines
Contributions must adhere to Conventional Commits, pass all quality gates, and achieve 100% test pass rates.

## 22. Licence Information
Proprietary software. All rights reserved by MackenzieCampbelAndross.

<!-- commit-log: refactor(mixer): optimize pan balance calculation using clamped absolute offsets -->