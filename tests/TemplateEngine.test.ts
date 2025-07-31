/**
 * Unit tests for TemplateEngine
 * Tests template registration, instance creation, and script generation
 */

import { TemplateEngine } from '../src/core/TemplateEngine';
import { OriginalChallengeTemplate } from '../src/templates/ChallengeTemplate';
import { ChallengeTemplate } from '../src/types/template';
import { 
  TemplateNotFoundError, 
  InstanceNotFoundError,
  DuplicateTemplateError,
  CustomizationValidationError,
  TemplateValidationError,
  InvalidInputError
} from '../src/types/errors';

describe('TemplateEngine Core Functionality', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
  });

  describe('Template Registration', () => {
    test('should register a valid template successfully', () => {
      expect(() => {
        engine.registerTemplate(OriginalChallengeTemplate);
      }).not.toThrow();

      expect(engine.hasTemplate('find-key-escape-room')).toBe(true);
      expect(engine.getAvailableTemplates()).toContain('find-key-escape-room');
    });

    test('should throw DuplicateTemplateError for duplicate registration', () => {
      engine.registerTemplate(OriginalChallengeTemplate);
      
      expect(() => {
        engine.registerTemplate(OriginalChallengeTemplate);
      }).toThrow(DuplicateTemplateError);
    });

    test('should validate template structure on registration', () => {
      const invalidTemplate = {
        ...OriginalChallengeTemplate,
        id: '', // Invalid empty ID
      } as ChallengeTemplate;

      expect(() => {
        engine.registerTemplate(invalidTemplate);
      }).toThrow(TemplateValidationError);
    });
  });

  describe('Template Retrieval', () => {
    beforeEach(() => {
      engine.registerTemplate(OriginalChallengeTemplate);
    });

    test('should retrieve registered template by ID', () => {
      const template = engine.getTemplate('find-key-escape-room');
      expect(template).toBe(OriginalChallengeTemplate);
      expect(template.name).toBe('Find the Key Challenge');
    });

    test('should throw TemplateNotFoundError for non-existent template', () => {
      expect(() => {
        engine.getTemplate('non-existent-template');
      }).toThrow(TemplateNotFoundError);
    });

    test('should return available template IDs', () => {
      const availableTemplates = engine.getAvailableTemplates();
      expect(availableTemplates).toEqual(['find-key-escape-room']);
    });
  });

  describe('Instance Creation', () => {
    beforeEach(() => {
      engine.registerTemplate(OriginalChallengeTemplate);
    });

    test('should create instance without customizations', () => {
      const instance = engine.createInstance('find-key-escape-room');
      
      expect(instance.templateId).toBe('find-key-escape-room');
      expect(instance.instanceId).toMatch(/^instance_\d+_[a-z0-9]+$/);
      expect(instance.generationSettings.outputFormat).toBe('mp4');
    });

    test('should create instance with valid customizations', () => {
      const customizations = {
        challenge: {
          objective: 'Custom racing challenge'
        },
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
        ],
        environment: {
          location: 'racing track'
        }
      };

      const instance = engine.createInstance('find-key-escape-room', customizations);
      
      expect(instance.customizedChallenge?.objective).toBe('Custom racing challenge');
      expect(instance.customizedParticipants).toHaveLength(3);
      expect(instance.customizedEnvironment?.location).toBe('racing track');
    });

    test('should throw error for non-existent template', () => {
      expect(() => {
        engine.createInstance('non-existent-template');
      }).toThrow(TemplateNotFoundError);
    });
  });

  describe('Script Generation', () => {
    beforeEach(() => {
      engine.registerTemplate(OriginalChallengeTemplate);
    });

    test('should generate script from template instance', () => {
      const instance = engine.createInstance('find-key-escape-room');
      const script = engine.generateScript(instance.instanceId);
      
      expect(script).toContain('# Video Script: Find the Key Challenge');
      expect(script).toContain('## Challenge: Find the key');
      expect(script).toContain('## Intro (0-3s)');
      expect(script).toContain('## Gameplay (3-30s)');
      expect(script).toContain('## Conclusion (30-35s)');
      expect(script).toContain('Find the key. Escape the room. Good luck, boys!');
    });

    test('should apply customizations in generated script', () => {
      const customizations = {
        challenge: {
          objective: 'Reach the finish line first'
        },
        dialogue: {
          intro: [
            {
              speaker: 'gamemaster' as const,
              text: 'Custom intro message',
              timing: 0,
              isCustomizable: true
            }
          ]
        }
      };

      const instance = engine.createInstance('find-key-escape-room', customizations);
      const script = engine.generateScript(instance.instanceId);
      
      expect(script).toContain('## Challenge: Reach the finish line first');
      expect(script).toContain('Custom intro message');
    });

    test('should throw error for non-existent instance', () => {
      expect(() => {
        engine.generateScript('non-existent-instance');
      }).toThrow(InstanceNotFoundError);
    });
  });

  describe('Instance Management', () => {
    beforeEach(() => {
      engine.registerTemplate(OriginalChallengeTemplate);
    });

    test('should retrieve created instance', () => {
      const instance = engine.createInstance('find-key-escape-room');
      const retrieved = engine.getInstance(instance.instanceId);
      
      expect(retrieved).toBe(instance);
    });

    test('should delete instance', () => {
      const instance = engine.createInstance('find-key-escape-room');
      const deleted = engine.deleteInstance(instance.instanceId);
      
      expect(deleted).toBe(true);
      expect(() => {
        engine.getInstance(instance.instanceId);
      }).toThrow(InstanceNotFoundError);
    });

    test('should list available instances', () => {
      const instance1 = engine.createInstance('find-key-escape-room');
      const instance2 = engine.createInstance('find-key-escape-room');
      
      const availableInstances = engine.getAvailableInstances();
      expect(availableInstances).toContain(instance1.instanceId);
      expect(availableInstances).toContain(instance2.instanceId);
      expect(availableInstances).toHaveLength(2);
    });
  });
}); 