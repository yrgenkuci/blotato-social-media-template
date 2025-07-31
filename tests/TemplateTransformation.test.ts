/**
 * Template Transformation Tests
 * Validates that the template creation methodology works as documented:
 * One template can generate multiple different challenge types while maintaining structure
 */

import { TemplateEngine } from '../src/core/TemplateEngine';
import { OriginalChallengeTemplate } from '../src/templates/ChallengeTemplate';

describe('Template Transformation Capability', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
    engine.registerTemplate(OriginalChallengeTemplate);
  });

  describe('Core Template Transformation Validation', () => {
    test('should maintain 3-segment structure across all transformations', () => {
      // Test original template
      const originalInstance = engine.createInstance('find-key-escape-room', {});
      const originalScript = engine.generateScript(originalInstance.instanceId);
      
      // Test racing transformation
      const racingInstance = engine.createInstance('find-key-escape-room', {
        challenge: { objective: 'Reach the finish line first' },
        environment: { location: 'racing track' }
      });
      const racingScript = engine.generateScript(racingInstance.instanceId);
      
      // Test puzzle transformation
      const puzzleInstance = engine.createInstance('find-key-escape-room', {
        challenge: { objective: 'Solve the riddle first' },
        environment: { location: 'study room' }
      });
      const puzzleScript = engine.generateScript(puzzleInstance.instanceId);

      // All should maintain the same 3-segment structure
      const segments = ['## Intro (0-3s)', '## Gameplay (3-30s)', '## Conclusion (30-35s)'];
      
      segments.forEach(segment => {
        expect(originalScript).toContain(segment);
        expect(racingScript).toContain(segment);
        expect(puzzleScript).toContain(segment);
      });
    });

    test('should allow complete challenge type transformation', () => {
      const transformations = [
        {
          name: 'Racing Challenge',
          customizations: {
            challenge: {
              objective: 'Reach the finish line first',
              targetObjects: ['finish line'],
              successCondition: 'Cross the line first',
              failureConsequence: 'Do push-ups'
            }
          }
        },
        {
          name: 'Puzzle Challenge',
          customizations: {
            challenge: {
              objective: 'Solve the riddle',
              targetObjects: ['correct answer'],
              successCondition: 'Provide correct answer',
              failureConsequence: 'Sing silly song'
            }
          }
        },
        {
          name: 'Cooking Challenge',
          customizations: {
            challenge: {
              objective: 'Create the best dish',
              targetObjects: ['finished dish'],
              successCondition: 'Win taste test',
              failureConsequence: 'Clean dishes'
            }
          }
        }
      ];

      transformations.forEach(transformation => {
        const instance = engine.createInstance('find-key-escape-room', transformation.customizations);
        const script = engine.generateScript(instance.instanceId);
        
        // Should contain the custom objective
        expect(script).toContain(`## Challenge: ${transformation.customizations.challenge.objective}`);
        
        // Should maintain video script structure
        expect(script).toContain('# Video Script: Find the Key Challenge');
        expect(script).toContain('**Location:**');
        expect(script).toContain('**Participants:**');
      });
    });

    test('should maintain gamemaster-player relationship across transformations', () => {
      const customizations = {
        participants: [
          {
            id: 'gamemaster',
            role: 'gamemaster' as const,
            name: 'Race Official',
            equipment: ['stopwatch', 'whistle'],
            isCustomizable: true
          },
          {
            id: 'player1',
            role: 'player' as const,
            name: 'Runner 1',
            isCustomizable: true
          },
          {
            id: 'player2',
            role: 'player' as const,
            name: 'Runner 2',
            isCustomizable: true
          }
        ]
      };

      const instance = engine.createInstance('find-key-escape-room', customizations);
      const script = engine.generateScript(instance.instanceId);
      
      // Should show correct participant count
      expect(script).toContain('**Participants:** 3');
      
      // Should maintain gamemaster role functionality
      expect(instance.customizedParticipants?.[0].role).toBe('gamemaster');
      expect(instance.customizedParticipants?.filter(p => p.role === 'player')).toHaveLength(2);
    });

    test('should apply dialogue customizations while maintaining timing structure', () => {
      const customizations = {
        dialogue: {
          intro: [
            {
              speaker: 'gamemaster' as const,
              text: 'Welcome to the racing challenge!',
              timing: 0,
              isCustomizable: true
            }
          ],
          gameplay: [
            {
              speaker: 'gamemaster' as const,
              text: 'On your mark, get set, GO!',
              timing: 1,
              isCustomizable: true
            }
          ],
          conclusion: [
            {
              speaker: 'gamemaster' as const,
              text: 'Great race everyone! Subscribe for more!',
              timing: 0,
              isCustomizable: true
            }
          ]
        }
      };

      const instance = engine.createInstance('find-key-escape-room', customizations);
      const script = engine.generateScript(instance.instanceId);
      
      // Should contain custom dialogue
      expect(script).toContain('Welcome to the racing challenge!');
      expect(script).toContain('On your mark, get set, GO!');
      expect(script).toContain('Great race everyone! Subscribe for more!');
      
      // Should maintain timing structure
      expect(script).toContain('## Intro (0-3s)');
      expect(script).toContain('## Gameplay (3-30s)');
      expect(script).toContain('## Conclusion (30-35s)');
    });

    test('should demonstrate template flexibility with environment changes', () => {
      const environments = [
        { location: 'professional kitchen', props: ['cooking stations', 'ingredients'] },
        { location: 'outdoor track', props: ['starting blocks', 'finish line'] },
        { location: 'study room', props: ['riddle cards', 'timer'] },
        { location: 'escape room', props: ['hidden keys', 'obstacles'] }
      ];

      environments.forEach(env => {
        const instance = engine.createInstance('find-key-escape-room', {
          environment: env
        });
        const script = engine.generateScript(instance.instanceId);
        
        expect(script).toContain(`**Location:** ${env.location}`);
      });
    });
  });

  describe('Production-Ready Validation', () => {
    test('should handle edge cases gracefully', () => {
      // Test with minimal valid customizations
      const minimalInstance = engine.createInstance('find-key-escape-room', {
        challenge: { objective: 'Simple test' }
      });
      
      expect(() => {
        engine.generateScript(minimalInstance.instanceId);
      }).not.toThrow();
    });

    test('should maintain referential integrity', () => {
      const instance1 = engine.createInstance('find-key-escape-room', {
        challenge: { objective: 'Test 1' }
      });
      
      const instance2 = engine.createInstance('find-key-escape-room', {
        challenge: { objective: 'Test 2' }
      });
      
      const script1 = engine.generateScript(instance1.instanceId);
      const script2 = engine.generateScript(instance2.instanceId);
      
      // Scripts should be different due to different objectives
      expect(script1).toContain('Test 1');
      expect(script2).toContain('Test 2');
      expect(script1).not.toContain('Test 2');
      expect(script2).not.toContain('Test 1');
    });
  });
}); 