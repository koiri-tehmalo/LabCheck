'use server';

import { summarizeInspectionReport } from '@/ai/flows/summarize-inspection-report';
import { z } from 'zod';

const SummarizeSchema = z.object({
  reportText: z.string().min(10, { message: 'Report text must be at least 10 characters long.' }),
});

export type FormState = {
  message: string;
  summary?: string;
  errors?: {
    reportText?: string[];
  }
}

export async function handleSummarize(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SummarizeSchema.safeParse({
    reportText: formData.get('reportText'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await summarizeInspectionReport({ reportText: validatedFields.data.reportText });
    return {
      message: 'Summary generated successfully.',
      summary: result.summary,
    };
  } catch (error) {
    return {
      message: 'An error occurred while generating the summary. Please try again.',
    };
  }
}
