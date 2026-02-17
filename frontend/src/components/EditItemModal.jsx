import { useState } from 'react';
import { createPortal } from 'react-dom'; // <--- 1. Importe isso
import { X, Save } from 'lucide-react';

const CATEGORIES = [
  "ACOGUE", "PADARIA", "LATICINIOS", "HORTIFRUTI", 
  "LIMPEZA", "BEBIDAS", "MERCEARIA", "HIGIENE", "OUTROS"
];

const EditItemModal = ({ item, isOpen, onClose, onSave }) => {
  // Inicializa o estado. Se item for null, usa valores vazios para não quebrar.
  const [formData, setFormData] = useState(item || {
    productName: '', category: '', subCategory: '', quantity: 0, unit: '', unitPrice: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen || !item) return null;

  // 2. O PULO DO GATO: createPortal
  // Isso renderiza o modal direto no "document.body", fora da bagunça do App
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      {/* Adicionei onClick no fundo para fechar ao clicar fora (UX melhor) */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 relative z-10">
        
        {/* Cabeçalho */}
        <div className="bg-brand-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Editar Item</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Específico</label>
              <input
                type="text"
                name="subCategory"
                placeholder="Ex: Arroz, Sabão..."
                value={formData.subCategory || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qtd</label>
              <input
                type="number"
                step="0.01"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unid.</label>
                <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none uppercase"
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm text-gray-600 border border-gray-200">
             <span>Total calculado:</span>
             <span className="font-bold text-gray-900 text-lg">
               R$ {(formData.quantity * formData.unitPrice).toFixed(2)}
             </span>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
          >
            <Save className="w-5 h-5" /> Salvar Alterações
          </button>

        </form>
      </div>
    </div>,
    document.body // <--- AQUI: Renderiza no body, ignorando qualquer z-index dos pais
  );
};

export default EditItemModal;