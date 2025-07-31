/**
 * Video Template System Entry Point
 * Main exports for template engine and types
 */

export { TemplateEngine, ITemplateEngine } from './core/TemplateEngine';
export { OriginalChallengeTemplate } from './templates/ChallengeTemplate';
export { 
  ChallengeTemplate, 
  TemplateInstance, 
  TimeSegment,
  DialogueElement,
  ActionElement,
  VisualElement,
  Participant,
  Challenge,
  Environment
} from './types/template';
export { ValidationUtils } from './utils/validation';
export { 
  TemplateSystemError,
  TemplateNotFoundError,
  TemplateValidationError,
  CustomizationValidationError,
  InstanceNotFoundError,
  DuplicateTemplateError,
  InvalidInputError,
  ScriptGenerationError
} from './types/errors';

// Quick demonstration when run directly (for interview showcase)
if (require.main === module) {
  import('./demo-runner').then(({ runQuickDemo }) => {
    runQuickDemo();
  }).catch(console.error);
} 