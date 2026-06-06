import React from 'react';

export default function FiltroBusca() {
  return (
    <aside className="sidebar" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px', color: '#0f172a' }}>
        👤 Meus Dados (Cadastro)
      </h2>
      
      {/* Campos de cadastro protegidos e intactos */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: '700', marginBottom: '5px', color: '#475569', fontSize: '0.85rem' }}>NOME COMPLETO:</label>
        <input type="text" placeholder="Milton Silva Oliveira" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
      </div>

      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: '700', marginBottom: '5px', color: '#475569', fontSize: '0.85rem' }}>E-MAIL DE CONTATO:</label>
        <input type="email" placeholder="miltonoll1967@gmail.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
      </div>

      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: '700', marginBottom: '5px', color: '#475569', fontSize: '0.85rem' }}>TELEFONE CELULAR:</label>
        <input type="text" placeholder="(21) 98881-3452" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '20px 0 15px 0', color: '#0f172a' }}>
        ⚙️ Opções da Viagem
      </h2>

      {/* Seletor de forma de pagamento */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '700', marginBottom: '5px', color: '#475569', fontSize: '0.85rem' }}>FORMA DE PAGAMENTO:</label>
        <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #007bff', backgroundColor: '#ffffff', fontWeight: '600' }}>
          <option>PIX (5% de Desconto)</option>
          <option>Cartão de Crédito</option>
          <option>Boleto Bancário</option>
        </select>
      </div>

      {/* FORÇANDO O BOTÃO A APARECER COM ESTILO INLINE AZUL E TEXTO BRANCO */}
      <div className="form-group-btn">
        <button 
          type="submit" 
          id="btn-salvar" 
          className="btn-confirmar"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#3671b1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            textTransform: 'uppercase',
            boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)'
          }}
        >
          Confirmar Viagem
        </button>
      </div>
    </aside>
  );
}