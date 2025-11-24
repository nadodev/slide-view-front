import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import InteractiveSplitModal from "../../../components/InteractiveSplitModal";

type FileUploaderProps = {
    onFilesChange: (e: React.ChangeEvent<HTMLInputElement> | null, options?: any) => void;
    loading?: boolean;
};

export function FileUploader({ onFilesChange, loading }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [splitSingle, setSplitSingle] = useState(false);
    const [delimiter, setDelimiter] = useState("----'----");
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalFilename, setModalFilename] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (inputRef.current) {
            const dataTransfer = new DataTransfer();
            files.forEach((file) => dataTransfer.items.add(file));
            inputRef.current.files = dataTransfer.files;
            handleChange({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from((e.target.files || []) as File[]);
        const invalid = files.find((f) => !/\.md$/i.test(f.name));

        if (invalid) {
            toast.error("Arquivo inválido", { description: "Apenas .md é permitido." });
            return;
        }

        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 20;
            });
        }, 200);

        if (files.length === 1) {
            try {
                const txt = await files[0].text();
                if (txt.length > 5000) {
                    setModalFilename(files[0].name);
                    setModalContent(txt);
                    setShowSplitModal(true);
                    return;
                }
            } catch { }
        }

        onFilesChange(e, { splitSingle, delimiter });
    };

    return (
        <>
            <div
                className={`relative transition-all duration-300 ease-out ${isDragging
                    ? "bg-violet-500/10 border-4 border-dashed border-violet-400 rounded-2xl m-4 scale-[1.01]"
                    : "bg-gradient-to-br from-slate-800/40 to-slate-900/40"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label className={`block p-12 md:p-16 cursor-pointer ${isDragging ? 'opacity-30' : ''}`}>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept=".md"
                        onChange={handleChange}
                        className="hidden"
                        disabled={loading}
                    />
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className={`transition-all duration-500 ${isDragging ? "scale-110 rotate-6" : ""}`}>
                            <div className="relative bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-600 p-7 md:p-8 rounded-3xl shadow-2xl">
                                <Upload size={44} className="text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="text-center space-y-3">
                            <p className="text-xl md:text-2xl font-bold text-slate-100">
                                {isDragging ? "✨ Solte os arquivos aqui" : "Arraste seus arquivos .md"}
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={loading}
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 text-white font-bold rounded-2xl shadow-lg"
                        >
                            <FileText size={22} className="mr-2" />
                            {loading ? "Processando..." : "Selecionar Arquivos"}
                        </Button>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <Progress value={uploadProgress} className="h-2 w-full max-w-md" />
                        )}
                    </div>
                </label>
            </div>

            {showSplitModal && (
                <InteractiveSplitModal
                    filename={modalFilename}
                    content={modalContent}
                    onCancel={() => setShowSplitModal(false)}
                    onConfirm={(parts) => {
                        const files = parts.map((p) => new File([p.content], `${p.name}.md`, { type: 'text/markdown' }));
                        onFilesChange({ target: { files } } as any, { splitSingle: false, delimiter });
                        setShowSplitModal(false);
                    }}
                />
            )}
        </>
    );
}
