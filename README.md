# Video Template System

## Selected Video

**Source:** [YouTube Shorts - Challenge/Competition Format](https://www.youtube.com/shorts/NjlP2_l1Wr0)  
**Duration:** 35 seconds  
**Format:** Challenge/competition with gamemaster and players

The video shows a hide-and-seek key challenge where players must find hidden keys while a blindfolded gamemaster shoots a paintball gun at the players as they search for the keys. It has a clear three-part structure: setup (0-3s), gameplay (3-30s), and conclusion with consequences (30-35s).

## Template Design Write-up

### What "Similar Structure" Means

I define "similar structure" as the underlying competition pattern that makes this video engaging:

1. **Time Structure**: Fixed segments (intro → action → conclusion) with consistent pacing
2. **Role Structure**: Defined participant roles (gamemaster monitors, players compete)  
3. **Challenge Structure**: Clear objective with success/failure conditions
4. **Narrative Structure**: Setup → tension → resolution with individual outcomes
5. **Social Structure**: Competition dynamic that creates entertainment value

### Template Abstraction Approach

The template separates what stays fixed from what can change:

**Fixed Elements:**
- Three-segment timing structure
- Gamemaster/player role relationships  
- Competition with individual consequences
- Social media engagement patterns

**Variable Elements:**
- Challenge type (keys → racing → puzzles → cooking)
- Environment (room → track → kitchen → study)
- Participant details (names, equipment, count)
- Specific dialogue and consequences

This approach lets users create completely different challenges while keeping the engaging competition format that makes the original work.

### Implementation Strategy

The template is implemented as structured TypeScript data:

```typescript
{
  segments: {
    intro: { duration: 3, dialogue: [...], actions: [...] },
    gameplay: { duration: 27, dialogue: [...], actions: [...] },
    conclusion: { duration: 5, dialogue: [...], actions: [...] }
  },
  participants: [gamemaster, ...players],
  challenge: { objective, rules, consequences },
  environment: { location, props, constraints }
}
```

All timing, dialogue, and interactions from the original video are captured with flags indicating what can be customized.

## System Architecture

The system has four main components:

- **Template Engine** (`src/core/TemplateEngine.ts`) - Handles template registration, customization, and script generation
- **Type System** (`src/types/template.ts`) - TypeScript interfaces for templates and customizations  
- **Challenge Template** (`src/templates/ChallengeTemplate.ts`) - The original video implemented as reusable data
- **Validation System** (`src/utils/validation.ts`) - Ensures customizations maintain template integrity

The engine implements an interface-based design for flexibility and testing. Templates are pure data structures that get merged with user customizations to generate video scripts.

## Quick Start

```bash
# Setup
git clone <repository-url>
cd blotato-social-media-template
npm install

# See working demo
npm run dev

# Run full transformations  
npm run demo

# Run tests
npm test
```

## Template Transformations

The system proves the template works by generating four different challenge types:

1. **Original**: Find hidden keys → paintball punishment
2. **Racing**: Sprint to finish line → push-up punishment  
3. **Puzzle**: Solve riddles → silly song punishment
4. **Cooking**: Create best dish → dish washing punishment

All maintain the 35-second structure and competitive entertainment value while having completely different content.

## Usage Example

```typescript
import { TemplateEngine, OriginalChallengeTemplate } from './src';

const engine = new TemplateEngine();
engine.registerTemplate(OriginalChallengeTemplate);

// Create custom racing challenge
const instance = engine.createInstance('find-key-escape-room', {
  challenge: { objective: 'Reach the finish line first' },
  environment: { location: 'athletics track' },
  participants: [/* custom participants */]
});

// Generate video script
const script = engine.generateScript(instance.instanceId);
```

## Project Structure

```
src/
├── core/TemplateEngine.ts       # Main engine logic
├── types/template.ts            # TypeScript interfaces
├── templates/ChallengeTemplate.ts # Original video template
├── utils/validation.ts          # Input validation
└── index.ts                     # Public exports

tests/                           # Unit tests (33 tests)
demo.ts                         # Transformation demonstrations
```

The implementation includes comprehensive testing, error handling, and TypeScript safety to ensure the template system works reliably in production.