import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro inesperado na renderização do cardápio:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090B] text-[#F5F3EE] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full rounded-2xl bg-[#141518] border border-[#262930] p-8 space-y-4">
            <h1 className="font-display text-xl font-bold text-white uppercase">
              Seven Lounge &amp; Drinks
            </h1>
            <p className="text-sm text-[#B9BCC3]">
              Ocorreu um problema ao carregar o cardápio. Tente atualizar a página.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-[#FF5A16] text-white font-bold text-xs hover:bg-[#FF9A52] transition-colors"
            >
              Recarregar cardápio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
