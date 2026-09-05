import { NextRequest } from 'next/server';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { StudentInputSchema, ProjectIdeaSchema } from '@/lib/validators';
import { buildSystemPrompt } from '@/services/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = StudentInputSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.issues.map(i => i.message).join(', ') }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { interests, skills } = parseResult.data;
    const userPrompt = `Student Interests: ${interests}. Student Skills: ${skills}. Generate a unique, challenging but achievable final-year project.`;

    // ✅ Using Gemini 2.0 Flash - FASTER than 3.6 Flash
    // ✅ Using streamObject - results appear progressively
    const result = await streamObject({
      model: google('gemini-2.0-flash-exp'),
      schema: ProjectIdeaSchema,
      system: buildSystemPrompt(),
      prompt: userPrompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Fatal API Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}