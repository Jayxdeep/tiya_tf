import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";

const getWindow = () => {
    try {
        return getCurrentWindow();
    } catch {
        return null;
    }
};

const isMac = typeof navigator !== "undefined" && (
    navigator.platform?.toLowerCase().includes("mac") ||
    navigator.userAgent?.toLowerCase().includes("mac")
);

const TitleBar = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        let active = true;
        const checkFullscreen = async () => {
            try {
                const win = getWindow();
                if (win && active) {
                    setIsFullscreen(await win.isFullscreen());
                }
            } catch {}
        };
        checkFullscreen();

        const win = getWindow();
        let unlisten: (() => void) | undefined;
        win?.onResized?.(async () => {
            if (active) {
                try {
                    setIsFullscreen(await win.isFullscreen());
                } catch {}
            }
        }).then(cleanup => { unlisten = cleanup; }).catch(() => {});

        return () => {
            active = false;
            unlisten?.();
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            const win = getWindow();
            if (!win) return;
            const current = await win.isFullscreen();
            await win.setFullscreen(!current);
            setIsFullscreen(!current);
        } catch (err) {
            console.error("Toggle fullscreen failed:", err);
        }
    };

    const handleMinimize = () => {
        try {
            getWindow()?.minimize();
        } catch (err) {
            console.error("Minimize failed:", err);
        }
    };

    const handleMaximize = async () => {
        await toggleFullscreen();
    };

    const handleClose = () => {
        try {
            getWindow()?.close();
        } catch (err) {
            console.error("Close failed:", err);
        }
    };

    return (
        <div className="h-9 w-full bg-slate-950 border-b border-slate-900 flex items-center justify-between select-none relative">
            {/* Draggable Background Area - Covers everything but stays behind content */}
            <div
                data-tauri-drag-region
                className="absolute inset-0 z-0"
                onDoubleClick={toggleFullscreen}
            />

            {/* Content Area - Above the drag region */}
            <div className="z-10 flex items-center justify-between w-full h-full pointer-events-none px-3">
                {/* Left Side: On Mac, reserve space for native traffic lights (red, yellow, green) */}
                <div className={`pointer-events-none ${isMac ? "w-20" : "w-16"}`} />

                {/* Centered Title */}
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 pointer-events-none">
                    tiya
                </div>

                {/* Window Controls: On Mac, native traffic lights on the left handle close/minimize/fullscreen; on Windows/Linux, show standard controls */}
                <div className="flex h-full pointer-events-auto items-center">
                    {isMac ? (
                        <div className="w-20 pointer-events-none" />
                    ) : (
                        <>
                            <button
                                onClick={handleMinimize}
                                className="w-10 h-full flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                                title="Minimize"
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                onClick={handleMaximize}
                                className="w-10 h-full flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                                title={isFullscreen ? "Restore" : "Maximize"}
                            >
                                <Square size={12} />
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-12 h-full flex items-center justify-center hover:bg-red-500 transition-colors group"
                                title="Close"
                            >
                                <X size={14} className="text-slate-400 group-hover:text-white" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TitleBar;
