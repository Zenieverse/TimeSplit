<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zMMzb7iTmiAPtJgShUUNT1q1MhTyZ4PX

or https://poe.com/TimeSplit

Demo Video https://youtu.be/qJDdLQCcV40?si=Tzl1Kb2auJ_B8l8q
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

TimeSplit — Play Against Your Future Self
Category: Game + Productivity + AI Simulation
What makes it hot: Gemini 3 simulates your future decisions and turns them into a playable opponent.
What It Is
TimeSplit is a strategic simulation game where players make real-life decisions (career, money, habits, ethics, learning). Gemini 3 generates multiple future versions of the player (1 year, 5 years, 20 years later) based on their choices.
Each “future self” becomes an AI agent with:
Its own goals, regrets, confidence level
Memory of past decisions
Dynamic dialogue and strategy
The twist:
You must negotiate, debate, or compete against your future selves to unlock achievements, timelines, or optimal paths.
🧠 Gemini 3 Integration
TimeSplit is powered end-to-end by the Gemini 3 API, using it as a multi-agent simulation engine rather than a simple chatbot. Gemini 3’s advanced reasoning and long-context capabilities are used to model multiple future versions of the same player, each with distinct personalities, priorities, and memories derived from the user’s past decisions.
Gemini 3 generates:
Future Self Agents – Each agent represents a plausible future timeline (e.g., financially successful but burned out, balanced but slower growth). These agents persist across sessions and evolve as new decisions are made.
Causal Reasoning Chains – Gemini 3 evaluates how player decisions compound over time, producing believable long-term consequences rather than instant feedback.
Interactive Dialogues & Negotiations – Players can debate their future selves, ask “why” certain outcomes occurred, or challenge assumptions, with Gemini 3 maintaining consistent internal logic.
Dynamic Game Events – Gemini 3 creates unexpected life events (opportunities, crises, tradeoffs) tailored to each timeline, making every playthrough unique.
Gemini 3 is central to the experience: without its multi-perspective reasoning, memory handling, and narrative intelligence, TimeSplit would not function as a game. The AI is not a helper—it is the world, the opponents, and the future.
🧩 Core Features
Multi-agent Gemini 3 simulation
Timeline branching & convergence
Visual “decision tree” of futures
Chat + strategy gameplay loop
Replayable & deeply personal

TimeSplit – Play Against Your Future Self
Tagline
Your decisions don’t disappear. They argue back.
Inspiration
Most productivity apps tell users what to do next. TimeSplit asks a deeper question:
“Who do these decisions turn you into?”
We wanted to use Gemini 3 not as a helper—but as a simulator of identity, time, and consequence.
What It Does
TimeSplit is an interactive game where players make high-impact life decisions and then confront multiple AI-generated future versions of themselves. Each future self represents a different timeline shaped by those decisions and behaves as an autonomous agent with memory, goals, and emotional perspective.
Players can debate, negotiate, or challenge these future selves to explore tradeoffs, regrets, and opportunities—turning long-term thinking into a playable experience.
How We Built It (Gemini 3 Integration)
Gemini 3 powers the entire simulation layer:
Multi-Agent Generation: Gemini 3 creates multiple future-self agents from the same user profile, each with distinct values, tone, and priorities.
Long-Term Causal Reasoning: Decisions compound realistically over simulated years instead of producing instant outcomes.
Persistent Memory: Each agent remembers prior decisions and conversations, evolving across sessions.
Dynamic Narrative Events: Gemini 3 generates personalized life events, conflicts, and opportunities unique to each timeline.
Without Gemini 3’s reasoning depth and context handling, this application would not be possible.
Challenges We Faced
Preventing future selves from converging into similar personalities
Maintaining logical consistency across long timelines
Balancing narrative freedom with game structure
We solved this by isolating agent memory states and enforcing distinct value systems per timeline.
Accomplishments We’re Proud Of
Turning self-reflection into gameplay
Using Gemini 3 as a world simulator, not a chatbot
Creating replayable, deeply personal experiences
What’s Next
Multiplayer timeline comparison
Habit tracking tied to future simulations
Educational and career-planning modes

# TimeSplit ⏳
### Play Against Your Future Self

TimeSplit is an AI-powered decision simulation game built using the **Gemini 3 API**. It allows users to interact with multiple future versions of themselves generated from their own decisions.

## 🚀 Live Demo
👉 https://m.youtube.com/watch?v=qJDdLQCcV40

## 🧠 Powered by Gemini 3
Gemini 3 is used to:
- Generate multiple autonomous future-self agents
- Maintain long-term memory and personality consistency
- Simulate causal decision outcomes over years
- Create dynamic narrative events and dialogue

## 🕹 How It Works
1. User answers high-impact life questions
2. Gemini 3 generates 3 future selves (1y, 5y, 20y)
3. User debates or negotiates with future selves
4. Timelines evolve based on interaction outcomes

## 🛠 Tech Stack
- Gemini 3 API
- Web frontend (HTML/CSS/JS or React)
- Hosted via AI Studio / static hosting

## 📂 Repository Structure
/prompts # Gemini agent prompts
/frontend # UI components
/simulator # Timeline logic
README.md

## 🎯 Future Improvements
- Multiplayer futures
- Habit-based reinforcement
- Education & career planning modes

## 📜 License
MIT
