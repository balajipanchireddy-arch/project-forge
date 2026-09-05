import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
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

    // ✅ USING THE WORKING MODEL - gemini-3.6-flash
    const result = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: ProjectIdeaSchema,
      system: buildSystemPrompt(),
      prompt: userPrompt,
      temperature: 0.7,
    });

    return new Response(
      JSON.stringify(result.object),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal API Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}