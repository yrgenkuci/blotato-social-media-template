/**
 * Basic Usage Example - Video Template System
 * Demonstrates how to customize the original challenge template
 * Shows the benefit of using ITemplateEngine interface
 */

import { TemplateEngine, ITemplateEngine } from '../src/core/TemplateEngine';
import { OriginalChallengeTemplate } from '../src/templates/ChallengeTemplate';

// Using the interface for better abstraction
function setupTemplateSystem(): ITemplateEngine {
  const engine = new TemplateEngine();
  engine.registerTemplate(OriginalChallengeTemplate);
  return engine;
}

// Initialize the template engine
const engine: ITemplateEngine = setupTemplateSystem();

// Example 1: Create a customized racing challenge
const racingInstance = engine.createInstance('find-key-escape-room', {
  challenge: {
    objective: 'Reach the finish line first',
    targetObjects: ['finish line'],
    rules: [
      'Players must race to the finish line',
      'Game master monitors the race',
      'No cheating allowed',
      'First player to cross wins'
    ],
    successCondition: 'Cross the finish line first',
    failureConsequence: 'Do 10 push-ups as punishment'
  },
  participants: [
    {
      id: 'gamemaster',
      role: 'gamemaster',
      name: 'Race Official',
      equipment: ['stopwatch', 'whistle'],
      isCustomizable: true
    },
    {
      id: 'player1',
      role: 'player',
      name: 'Sarah',
      isCustomizable: true
    },
    {
      id: 'player2',
      role: 'player',
      name: 'Mike',
      isCustomizable: true
    }
  ],
  environment: {
    location: 'outdoor track',
    props: ['starting line', 'finish line', 'cones'],
    constraints: ['100 meter distance', 'straight track']
  },
  dialogue: {
    intro: [
      {
        speaker: 'gamemaster',
        text: 'Ready, set, go! First to the finish line wins!',
        timing: 0,
        isCustomizable: true
      }
    ]
  }
});

// Example 2: Create a puzzle-solving challenge
const puzzleInstance = engine.createInstance('find-key-escape-room', {
  challenge: {
    objective: 'Solve the riddle',
    targetObjects: ['correct answer'],
    successCondition: 'Provide the correct answer',
    failureConsequence: 'Sing a silly song'
  },
  participants: [
    {
      id: 'gamemaster',
      role: 'gamemaster', 
      name: 'Quiz Master',
      equipment: ['riddle cards'],
      isCustomizable: true
    },
    {
      id: 'player1',
      role: 'player',
      name: 'Alex',
      isCustomizable: true
    },
    {
      id: 'player2',
      role: 'player',
      name: 'Jordan',
      isCustomizable: true
    },
    {
      id: 'player3',
      role: 'player',
      name: 'Casey',
      isCustomizable: true
    }
  ],
  environment: {
    location: 'study room',
    props: ['riddle cards', 'timer', 'whiteboard'],
    constraints: ['2 minute time limit', 'no external help']
  }
});

// Generate scripts for both instances
console.log('=== RACING CHALLENGE SCRIPT ===');
console.log(engine.generateScript(racingInstance.instanceId));

console.log('\n=== PUZZLE CHALLENGE SCRIPT ===');
console.log(engine.generateScript(puzzleInstance.instanceId));

export { engine, racingInstance, puzzleInstance }; 