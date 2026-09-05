import { describe, expect, it } from 'vitest';
import { StudentInputSchema, ProjectIdeaSchema } from '@/lib/validators';

describe('Security Validation', () => {
  it('should reject SQL-like injection characters', () => {
    const result = StudentInputSchema.safeParse({ 
      interests: 'DROP TABLE users; --', 
      skills: 'JS' 
    });
    expect(result.success).toBe(false);
  });
});

describe('Alignment Validation', () => {
  it('should enforce exactly 6 development steps', () => {
    const badData = {
      title: 'AI Project',
      problem_statement: 'Solving a real issue for students.',
      features: ['F1', 'F2', 'F3'],
      tech_stack: ['React', 'Node'],
      development_steps: ['Step 1', 'Step 2'],
      improvements: ['Imp1', 'Imp2', 'Imp3'],
    };
    const result = ProjectIdeaSchema.safeParse(badData);
    expect(result.success).toBe(false);
  });
});