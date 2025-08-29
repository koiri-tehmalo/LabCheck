
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UsersPage() {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">View and manage system users.</p>
      </div>

       <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Feature Unavailable</AlertTitle>
          <AlertDescription>
           User management requires server-side admin privileges which have been disabled in the current app configuration. This page is for demonstration only.
          </AlertDescription>
        </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all the users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg">
                <User className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">User list is unavailable</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    This feature requires server-side administrative access.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
