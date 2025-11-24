import { useState } from "react";
import { Upload, Zap, Plus, Sparkles } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { AIGenerator } from "./AIGenerator";

type StartScreenProps = {
    onFilesChange: (e: React.ChangeEvent<HTMLInputElement> | null, options?: any) => void;
    onAIGenerate: (prompt: string, slideCount: number, baseText?: string) => void;
    onCreateSlide: () => void;
    loading?: boolean;
};

export function StartScreen({ onFilesChange, onAIGenerate, onCreateSlide, loading }: StartScreenProps) {
    const [mode, setMode] = useState<'upload' | 'ai'>('upload');

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 md:p-6">
            <div className="w-full max-w-5xl">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 p-3 rounded-2xl">
                                <Sparkles className="text-white" size={28} />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            SlideCraft AI
                        </h1>
                    </div>
                    <p className="text-slate-400 text-base md:text-xl font-light max-w-2xl mx-auto">
                        Crie apresentações profissionais em segundos com IA ou importe seus arquivos Markdown
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-slate-800/50 backdrop-blur-xl rounded-2xl p-1.5 border border-slate-700/50 shadow-2xl">
                        <button
                            onClick={() => setMode('upload')}
                            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${mode === 'upload' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {mode === 'upload' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl shadow-lg"></div>
                            )}
                            <Upload size={20} className="relative z-10" />
                            <span className="relative z-10">Upload</span>
                        </button>
                        <button
                            onClick={() => setMode('ai')}
                            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${mode === 'ai' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {mode === 'ai' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl shadow-lg"></div>
                            )}
                            <Zap size={20} className="relative z-10" />
                            <span className="relative z-10">IA Generativa</span>
                        </button>
                        <button
                            onClick={onCreateSlide}
                            className="relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        >
                            <Plus size={20} />
                            <span>Criar Slide</span>
                        </button>
                    </div>
                </div>

                <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
                    {mode === 'upload' ? (
                        <FileUploader onFilesChange={onFilesChange} loading={loading} />
                    ) : (
                        <AIGenerator onGenerate={onAIGenerate} loading={loading} />
                    )}
                </div>
            </div>
        </div>
    );
}
