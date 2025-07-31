/**
 * Validation System Tests
 * Tests the core validation logic that ensures template integrity
 */

import { TemplateEngine } from '../src/core/TemplateEngine';
import { OriginalChallengeTemplate } from '../src/templates/ChallengeTemplate';
import { ValidationUtils } from '../src/utils/validation';
import { 
  CustomizationValidationError,
  TemplateValidationError,
  InvalidInputError
} from '../src/types/errors';

describe('Template Validation System', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
    engine.registerTemplate(OriginalChallengeTemplate);
  });

  describe('Participant Validation', () => {
    test('should enforce minimum participant count', () => {
      const customizations = {
        participants: [
          {
            id: 'gamemaster',
            role: 'gamemaster' as const,
            name: 'Solo Master',
            isCustomizable: true
          }
          // Only 1 participant - should fail (minimum is 3)
        ]
      };

      expect(() => {
        engine.createInstance('find-key-escape-room', customizations);
      }).toThrow(CustomizationValidationError);
    });

    test('should enforce maximum participant count', () => {
      const participants: Array<{
        id: string;
        role: 'gamemaster' | 'player';
        name: string;
        isCustomizable: boolean;
      }> = [
        {
          id: 'gamemaster',
          role: 'gamemaster' as const,
          name: 'Game Master',
          isCustomizable: true
        }
      ];

      // Add 8 players (total 9, max is 8)
      for (let i = 1; i <= 8; i++) {
        participants.push({
          id: `player${i}`,
          role: 'player' as const,
          name: `Player ${i}`,
          isCustomizable: true
        });
      }

      const customizations = { participants };

      expect(() => {
        engine.createInstance('find-key-escape-room', customizations);
      }).toThrow(CustomizationValidationError);
    });

    test('should require at least one gamemaster', () => {
      const customizations = {
        participants: [
          {
            id: 'player1',
            role: 'player' as const,
            name: 'Player 1',
            isCustomizable: true
          },
          {
            id: 'player2',
            role: 'player' as const,
            name: 'Player 2',
            isCustomizable: true
          },
          {
            id: 'player3',
            role: 'player' as const,
            name: 'Player 3',
            isCustomizable: true
          }
          // No gamemaster - should fail
        ]
      };

      expect(() => {
        engine.createInstance('find-key-escape-room', customizations);
      }).toThrow(CustomizationValidationError);
    });

    test('should allow exactly one gamemaster', () => {
      const customizations = {
        participants: [
          {
            id: 'gamemaster',
            role: 'gamemaster' as const,
            name: 'Race Official',
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

      expect(() => {
        engine.createInstance('find-key-escape-room', customizations);
      }).not.toThrow();
    });

    test('should reject multiple gamemasters', () => {
      const customizations = {
        participants: [
          {
            id: 'gamemaster1',
            role: 'gamemaster' as const,
            name: 'First Master',
            isCustomizable: true
          },
          {
            id: 'gamemaster2',
            role: 'gamemaster' as const,
            name: 'Second Master',
            isCustomizable: true
          },
          {
            id: 'player1',
            role: 'player' as const,
            name: 'Player 1',
            isCustomizable: true
          }
        ]
      };

      expect(() => {
        engine.createInstance('find-key-escape-room', customizations);
      }).toThrow(CustomizationValidationError);
    });
  });

  describe('Input Validation', () => {
    test('should validate template ID input', () => {
      expect(() => {
        engine.getTemplate('');
      }).toThrow(InvalidInputError);

      expect(() => {
        engine.getTemplate(null as any);
      }).toThrow(InvalidInputError);
    });

    test('should validate customizations object', () => {
      expect(() => {
        engine.createInstance('find-key-escape-room', null as any);
      }).toThrow(InvalidInputError);

      expect(() => {
        engine.createInstance('find-key-escape-room', 'invalid' as any);
      }).toThrow(InvalidInputError);
    });
  });

  describe('Template Structure Validation', () => {
    test('should validate required template fields', () => {
      const invalidTemplate = {
        ...OriginalChallengeTemplate,
        id: 'test-invalid-duration', // Use different ID to avoid duplicate error
        metadata: {
          ...OriginalChallengeTemplate.metadata,
          duration: -1 // Invalid negative duration
        }
      };

      expect(() => {
        engine.registerTemplate(invalidTemplate);
      }).toThrow(TemplateValidationError);
    });

    test('should validate participant count constraints', () => {
      const invalidTemplate = {
        ...OriginalChallengeTemplate,
        id: 'test-invalid-participant-count', // Use different ID to avoid duplicate error
        metadata: {
          ...OriginalChallengeTemplate.metadata,
          minParticipants: 5,
          maxParticipants: 3 // Max less than min - invalid
        }
      };

      expect(() => {
        engine.registerTemplate(invalidTemplate);
      }).toThrow(TemplateValidationError);
    });
  });

  describe('Validation Utils', () => {
    test('should validate URL format', () => {
      expect(ValidationUtils.isValidUrl('https://www.youtube.com/watch?v=123')).toBe(true);
      expect(ValidationUtils.isValidUrl('http://example.com')).toBe(true);
      expect(ValidationUtils.isValidUrl('not-a-url')).toBe(false);
      expect(ValidationUtils.isValidUrl('')).toBe(false);
    });

    test('should validate participant structure', () => {
      const validParticipant = {
        id: 'test-id',
        role: 'player' as const,
        name: 'Test Player',
        isCustomizable: true
      };

      const issues = ValidationUtils.validateParticipant(validParticipant);
      expect(issues).toHaveLength(0);

      const invalidParticipant = {
        id: '',
        role: 'invalid-role' as any,
        name: '',
        isCustomizable: true
      };

      const invalidIssues = ValidationUtils.validateParticipant(invalidParticipant);
      expect(invalidIssues.length).toBeGreaterThan(0);
    });
  });
}); 