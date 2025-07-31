/**
 * Template engine for video challenge system
 * Handles template registration, instance creation, and script generation
 */

import { 
  ChallengeTemplate, 
  TemplateInstance, 
  Challenge, 
  Participant, 
  Environment,
  DialogueElement,
  ITemplateEngine
} from '../types/template';
import { 
  TemplateNotFoundError,
  InstanceNotFoundError,
  DuplicateTemplateError,
  ScriptGenerationError,
  InvalidInputError
} from '../types/errors';
import { ValidationUtils } from '../utils/validation';

export { ITemplateEngine } from '../types/template';

export class TemplateEngine implements ITemplateEngine {
  private templates: Map<string, ChallengeTemplate> = new Map();
  private instances: Map<string, TemplateInstance> = new Map();

  /**
   * Register a new template with validation
   */
  registerTemplate(template: ChallengeTemplate): void {
    // Input validation
    ValidationUtils.validateInput(template, 'template', 'object');
    
    // Check for duplicate template ID
    if (this.templates.has(template.id)) {
      throw new DuplicateTemplateError(template.id);
    }

    // Validate template structure
    ValidationUtils.validateTemplate(template);

    this.templates.set(template.id, template);
  }

  /**
   * Get a template by ID with validation
   */
  getTemplate(templateId: string): ChallengeTemplate {
    ValidationUtils.validateInput(templateId, 'templateId', 'string');
    
    const template = this.templates.get(templateId);
    if (!template) {
      throw new TemplateNotFoundError(templateId);
    }
    
    return template;
  }

  /**
   * Get all available template IDs
   */
  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Check if a template exists
   */
  hasTemplate(templateId: string): boolean {
    ValidationUtils.validateInput(templateId, 'templateId', 'string');
    return this.templates.has(templateId);
  }

  /**
   * Create a new template instance with customizations
   */
  createInstance(
    templateId: string, 
    customizations: {
      challenge?: Partial<Challenge>;
      participants?: Participant[];
      environment?: Partial<Environment>;
      dialogue?: { [segmentId: string]: DialogueElement[] };
    } = {}
  ): TemplateInstance {
    // Input validation
    ValidationUtils.validateInput(templateId, 'templateId', 'string');
    ValidationUtils.validateInput(customizations, 'customizations', 'object');

    // Get template (throws if not found)
    const template = this.getTemplate(templateId);

    // Validate customizations
    ValidationUtils.validateCustomizations(template, customizations);

    const instanceId = this.generateInstanceId();
    
    const instance: TemplateInstance = {
      templateId,
      instanceId,
      customizedChallenge: customizations.challenge,
      customizedParticipants: customizations.participants,
      customizedEnvironment: customizations.environment,
      customizedDialogue: customizations.dialogue,
      generationSettings: {
        outputFormat: 'mp4',
        quality: 'high'
      }
    };

    this.instances.set(instanceId, instance);
    return instance;
  }

  /**
   * Validate template customizations (returns boolean for backward compatibility)
   */
  validateCustomizations(templateId: string, customizations: any): boolean {
    try {
      ValidationUtils.validateInput(templateId, 'templateId', 'string');
      ValidationUtils.validateInput(customizations, 'customizations', 'object');
      
      const template = this.getTemplate(templateId);
      ValidationUtils.validateCustomizations(template, customizations);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate video script from template instance with error handling
   */
  generateScript(instanceId: string): string {
    ValidationUtils.validateInput(instanceId, 'instanceId', 'string');

    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new InstanceNotFoundError(instanceId);
    }

    try {
      const template = this.getTemplate(instance.templateId);

      // Merge template with customizations
      const mergedTemplate = this.mergeTemplateWithCustomizations(template, instance);
      
      // Generate script
      return this.createVideoScript(mergedTemplate);
    } catch (error) {
      if (error instanceof TemplateNotFoundError) {
        throw new ScriptGenerationError(instanceId, `Template '${instance.templateId}' no longer exists`);
      }
      throw new ScriptGenerationError(instanceId, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Get instance by ID
   */
  getInstance(instanceId: string): TemplateInstance {
    ValidationUtils.validateInput(instanceId, 'instanceId', 'string');
    
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new InstanceNotFoundError(instanceId);
    }
    
    return instance;
  }

  /**
   * Delete an instance
   */
  deleteInstance(instanceId: string): boolean {
    ValidationUtils.validateInput(instanceId, 'instanceId', 'string');
    return this.instances.delete(instanceId);
  }

  /**
   * Get all instance IDs
   */
  getAvailableInstances(): string[] {
    return Array.from(this.instances.keys());
  }

  private generateInstanceId(): string {
    return `instance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private mergeTemplateWithCustomizations(
    template: ChallengeTemplate, 
    instance: TemplateInstance
  ): ChallengeTemplate {
    try {
      // Deep clone template and apply customizations
      const merged = JSON.parse(JSON.stringify(template));

      if (instance.customizedChallenge) {
        Object.assign(merged.challenge, instance.customizedChallenge);
      }

      if (instance.customizedParticipants) {
        merged.participants = instance.customizedParticipants;
      }

      if (instance.customizedEnvironment) {
        Object.assign(merged.environment, instance.customizedEnvironment);
      }

      // Apply dialogue customizations
      if (instance.customizedDialogue) {
        Object.keys(instance.customizedDialogue).forEach(segmentId => {
          if (merged.segments[segmentId as keyof typeof merged.segments]) {
            merged.segments[segmentId as keyof typeof merged.segments].content.dialogue = instance.customizedDialogue![segmentId];
          }
        });
      }

      return merged;
    } catch (error) {
      throw new Error(`Failed to merge template customizations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createVideoScript(template: ChallengeTemplate): string {
    try {
      let script = `# Video Script: ${template.name}\n\n`;
      
      script += `## Challenge: ${template.challenge.objective}\n`;
      script += `**Location:** ${template.environment.location}\n`;
      script += `**Participants:** ${template.participants.length}\n\n`;

      // Intro segment
      script += `## Intro (0-${template.segments.intro.duration}s)\n`;
      if (template.segments.intro.content.dialogue) {
        template.segments.intro.content.dialogue.forEach(dialogue => {
          script += `**${dialogue.speaker}:** "${dialogue.text}"\n`;
        });
      }

      // Gameplay segment  
      script += `\n## Gameplay (${template.segments.intro.duration}-${template.segments.intro.duration + template.segments.gameplay.duration}s)\n`;
      if (template.segments.gameplay.content.dialogue) {
        template.segments.gameplay.content.dialogue.forEach(dialogue => {
          script += `**${dialogue.speaker}:** "${dialogue.text}"\n`;
        });
      }

      // Conclusion segment
      const conclusionStart = template.segments.intro.duration + template.segments.gameplay.duration;
      script += `\n## Conclusion (${conclusionStart}-${conclusionStart + template.segments.conclusion.duration}s)\n`;
      if (template.segments.conclusion.content.dialogue) {
        template.segments.conclusion.content.dialogue.forEach(dialogue => {
          script += `**${dialogue.speaker}:** "${dialogue.text}"\n`;
        });
      }

      return script;
    } catch (error) {
      throw new Error(`Failed to create video script: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 