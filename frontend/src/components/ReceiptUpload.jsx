import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ReceiptUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Chama o Backend Java na porta 8080
      const response = await axios.post('http://localhost:8080/api/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      onUploadSuccess(response.data); // Passa o JSON para o pai (App.jsx)
      setFile(null); // Limpa o input
    } catch (err) {
      console.error(err);
      setError('Erro ao processar imagem. Verifique se o Backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-brand-600" />
        Nova Compra
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-brand-50 file:text-brand-700
            hover:file:bg-brand-100 cursor-pointer"
        />

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all
            flex items-center justify-center gap-2
            ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Processar Nota
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReceiptUpload;