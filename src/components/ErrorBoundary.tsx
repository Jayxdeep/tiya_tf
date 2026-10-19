import { Component, ErrorInfo, ReactNode } from "react";
import TitleBar from "./TitleBar";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in Tiya:", error, errorInfo);
        try {
            localStorage.setItem(
                "tiya.last_runtime_error",
                JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    time: new Date().toISOString(),
                })
            );
        } catch {}
        this.setState({ errorInfo });
    }

    private handleReset = () => {
        try {
            const stored = localStorage.getItem("tiya.workspace.v1");
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.lastProject = null;
                localStorage.setItem("tiya.workspace.v1", JSON.stringify(parsed));
            }
        } catch {}
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
                    <TitleBar />
                    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
                        <div className="max-w-xl w-full bg-slate-900 border border-red-800/60 rounded-xl p-6 shadow-2xl">
                            <div className="flex items-center gap-3 text-red-400 mb-4">
                                <AlertCircle size={28} />
                                <h1 className="text-xl font-bold">Something went wrong</h1>
                            </div>
                            <p className="text-sm text-slate-300 mb-4">
                                Tiya encountered an unexpected error during render:
                            </p>
                            <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-red-300 mb-4 overflow-x-auto border border-slate-800">
                                <p className="font-bold">{this.state.error?.message || "Unknown error"}</p>
                                {this.state.error?.stack && (
                                    <pre className="mt-2 text-[11px] text-slate-400 whitespace-pre-wrap font-mono">
                                        {this.state.error.stack}
                                    </pre>
                                )}
                                {this.state.errorInfo?.componentStack && (
                                    <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap font-mono">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
                                >
                                    <RotateCcw size={16} />
                                    Return to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
