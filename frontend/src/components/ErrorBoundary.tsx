'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-card border border-border rounded-2xl m-4 shadow-sm">
          <h2 className="text-2xl font-black text-foreground tracking-tight mb-4 uppercase">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md">
            The application encountered an unexpected protocol error. 
            Details: {this.state.error?.message}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="rounded-xl px-12 h-14 font-black uppercase tracking-widest bg-primary"
          >
            Reset Operation
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
