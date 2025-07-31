/**
 * Core template interfaces for challenge/competition video system
 */

// Time-based segment structure
export interface TimeSegment {
  startTime: number; // seconds
  duration: number;  // seconds
  content: SegmentContent;
}

// Content for each segment
export interface SegmentContent {
  dialogue: DialogueElement[];
  actions: ActionElement[];
  visualElements: VisualElement[];
}

// Spoken or text content
export interface DialogueElement {
  speaker: 'gamemaster' | 'player' | 'narrator';
  text: string;
  timing: number; // offset within segment (seconds)
  isCustomizable: boolean;
}

// Physical or gameplay actions
export interface ActionElement {
  type: 'movement' | 'interaction' | 'consequence';
  description: string;
  participants: string[]; // participant IDs
  timing: number;
  isCustomizable: boolean;
}

// Visual props, effects, environment
export interface VisualElement {
  type: 'prop' | 'environment' | 'effect';
  description: string;
  timing: number;
  isCustomizable: boolean;
}

// Participant structure
export interface Participant {
  id: string;
  role: 'gamemaster' | 'player';
  name: string;
  equipment?: string[]; // e.g., ["paintball gun", "eyemask"]
  isCustomizable: boolean;
}

// Challenge configuration
export interface Challenge {
  objective: string; // "Find the key", "Reach the end line"
  targetObjects: string[]; // ["keys"], ["finish line"]
  rules: string[];
  successCondition: string;
  failureConsequence: string;
  isCustomizable: boolean;
}

// Environment/setting structure
export interface Environment {
  location: string; // "room", "outdoor course"
  props: string[]; // ["keys", "obstacles"]
  constraints: string[]; // ["enclosed space", "time limit"]
  isCustomizable: boolean;
}

// Main template structure
export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  
  // Template metadata
  metadata: {
    originalVideo: string; // URL
    duration: number; // total seconds
    difficulty: 'easy' | 'medium' | 'hard';
    minParticipants: number;
    maxParticipants: number;
  };

  // Core template structure
  challenge: Challenge;
  participants: Participant[];
  environment: Environment;
  
  // Time-based structure
  segments: {
    intro: TimeSegment;
    gameplay: TimeSegment;
    conclusion: TimeSegment;
  };

  // Customization options
  customizationOptions: {
    allowParticipantChange: boolean;
    allowChallengeChange: boolean;
    allowEnvironmentChange: boolean;
    allowDialogueChange: boolean;
  };
}

// Template instance with user customizations
export interface TemplateInstance {
  templateId: string;
  instanceId: string;
  
  // User customizations
  customizedChallenge?: Partial<Challenge>;
  customizedParticipants?: Participant[];
  customizedEnvironment?: Partial<Environment>;
  customizedDialogue?: { [segmentId: string]: DialogueElement[] };
  
  // Generation settings
  generationSettings: {
    outputFormat: 'mp4' | 'webm';
    quality: 'high' | 'medium' | 'low';
    duration?: number; // override template duration
  };
} 

/**
 * Template engine interface - defines the contract for template management systems
 * This allows for different implementations while maintaining consistent API
 */
export interface ITemplateEngine {
  // Template Management
  registerTemplate(template: ChallengeTemplate): void;
  getTemplate(templateId: string): ChallengeTemplate;
  getAvailableTemplates(): string[];
  hasTemplate(templateId: string): boolean;

  // Instance Management  
  createInstance(
    templateId: string,
    customizations?: {
      challenge?: Partial<Challenge>;
      participants?: Participant[];
      environment?: Partial<Environment>;
      dialogue?: { [segmentId: string]: DialogueElement[] };
    }
  ): TemplateInstance;
  getInstance(instanceId: string): TemplateInstance;
  deleteInstance(instanceId: string): boolean;
  getAvailableInstances(): string[];

  // Validation & Generation
  validateCustomizations(templateId: string, customizations: any): boolean;
  generateScript(instanceId: string): string;
} 