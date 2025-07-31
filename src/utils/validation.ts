/**
 * Validation utilities for template system
 * Input validation and error checking
 */

import { ChallengeTemplate, Participant, Challenge, Environment } from '../types/template';
import { 
  TemplateValidationError, 
  CustomizationValidationError,
  InvalidInputError 
} from '../types/errors';

export class ValidationUtils {
  /**
   * Validate a complete template structure
   */
  static validateTemplate(template: ChallengeTemplate): void {
    const issues: string[] = [];

    // Required field validation
    if (!template.id || typeof template.id !== 'string') {
      issues.push('Template ID is required and must be a string');
    }

    if (!template.name || typeof template.name !== 'string') {
      issues.push('Template name is required and must be a string');
    }

    if (!template.description || typeof template.description !== 'string') {
      issues.push('Template description is required and must be a string');
    }

    // Metadata validation
    if (!template.metadata) {
      issues.push('Template metadata is required');
    } else {
      if (!template.metadata.originalVideo || !ValidationUtils.isValidUrl(template.metadata.originalVideo)) {
        issues.push('Original video URL is required and must be a valid URL');
      }

      if (!template.metadata.duration || template.metadata.duration <= 0) {
        issues.push('Duration must be a positive number');
      }

      if (template.metadata.minParticipants < 1) {
        issues.push('Minimum participants must be at least 1');
      }

      if (template.metadata.maxParticipants < template.metadata.minParticipants) {
        issues.push('Maximum participants must be greater than or equal to minimum participants');
      }
    }

    // Participants validation
    if (!Array.isArray(template.participants) || template.participants.length === 0) {
      issues.push('Template must have at least one participant');
    } else {
      const gamemasterCount = template.participants.filter(p => p.role === 'gamemaster').length;
      if (gamemasterCount === 0) {
        issues.push('Template must have at least one gamemaster');
      }
      if (gamemasterCount > 1) {
        issues.push('Template should have only one gamemaster');
      }

      template.participants.forEach((participant, index) => {
        const participantIssues = ValidationUtils.validateParticipant(participant);
        participantIssues.forEach(issue => 
          issues.push(`Participant ${index + 1}: ${issue}`)
        );
      });
    }

    // Segments validation
    if (!template.segments) {
      issues.push('Template segments are required');
    } else {
      const requiredSegments = ['intro', 'gameplay', 'conclusion'];
      requiredSegments.forEach(segment => {
        if (!template.segments[segment as keyof typeof template.segments]) {
          issues.push(`Missing required segment: ${segment}`);
        }
      });

      const totalDuration = template.segments.intro?.duration + 
                           template.segments.gameplay?.duration + 
                           template.segments.conclusion?.duration;
      
      if (Math.abs(totalDuration - template.metadata.duration) > 2) {
        issues.push(`Segment durations (${totalDuration}s) don't match template duration (${template.metadata.duration}s)`);
      }
    }

    if (issues.length > 0) {
      throw new TemplateValidationError(template.id || 'unknown', issues);
    }
  }

  /**
   * Validate template customizations
   */
  static validateCustomizations(
    template: ChallengeTemplate, 
    customizations: any
  ): void {
    const issues: string[] = [];

    // Validate participants customization
    if (customizations.participants) {
      if (!Array.isArray(customizations.participants)) {
        issues.push('Participants must be an array');
      } else {
        const participantCount = customizations.participants.length;
        
        if (participantCount < template.metadata.minParticipants) {
          issues.push(`Too few participants: ${participantCount} (minimum: ${template.metadata.minParticipants})`);
        }
        
        if (participantCount > template.metadata.maxParticipants) {
          issues.push(`Too many participants: ${participantCount} (maximum: ${template.metadata.maxParticipants})`);
        }

        const gamemasterCount = customizations.participants.filter(
          (p: Participant) => p.role === 'gamemaster'
        ).length;
        
        if (gamemasterCount === 0) {
          issues.push('At least one gamemaster is required');
        }
        
        if (gamemasterCount > 1) {
          issues.push('Only one gamemaster is allowed');
        }

        customizations.participants.forEach((participant: Participant, index: number) => {
          const participantIssues = ValidationUtils.validateParticipant(participant);
          participantIssues.forEach(issue => 
            issues.push(`Custom participant ${index + 1}: ${issue}`)
          );
        });
      }
    }

    // Validate challenge customization
    if (customizations.challenge) {
      const challengeIssues = ValidationUtils.validateChallenge(customizations.challenge);
      challengeIssues.forEach(issue => issues.push(`Challenge: ${issue}`));
    }

    // Validate environment customization
    if (customizations.environment) {
      const environmentIssues = ValidationUtils.validateEnvironment(customizations.environment);
      environmentIssues.forEach(issue => issues.push(`Environment: ${issue}`));
    }

    // Validate dialogue customization
    if (customizations.dialogue) {
      if (typeof customizations.dialogue !== 'object') {
        issues.push('Dialogue customization must be an object');
      } else {
        Object.keys(customizations.dialogue).forEach(segmentId => {
          if (!['intro', 'gameplay', 'conclusion'].includes(segmentId)) {
            issues.push(`Invalid dialogue segment: ${segmentId}. Must be 'intro', 'gameplay', or 'conclusion'`);
          }
        });
      }
    }

    if (issues.length > 0) {
      throw new CustomizationValidationError(template.id, issues);
    }
  }

  /**
   * Validate a single participant
   */
  static validateParticipant(participant: Participant): string[] {
    const issues: string[] = [];

    if (!participant.id || typeof participant.id !== 'string') {
      issues.push('Participant ID is required and must be a string');
    }

    if (!participant.name || typeof participant.name !== 'string') {
      issues.push('Participant name is required and must be a string');
    }

    if (!participant.role || !['gamemaster', 'player'].includes(participant.role)) {
      issues.push('Participant role must be either "gamemaster" or "player"');
    }

    if (participant.equipment && !Array.isArray(participant.equipment)) {
      issues.push('Participant equipment must be an array of strings');
    }

    return issues;
  }

  /**
   * Validate challenge configuration
   */
  static validateChallenge(challenge: Partial<Challenge>): string[] {
    const issues: string[] = [];

    if (challenge.objective !== undefined && (typeof challenge.objective !== 'string' || challenge.objective.trim() === '')) {
      issues.push('Objective must be a non-empty string');
    }

    if (challenge.targetObjects !== undefined && !Array.isArray(challenge.targetObjects)) {
      issues.push('Target objects must be an array of strings');
    }

    if (challenge.rules !== undefined && !Array.isArray(challenge.rules)) {
      issues.push('Rules must be an array of strings');
    }

    if (challenge.successCondition !== undefined && (typeof challenge.successCondition !== 'string' || challenge.successCondition.trim() === '')) {
      issues.push('Success condition must be a non-empty string');
    }

    if (challenge.failureConsequence !== undefined && (typeof challenge.failureConsequence !== 'string' || challenge.failureConsequence.trim() === '')) {
      issues.push('Failure consequence must be a non-empty string');
    }

    return issues;
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironment(environment: Partial<Environment>): string[] {
    const issues: string[] = [];

    if (environment.location !== undefined && (typeof environment.location !== 'string' || environment.location.trim() === '')) {
      issues.push('Location must be a non-empty string');
    }

    if (environment.props !== undefined && !Array.isArray(environment.props)) {
      issues.push('Props must be an array of strings');
    }

    if (environment.constraints !== undefined && !Array.isArray(environment.constraints)) {
      issues.push('Constraints must be an array of strings');
    }

    return issues;
  }

  /**
   * Validate input parameters
   */
  static validateInput(value: any, parameterName: string, expectedType: string): void {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (value === null || value === undefined) {
      throw new InvalidInputError(parameterName, expectedType, 'null/undefined');
    }

    if (expectedType === 'string') {
      if (typeof value !== 'string') {
        throw new InvalidInputError(parameterName, expectedType, actualType);
      }
      if (value.trim() === '') {
        throw new InvalidInputError(parameterName, 'non-empty string', 'empty string');
      }
    }

    if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
      throw new InvalidInputError(parameterName, expectedType, actualType);
    }

    if (expectedType === 'array' && !Array.isArray(value)) {
      throw new InvalidInputError(parameterName, expectedType, actualType);
    }
  }

  /**
   * Check if a string is a valid URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 