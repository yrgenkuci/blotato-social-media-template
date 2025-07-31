/**
 * Custom error classes for template system
 * Specific error types for different failure cases
 */

export class TemplateSystemError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'TemplateSystemError';
  }
}

export class TemplateNotFoundError extends TemplateSystemError {
  constructor(templateId: string) {
    super(
      `Template '${templateId}' not found. Available templates can be listed using getAvailableTemplates().`,
      'TEMPLATE_NOT_FOUND'
    );
    this.name = 'TemplateNotFoundError';
  }
}

export class TemplateValidationError extends TemplateSystemError {
  constructor(templateId: string, issues: string[]) {
    super(
      `Template '${templateId}' validation failed:\n${issues.map(issue => `  • ${issue}`).join('\n')}`,
      'TEMPLATE_VALIDATION_FAILED'
    );
    this.name = 'TemplateValidationError';
  }
}

export class CustomizationValidationError extends TemplateSystemError {
  constructor(templateId: string, issues: string[]) {
    super(
      `Customization validation failed for template '${templateId}':\n${issues.map(issue => `  • ${issue}`).join('\n')}`,
      'CUSTOMIZATION_VALIDATION_FAILED'
    );
    this.name = 'CustomizationValidationError';
  }
}

export class InstanceNotFoundError extends TemplateSystemError {
  constructor(instanceId: string) {
    super(
      `Template instance '${instanceId}' not found. Instance may have been deleted or never created.`,
      'INSTANCE_NOT_FOUND'
    );
    this.name = 'InstanceNotFoundError';
  }
}

export class DuplicateTemplateError extends TemplateSystemError {
  constructor(templateId: string) {
    super(
      `Template '${templateId}' already exists. Use a different ID or unregister the existing template first.`,
      'DUPLICATE_TEMPLATE'
    );
    this.name = 'DuplicateTemplateError';
  }
}

export class InvalidInputError extends TemplateSystemError {
  constructor(parameter: string, expectedType: string, receivedType: string) {
    super(
      `Invalid input for parameter '${parameter}': expected ${expectedType}, received ${receivedType}.`,
      'INVALID_INPUT'
    );
    this.name = 'InvalidInputError';
  }
}

export class ScriptGenerationError extends TemplateSystemError {
  constructor(instanceId: string, reason: string) {
    super(
      `Failed to generate script for instance '${instanceId}': ${reason}`,
      'SCRIPT_GENERATION_FAILED'
    );
    this.name = 'ScriptGenerationError';
  }
} 