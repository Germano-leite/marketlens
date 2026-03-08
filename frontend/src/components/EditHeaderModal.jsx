import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';

const EditHeaderModal = ({ receipt, onClose, onSave }) => {
  
  // O estado inicializa direto com os valores da nota fiscal
  const [formData, setFormData] = useState({
    supermarketName: receipt?.supermarketName || '',
    date: receipt?.date ? receipt.date.split('T')[0] : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 relative z-10">
        
        {/* Cabeçalho */}
        <div className="bg-brand-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Editar Dados da nota fiscal</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Mercado</label>
            <input
              type="text"
              name="supermarketName"
              value={formData.supermarketName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
          >
            <Save className="w-5 h-5" /> Salvar Alterações
          </button>

        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditHeaderModal;