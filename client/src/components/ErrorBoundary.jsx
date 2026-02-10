import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full overflow-auto border border-gray-200 dark:border-gray-700 shadow-xl">
                        <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Error Details:</h2>
                        <pre className="text-red-500 dark:text-red-400 whitespace-pre-wrap font-mono text-sm mb-4 bg-red-50 dark:bg-red-900/10 p-4 rounded border border-red-100 dark:border-red-900/20">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Component Stack:</h2>
                        <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono text-xs bg-gray-50 dark:bg-gray-900/50 p-4 rounded border border-gray-100 dark:border-gray-700">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-brand hover:bg-brand-hover text-white rounded-lg transition-colors shadow-lg shadow-brand/20"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
