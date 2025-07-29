'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { handleSummarize, type FormState } from '@/lib/actions';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Summary
        </>
      )}
    </Button>
  );
}

export default function AiSummary() {
  const [state, formAction] = useFormState(handleSummarize, initialState);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form action={formAction} className="space-y-4">
        <div>
          <Textarea
            name="reportText"
            placeholder="Paste your full inspection report text here..."
            className="min-h-[250px]"
            required
          />
          {state.errors?.reportText && (
            <p className="text-sm text-destructive mt-1">{state.errors.reportText.join(', ')}</p>
          )}
        </div>
        <SubmitButton />
      </form>
      <div className="space-y-4">
        {state.summary ? (
          <Card className="bg-secondary">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary h-5 w-5" />
                    Generated Summary
                </CardTitle>
             </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{state.summary}</p>
            </CardContent>
          </Card>
        ) : (
            <div className="flex h-full min-h-[250px] items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                    <Wand2 className="mx-auto h-10 w-10 mb-2"/>
                    <p>Your summary will appear here.</p>
                </div>
            </div>
        )}
        {state.message && !state.summary && (
            <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>
    </div>
  );
}
