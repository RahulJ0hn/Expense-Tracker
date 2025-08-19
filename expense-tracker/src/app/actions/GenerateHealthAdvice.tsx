'use server';
import { generateAIHealthAdvice } from '@/lib/ai';

export default async function GenerateHealthAdvice(prompt: string): Promise<string> {
  return await generateAIHealthAdvice(prompt);
} 