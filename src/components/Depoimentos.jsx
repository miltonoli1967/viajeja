import React from 'react';

export default function Depoimentos() {
  const avaliacoes = [
    { id: 1, nome: "Carlos Eduardo", nota: 5, texto: "A viagem para Gramado foi impecável. O suporte via WhatsApp funcionou 24h!", foto: "CE" },
    { id: 2, nome: "Beatriz Santos", nota: 5, texto: "Paris foi um sonho realizado. O preço do pacote estava imbatível e o hotel era excelente.", foto: "BS" },
    { id: 3, nome: "Fernando Lima", nota: 4, texto: "Ótima experiência no Rio. O cadastro foi rápido e a confirmação do PIX foi instantânea.", foto: "FL" },
  ];

  return (
    <section className="reviews-section">
      <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#0f172a', fontWeight: '700' }}>O que dizem nossos clientes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {avaliacoes.map(item => (
          <div key={item.id} className="review-card">
            <div style={{ color: '#fbbf24', marginBottom: '10px' }}>
              {[...Array(item.nota)].map((_, i) => <i key={i} className="fa-solid fa-star" style={{ marginRight: '2px' }}></i>)}
            </div>
            <p style={{ fontStyle: 'italic', color: '#475569', marginBottom: '20px', fontSize: '0.92rem', lineHeight: '1.5' }}>"{item.texto}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#007bff', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                <span>{item.foto}</span>
              </div>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nome}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}