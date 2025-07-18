import React from 'react';
import { detectPatterns } from '../utils/analyticsHelpers';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Info } from 'lucide-react';

const Alerts = ({ logs }) => {
  const alerts = detectPatterns(logs);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Pattern Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'warning' ? 'destructive' : 'default'}>
              {alert.type === 'warning' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
              <AlertTitle>{alert.message}</AlertTitle>
              <AlertDescription>
                {new Date(alert.timestamp).toLocaleString()}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Alerts;
