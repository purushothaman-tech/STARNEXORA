# SPC AI

## Self-Promising Caretaker AI

**Listen → Understand → Care → Monitor → Predict → Support**

SPC AI is an AI-powered, multilingual platform designed for continuous distress monitoring, early-risk identification, explainable insights, and human-guided support for people affected by atrocities. The platform helps authorised professionals understand changes in distress over time and coordinate appropriate support.

## Project Links

**GitHub Repository:**  
https://github.com/purushothaman-tech/STARNEXORA.git

**Live Website:**  
[Add Website Link Here]

## Core Workflow

SPC AI follows a continuous support cycle: communicate, listen, understand, ask adaptive questions, confirm, track, predict, explain, review, support, reassess, and continue monitoring.

## Conversational AI

Users can communicate with SPC AI through voice or text. The system uses natural conversation instead of relying only on fixed questionnaires. Based on the user's responses, SPC AI can ask relevant follow-up questions while allowing the user to pause, skip questions, stop the conversation, or request human support.

## Multilingual Support

The platform supports English, Tamil, Hindi, Telugu, Malayalam, Kannada, and Urdu. Language selection can be applied across the interface and conversational experience, with RTL support for Urdu.

## Multimodal Signal Analysis

SPC AI can work with text, voice, behavioural, engagement, and case-context signals. These signals are combined to identify meaningful distress-related changes. Voice features are treated as supporting evidence and are not presented as a clinical diagnosis.

## Dynamic Distress Score

The platform uses a Dynamic Distress Score (DDS) to represent distress-related changes over time. The system can track the current level, trend, velocity, persistence, volatility, confidence, and data quality.

For the primary demonstration, the distress trajectory is:

**31 → 38 → 47 → 61 → 69**

After intervention, the demonstration shows:

**72 → 64 → 54**

with the status **Trend Improving**.

## Adaptive Assessment

SPC AI identifies relevant signals, detects uncertainty, and selects appropriate follow-up questions based on relevance, information value, naturalness, safety, privacy, and question fatigue. The system is designed to stop questioning when sufficient information has been collected.

## Explainable Risk Intelligence

The platform can analyse current and historical distress, trends, engagement changes, case context, and other available signals to support escalation-risk assessment. Instead of showing only a numerical risk value, SPC AI provides understandable reasons for why human attention may be needed.

## Human-in-the-Loop Support

SPC AI is designed so that **AI recommends, human professionals review, and authorised humans decide**. Potential support categories can include counselling, medical support, legal aid, financial assistance, rehabilitation support, relocation review, and witness-protection review.

## Continuous Monitoring

After an intervention, SPC AI can schedule follow-ups, reassess distress, track changes, and update the case trajectory. This creates a closed-loop process from detection to intervention and outcome tracking.

## Case Intelligence

The platform can provide aggregated intelligence across states, districts, case types, risk levels, case stages, languages, and support status. The Case Intelligence Map is designed to show trends without exposing unnecessary sensitive victim information.

## Role-Based Access

SPC AI supports four role-based experiences:

National Administrator

District Coordinator

Caseworker / Psychologist

Protected Survivor (Beneficiary)

Each role can have different dashboards, permissions, and available actions.

## Privacy and Security

The platform is designed with authentication, role-based access control, consent management, audit logging, encryption, and data minimisation. User-provided information and AI-derived insights should remain distinguishable.

## Responsible AI

SPC AI is an early-warning and decision-support platform. It does not replace counsellors, doctors, legal professionals, government officials, or emergency services. High-impact decisions remain subject to appropriate human review.

## Demonstration

The primary synthetic demonstration uses **Asha K.**, with Tamil as the preferred language and Trial as the case stage. The scenario demonstrates conversational interaction, adaptive questioning, distress tracking, risk explanation, human review, intervention, and reassessment.

All demonstration cases and data are **synthetic** and intended only for demonstration purposes.

## Technology Stack

The project uses a modern web architecture with technologies such as React or Next.js, TypeScript, Tailwind CSS, PWA, Recharts, Leaflet/GeoJSON, multilingual internationalisation, backend APIs, AI services, machine-learning models, and a structured database.

## Getting Started

```bash
git clone https://github.com/purushothaman-tech/STARNEXORA.git
cd STARNEXORA
npm install
npm run dev
