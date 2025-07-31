import { SetForm } from "@/components/dashboard/set-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewSetPage() {
  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <CardTitle>Create New Equipment Set</CardTitle>
          <CardDescription>Fill out the form below to create a new equipment set.</CardDescription>
        </CardHeader>
        <CardContent>
          <SetForm />
        </CardContent>
      </Card>
    </div>
  );
}
