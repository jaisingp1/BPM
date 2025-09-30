'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  description?: string;
  metadata?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AuditHistoryProps {
  requestId: string;
  compact?: boolean;
}

export default function AuditHistory({ requestId, compact = false }: AuditHistoryProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(!compact);

  useEffect(() => {
    fetchAuditHistory();
  }, [requestId]);

  const fetchAuditHistory = async () => {
    try {
      const response = await fetch(`/api/requests/${requestId}/history`);
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching audit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'submitted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'updated':
        return <Eye className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      created: { label: 'Created', variant: 'default' },
      submitted: { label: 'Submitted', variant: 'secondary' },
      approved: { label: 'Approved', variant: 'default' },
      rejected: { label: 'Rejected', variant: 'destructive' },
      updated: { label: 'Updated', variant: 'outline' },
    };

    const { label, variant } = variants[action.toLowerCase()] || { 
      label: action, 
      variant: 'outline' as const 
    };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const formatMetadata = (metadata: string | null) => {
    if (!metadata) return null;
    
    try {
      const parsed = JSON.parse(metadata);
      return (
        <div className="mt-2 p-2 bg-muted rounded text-sm">
          <pre className="whitespace-pre-wrap text-xs">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>
      );
    } catch {
      return (
        <div className="mt-2 p-2 bg-muted rounded text-sm">
          {metadata}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Audit History
          </CardTitle>
          {compact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
          )}
        </div>
      </CardHeader>
      {(expanded || !compact) && (
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit history available for this request.
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {auditLogs.map((log, index) => (
                  <div key={log.id}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getActionBadge(log.action)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {log.user.name || log.user.email}
                          </span>
                        </div>
                        {log.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {log.description}
                          </p>
                        )}
                        {formatMetadata(log.metadata)}
                      </div>
                    </div>
                    {index < auditLogs.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
}