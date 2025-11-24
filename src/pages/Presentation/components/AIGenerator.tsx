import { useState } from "react";
import { Bot, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../shared/components/ui/button";

type AIGeneratorProps = {
    onGenerate: (prompt: string, slideCount: number, baseText?: string) => void;
    loading?: boolean;
};

export function AIGenerator({ onGenerate, loading }: AIGeneratorProps) {
    const [prompt, setPrompt] = useState("");
    const [slideCount, setSlideCount] = useState(6);
    const [preserveText, setPreserveText] = useState(false);
    const [baseText, setBaseText] = useState("");

    const handleGenerate = () => {
        if (!prompt.trim()) {
            toast.error("Prompt necessário");
            return;
        }
        onGenerate(prompt.trim(), slideCount, preserveText ? baseText : undefined);
    };

    return (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-12 md:p-16">
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
                <div className="relative bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 p-7 md:p-8 rounded-3xl shadow-2xl">
                    <Bot size={44} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="text-center space-y-3">
                    <p className="text-xl md:text-2xl font-bold text-slate-100">
                        ✨ Geração Inteligente de Slides
                    </p>
                    <p className="text-slate-400 max-w-2xl text-sm md:text-base">
                        Descreva seu tema e deixe nossa IA criar uma apresentação profissional completa
                    </p>
                </div>
                <div className="w-full max-w-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                        <label className="text-slate-300 font-semibold">Número de slides:</label>
                        <div className="flex items-center gap-3 ml-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSlideCount(Math.max(3, slideCount - 1))}
                                disabled={slideCount <= 3 || loading}
                                className="w-9 h-9 bg-slate-700 text-slate-200"
                            >
                                −
                            </Button>
                            <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-2 rounded-lg text-white font-bold">
                                {slideCount}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSlideCount(Math.min(12, slideCount + 1))}
                                disabled={slideCount >= 12 || loading}
                                className="w-9 h-9 bg-slate-700 text-slate-200"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Crie uma apresentação sobre os benefícios da energia solar..."
                        className="w-full h-36 px-5 py-4 bg-slate-800/80 border-2 border-slate-600 rounded-2xl text-slate-100 focus:border-emerald-500 transition-all resize-none"
                        disabled={loading}
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        size="lg"
                        className="w-full bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white font-bold rounded-2xl shadow-lg"
                    >
                        <Wand2 size={22} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                        {loading ? "Gerando..." : "✨ Gerar Apresentação"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
