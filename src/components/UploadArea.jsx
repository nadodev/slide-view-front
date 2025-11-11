import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

export default function UploadArea({ onFilesChange, loading }) {
  const [splitSingle, setSplitSingle] = useState(false);
  const [delimiter, setDelimiter] = useState('---');

  const handleChange = (e) => {
    if (typeof onFilesChange === 'function') onFilesChange(e, { splitSingle, delimiter });
  };
  const inputRef = useRef(null);

  const openFilePicker = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="upload-screen">
      <h1>Aprensetação de slides</h1>
      <p>Envie os arquivos .md que representam os slides (serão ordenados por nome).</p>

      <label className="upload-area">
        <input ref={inputRef} type="file" multiple accept=".md" onChange={handleChange} />
        <Upload size={48} className="upload-icon" />
        <p className="upload-text-primary">Arraste ou selecione arquivos</p>
        <p className="upload-text-secondary">Selecione vários arquivos .md</p>
        <div style={{ height: 12 }} />
        <button type="button" className="upload-btn" onClick={openFilePicker}>Escolher arquivos</button>
      </label>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={splitSingle} onChange={(e) => setSplitSingle(e.target.checked)} />
          <span style={{ fontSize: 14 }}>Dividir arquivo único em slides</span>
        </label>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>Marcador:</span>
          <input value={delimiter} onChange={(e) => setDelimiter(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6 }} />
        </label>
      </div>
    </div>
  );
}
