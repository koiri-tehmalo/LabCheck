'use server';

/**
 * @fileOverview Summarizes inspection reports into key findings using an AI tool.
 *
 * - summarizeInspectionReport - A function that handles the summarization process.
 * - SummarizeInspectionReportInput - The input type for the summarizeInspectionReport function.
 * - SummarizeInspectionReportOutput - The return type for the summarizeInspectionReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInspectionReportInputSchema = z.object({
  reportText: z.string().describe('The text of the inspection report to summarize.'),
});
export type SummarizeInspectionReportInput = z.infer<typeof SummarizeInspectionReportInputSchema>;

const SummarizeInspectionReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key findings in the inspection report.'),
});
export type SummarizeInspectionReportOutput = z.infer<typeof SummarizeInspectionReportOutputSchema>;

export async function summarizeInspectionReport(
  input: SummarizeInspectionReportInput
): Promise<SummarizeInspectionReportOutput> {
  return summarizeInspectionReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInspectionReportPrompt',
  input: {schema: SummarizeInspectionReportInputSchema},
  output: {schema: SummarizeInspectionReportOutputSchema},
  prompt: `You are an AI expert in summarizing inspection reports.

  Please provide a concise summary of the key findings from the following inspection report:

  Report: {{{reportText}}}
  `,
});

const summarizeInspectionReportFlow = ai.defineFlow(
  {
    name: 'summarizeInspectionReportFlow',
    inputSchema: SummarizeInspectionReportInputSchema,
    outputSchema: SummarizeInspectionReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
