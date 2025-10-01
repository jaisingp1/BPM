'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoading } from '@/contexts/loading-context';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
}

interface PageLoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export function PageLoading({ text = 'Loading...', fullScreen = false }: PageLoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="xl" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{text}</h2>
        <p className="text-sm text-muted-foreground">Please wait a moment</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, text = 'Loading...', children }: LoadingOverlayProps) {
  return (
    <div className="relative w-full h-full">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="bg-background p-4 rounded-lg shadow-lg border">
            <LoadingSpinner size="lg" text={text} />
          </div>
        </div>
      )}
    </div>
  );
}

export function GlobalLoadingIndicator() {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-3 flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span className="text-sm font-medium">{loadingText}</span>
    </div>
  );
}