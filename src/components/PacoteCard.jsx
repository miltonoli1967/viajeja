import React, { useState, useEffect } from 'react';

export default function PacoteCard({ 
  destino, 
  estaAtivo, 
  aoSelecionar, 
  precoVooTotal, 
  hotel, 
  dataIda, 
  dataRetorno, 
  cadastro 
}) {
  // Estado para controlar qual foto está ativa na exibição
  const [fotoExibida, setFotoExibida] = useState('');

  // Sincroniza a foto inicial quando o destino muda ou carrega
  useEffect(() => {
    if (destino.fotosGaleria && destino.fotosGaleria.length > 0) {
      setFotoExibida(destino.fotosGaleria[0]);
    }
  }, [destino]);

  // Lista de fotos reais (usa o array fotosGaleria mapeado no App.jsx)
  const galeria = destino.fotosGaleria && destino.fotosGaleria.length > 0 
    ? destino.fotosGaleria 
    : [];

  // Calcula a largura de cada fatia com base na quantidade de fotos reais (3 fotos = 33.33%)
  const quantidadeFotos = galeria.length || 1;
  const larguraFatia = 100 / quantidadeFotos;

  // Seus Estilos Originais de Layout Mantidos
  const estiloCard = {
    background: '#ffffff',
    borderRadius: '14px',
    border: estaAtivo ? '2px solid #007bff' : '1px solid #e2e8f0',
    boxShadow: estaAtivo ? '0 10px 25px -5px rgba(0, 123, 255, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  const estiloContainerImagem = {
    position: 'relative',
    width: '100%',
    height: '200px',
    backgroundColor: '#cbd5e1',
    overflow: 'hidden'
  };

  const estiloImagem = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.25s ease'
  };

  const estiloGatilhoHover = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: `${larguraFatia}%`,
    zIndex: 10,
    cursor: 'ew-resize'
  };

  // Novos estilos adicionados para as miniaturas ficarem harmônicas com seu design clean
  const estiloMiniaturasContainer = {
    display: 'flex',
    gap: '6px',
    padding: '10px 20px 0 20px',
    backgroundColor: '#ffffff'
  };

  const obterEstiloMiniatura = (fotoUrl) => ({
    width: '45px',
    height: '32px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    border: fotoExibida === fotoUrl ? '2px solid #007bff' : '1px solid #cbd5e1',
    opacity: fotoExibida === fotoUrl ? 1 : 0.6,
    transition: 'all 0.2s ease'
  });

  return (
    <div style={estiloCard} onClick={aoSelecionar}>
      
      {/* ÁREA DA IMAGEM COM GATILHOS DE SENSOR PARA HOVER */}
      <div 
        style={estiloContainerImagem}
        onMouseLeave={() => setFotoExibida(galeria[0] || '')} // Volta para a primeira foto real ao tirar o mouse
      >
        <img 
          src={fotoExibida && fotoExibida.trim() !== "" ? fotoExibida : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80"} 
          alt={destino.nome || "Imagem do destino"} 
          style={estiloImagem} 
        />

        {/* Criando sensores invisíveis dinâmicos sobre a foto baseados nas fotos reais */}
        {galeria.map((fotoUrl, index) => (
          <div
            key={index}
            style={{
              ...estiloGatilhoHover,
              left: `${index * larguraFatia}%`
            }}
            onMouseEnter={() => setFotoExibida(fotoUrl)} // Altera ao passar o mouse na fatia correspondente
          />
        ))}

        {/* Badge do Status (Botão de Seleção) */}
        <span style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: estaAtivo ? '#007bff' : 'rgba(15, 23, 42, 0.6)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '700',
          zIndex: 15,
          transition: 'background-color 0.2s'
        }}>
          {estaAtivo ? '✓ Selecionado' : 'Clique para Selecionar'}
        </span>
      </div>

        {/* CARROSSEL DE MINIATURAS CLICÁVEIS */}
          <div style={estiloMiniaturasContainer} onClick={(e) => e.stopPropagation()}>
          {galeria.map((fotoUrl, index) => {
        // Ignora e não renderiza a miniatura se a URL for vazia ou inválida
          if (!fotoUrl || fotoUrl.trim() === "") return null;

    return (
      <img 
        key={index}
        src={fotoUrl} 
        alt={`Miniatura ${index + 1}`} 
        style={obterEstiloMiniatura(fotoUrl)}
        onClick={() => setFotoExibida(fotoUrl)} 
      />
    );
  })}
</div>

      

      {/* DETALHES DO DESTINO (Inalterado, mantendo seus cálculos intactos) */}
      <div style={{ padding: '15px 20px 20px 20px', flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#0f172a', fontWeight: '800' }}>{destino.nome}</h2>
        <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: '1.4' }}>{destino.desc}</p>
        
        <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: '10px', paddingTop: '10px', fontSize: '0.85rem' }}>
          <p style={{ margin: '4px 0', color: '#334155' }}>
            ✈ Voo ({estaAtivo ? 'Selecionado' : 'Preço Base'}): <strong>R$ {precoVooTotal.toLocaleString('pt-BR')}</strong>
          </p>
          <p style={{ margin: '4px 0', color: '#334155' }}>
            🏨 Hospedagem: <strong>{hotel?.nome} (R$ {hotel?.diaria}/noite)</strong>
          </p>
        </div>

        {/* CASO ATIVO: Print Simulado dos dados digitados no formulário */}
        {estaAtivo && cadastro.nomeCompleto && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', marginTop: 'auto' }}>
            <span style={{ fontWeight: '700', color: '#166534', display: 'block', marginBottom: '2px' }}>🔒 Dados da Reserva:</span>
            <div style={{ color: '#1e293b' }}>
              <strong>Nome:</strong> {cadastro.nomeCompleto} <br />
              <strong>Contato:</strong> {cadastro.email} | {cadastro.telefone} {cadastro.isWhatsapp && '(WhatsApp)'}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}