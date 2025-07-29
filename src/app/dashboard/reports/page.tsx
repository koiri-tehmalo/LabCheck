import AiSummary from '@/components/dashboard/ai-summary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view equipment reports.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
             </div>
             <div>
                <CardTitle>AI Inspection Summary</CardTitle>
                <CardDescription>Paste an inspection report to get a quick summary of key findings.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <AiSummary />
        </CardContent>
      </Card>
    </div>
  );
}
