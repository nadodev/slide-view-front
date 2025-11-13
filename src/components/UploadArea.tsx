import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

type UploadAreaProps = {
  onFilesChange?: (e: React.ChangeEvent<HTMLInputElement> | null, options?: any) => void;
  loading?: boolean;
};

export default function UploadArea({ onFilesChange, loading }: UploadAreaProps) {
  const [splitSingle, setSplitSingle] = useState<boolean>(false);
  const [delimiter, setDelimiter] = useState<string>("----'----");
  const [localError, setLocalError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target.files || []) as File[]);
    const invalid = files.find((f: File) => !/\.md$/i.test(f.name));
    if (invalid) {
      const msg = `Arquivo inválido: ${invalid.name}. Apenas .md é permitido.`;
      setLocalError(msg);
      if (typeof onFilesChange === 'function') onFilesChange(null, { error: msg });
      return;
    }
    setLocalError('');
    if (typeof onFilesChange === 'function') onFilesChange(e, { splitSingle, delimiter });
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="upload-screen bg-gradient-to-br from-white to-gray-50 p-12 md:p-16 rounded-2xl shadow-2xl text-text max-w-3xl mx-auto text-center transition-opacity duration-300">
      <h1 className="upload-screen-title text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-1 to-primary-2">Apresentação de Slides</h1>
      <p className="upload-screen-desc text-base text-gray-600 mt-2">Envie os arquivos .md que representam os slides (serão ordenados por nome).</p>

      <label className="upload-area border-2 border-dashed rounded-[18px] px-10 py-[50px] mt-6 flex flex-col items-center justify-center text-center min-h-[220px] cursor-pointer">
        <input ref={inputRef} type="file" multiple accept=".md" onChange={handleChange} aria-label="Selecionar arquivos markdown" className="hidden" />
        <Upload size={48} className="upload-icon text-primary-1 drop-shadow-lg mb-3" />
        <p className="upload-text-primary text-lg font-semibold text-text mb-1">Arraste ou selecione arquivos</p>
        <p className="upload-text-secondary text-sm text-gray-500">Selecione vários arquivos .md</p>
        <div style={{ height: 12 }} />
        <button type="button" className="upload-btn" onClick={openFilePicker}>Escolher arquivos</button>
      </label>

      <div className="upload-options">
        <label className="upload-checkbox">
          <input type="checkbox" checked={splitSingle} onChange={(e) => setSplitSingle(e.target.checked)} />
          <span className="upload-checkbox-text">Dividir arquivo único em slides</span>
        </label>

        <label className="upload-delimiter">
          <span>Marcador:</span>
          <input 
            type="text" 
            value={delimiter} 
            onChange={(e) => setDelimiter(e.target.value)} 
            placeholder="----'----"
            aria-label="Marcador de separação de slides"
          />
        </label>
      </div>
      {localError && (
        <div role="status" aria-live="polite" className="upload-error">{localError}</div>
      )}
    </div>
  );
}
