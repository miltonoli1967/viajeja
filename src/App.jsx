import './App.css';
import React, { useState, useEffect } from 'react';
import PacoteCard from './components/PacoteCard';
import ChatBot from './components/ChatBot';
import emailjs from '@emailjs/browser';

// IMPORTAÇÃO DA LOGO LOCAL VIA ASSETS
import logoAgencia from './assets/logo.png';

// Mantemos os hotéis locais para a lógica interna
const apiHoteisPorDestino = {
  1: [{ id: "h1", nome: "Copacabana Palace", diaria: 450 }, { id: "h2", nome: "Windsor Horizon", diaria: 220 }],
  2: [{ id: "h3", nome: "Hotel St. Hubertus", diaria: 380 }, { id: "h4", nome: "Laghetto Universo", diaria: 190 }],
  3: [{ id: "h5", nome: "Serhs Natal Grand", diaria: 290 }, { id: "h6", nome: "Visual Praia Hotel", diaria: 150 }],
  4: [{ id: "h13", nome: "Hotel Sofitel Santa Clara", diaria: 490 }, { id: "h14", nome: "Estelar Cartagena", diaria: 210 }], 
  5: [{ id: "h7", nome: "Alvear Palace BA", diaria: 340 }, { id: "h8", nome: "Eurobuilding Plaza", diaria: 160 }],
  6: [{ id: "h9", nome: "The Ritz Paris", diaria: 680 }, { id: "h10", nome: "Hotel France Eiffel", diaria: 240 }],
  7: [{ id: "h11", nome: "Universal's Cabana", diaria: 310 }, { id: "h12", nome: "Rosen Inn Internat.", diaria: 120 }],
  8: [{ id: "h15", nome: "Shinjuku Gran Hotel", diaria: 680 }, { id: "h16", nome: "Shibuya Excel Hotel", diaria: 350 }] 
};

const listaDepoimentos = [
  { id: 1, nome: "Carlos Silva", local: "São Paulo - SP", texto: "Minha viagem para Gramado foi perfeita. O suporte da ViajeJá foi sensacional e os preços realmente cabem no bolso!", estrelas: 5, avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 2, nome: "Mariana Costa", local: "Belo Horizonte - MG", texto: "Fechei o pacote para o Rio de Janeiro e superou as expectativas. Hotel maravilhoso indicado pelo sistema e processo super simples.", estrelas: 5, avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 3, nome: "Roberto Almeida", local: "Curitiba - PR", texto: "Excelente atendimento! Viajei com toda a família para Natal e correu tudo muito bem. Recomendo de olhos fechados.", estrelas: 4, avatar: "https://i.pravatar.cc/150?img=33" }
];

export default function App() {

  // ESTADOS DE CADASTRO DO USUÁRIO (UNIFICADOS SEM DUPLICIDADE)
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [tipoLogradouro, setTipoLogradouro] = useState('Rua');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isWhatsapp, setIsWhatsapp] = useState(false);

  // ESTADOS DE CONFIGURAÇÃO DA COMPRA
  const [destinoAtivoId, setDestinoAtivoId] = useState(1);
  const [passageiros, setPassageiros] = useState(1);
  const [ciaId, setCiaId] = useState('cia-latam');
  const [hotelId, setHotelId] = useState('');
  const [pagamento, setPagamento] = useState('PIX (5% de Desconto)');
  const [dataIda, setDataIda] = useState('');
  const [dataRetorno, setDataRetorno] = useState('');

  // ESTADOS DO CARTÃO DE CRÉDITO
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validadeCartao, setValidadeCartao] = useState('');
  const [cvvCartao, setCvvCartao] = useState('');
  const [bandeiraIdentificada, setBandeiraIdentificada] = useState('');

  // ESTADOS PARA REQUISITOS DA API EXTERNA
  const [listaDestinos, setListaDestinos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState(null);

  // ESTADO PARA ARMAZENAR QUAL CARD DE DEPOIMENTO ESTÁ COM O MOUSE POR CIMA
  const [idCardFocado, setIdCardFocado] = useState(null);

  // ESTADO PARA MONITORAR RESPONSIVIDADE EM TEMPO REAL
  const [larguraJanela, setLarguraJanela] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // ═══════════════════════════════════════════════════════════════════════════════
  // FUNÇÃO ATUALIZADA: ENVIA OS DADOS VIA EMAILJS
  // ═══════════════════════════════════════════════════════════════════════════════
  const cadastrarViagemNoBanco = async () => {

    // 1. Verifica se os campos obrigatórios estão preenchidos
    if (!nomeCompleto || !email || !telefone || !dataIda || !dataRetorno) {
      alert('Por favor, preencha todos os campos obrigatórios: Nome, Email, Telefone, Data Ida e Data Volta.');
      return;
    }

    // 2. Pega o destino e hotel selecionados
    const destino = listaDestinos.find(d => d.id === destinoAtivoId);
    const hotel = hoteisDisponiveis.find(h => h.id === hotelId);

    // 3. Monta os dados para enviar (deve bater com as variáveis do template!)
    const templateParams = {
      nome: nomeCompleto,
      email: email,
      telefone: telefone,
      tipoLogradouro: tipoLogradouro,
      endereco: enderecoCompleto,
      destino: destino?.nome || 'Não informado',
      passageiros: passageiros,
      companhia: ciaId === 'cia-latam' ? 'LATAM' : ciaId === 'cia-azul' ? 'Azul' : 'GOL',
      hotel: hotel?.nome || 'Não informado',
      ida: dataIda ? new Date(dataIda).toLocaleDateString('pt-BR') : 'Não informada',
volta: dataRetorno ? new Date(dataRetorno).toLocaleDateString('pt-BR') : 'Não informada',
      pagamento: pagamento
    };

    // 4. Mostra no console para debug (aperte F12 no navegador para ver)
    console.log('Enviando dados:', templateParams);

    // 5. Envia o email usando EmailJS
    try {
      const result = await emailjs.send(
        'service_quz7wl7',        // ✅ Service ID (correto)
        'template_s539zel',       // ✅ Template ID (o que você criou no dashboard)
        templateParams,
        'fZc3YMSr5wxsiRKso'       // ✅ Public Key (correta)
      );

      console.log('✅ Email enviado com sucesso!', result);
      alert('✅ Cadastro enviado com sucesso! Entraremos em contato em breve.');

    } catch (error) {
      console.error('❌ Erro completo:', error);

      // Mensagem de erro mais amigável
      let mensagemErro = 'Erro ao enviar cadastro.\n\n';

      if (error.status === 400) {
        mensagemErro += '⚠️ Erro 400: Credenciais inválidas ou template mal configurado.\n';
        mensagemErro += 'Verifique no dashboard do EmailJS:\n';
        mensagemErro += '1. Service ID está correto\n';
        mensagemErro += '2. Template ID está correto\n';
        mensagemErro += '3. Public Key está correta\n';
        mensagemErro += '4. As variáveis do template batem com o código';
      } else if (error.status === 0) {
        mensagemErro += '⚠️ Sem conexão com a internet ou EmailJS fora do ar.';
      } else {
        mensagemErro += `Status: ${error.status}\n`;
        mensagemErro += `Texto: ${error.text}`;
      }

      alert(mensagemErro);
    }
  };
  // ═══════════════════════════════════════════════════════════════════════════════

  // Monitoramento do tamanho da tela para comportamento adaptativo
  useEffect(() => {
    const handleResize = () => setLarguraJanela(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CHAMADA FETCH CORRIGIDA EM PORTUGUÊS
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=8')
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao carregar dados da API externa.');
        return response.json();
      })
      .then((dadosDaApi) => {
        const destinosBase = [
          { id: 1, nome: "Rio de Janeiro, Brasil", fotosGaleria: ["https://picsum.photos/id/1016/600/400", "https://picsum.photos/id/1015/600/400", "https://picsum.photos/id/1019/600/400"] },
          { id: 2, nome: "Gramado, Rio Grande do Sul", fotosGaleria: ["https://picsum.photos/id/1043/600/400", "https://picsum.photos/id/1044/600/400", "https://picsum.photos/id/1048/600/400"] },
          { id: 3, nome: "Natal, Rio Grande do Norte", fotosGaleria: ["https://picsum.photos/id/1053/600/400", "https://picsum.photos/id/1054/600/400", "https://picsum.photos/id/1057/600/400"] },
          { id: 4, nome: "Cartagena, Colômbia", fotosGaleria: ["https://picsum.photos/id/1029/600/400", "https://picsum.photos/id/1031/600/400", "https://picsum.photos/id/1033/600/400"] },
          { id: 5, nome: "Buenos Aires, Argentina", fotosGaleria: ["https://picsum.photos/id/1062/600/400", "https://picsum.photos/id/1065/600/400", "https://picsum.photos/id/1069/600/400"] },
          { id: 6, nome: "Paris, França", fotosGaleria: ["https://picsum.photos/id/1047/600/400", "https://picsum.photos/id/1049/600/400", "https://picsum.photos/id/1022/600/400"] },
          { id: 7, nome: "Orlando, Estados Unidos", fotosGaleria: ["https://picsum.photos/id/1074/600/400", "https://picsum.photos/id/1075/600/400", "https://picsum.photos/id/1080/600/400"] },
          { id: 8, nome: "Tóquio, Japão", fotosGaleria: ["https://picsum.photos/id/1035/600/400", "https://picsum.photos/id/1038/600/400", "https://picsum.photos/id/1041/600/400"] }
        ];

        const descricoesPortugues = [
          "Descubra praias paradisíacas, cultura vibrante e experiências inesquecíveis.",
          "Aproveite o clima europeu, gastronomia incrível e paisagens encantadoras.",
          "Relaxe em praias maravilhosas com muito sol, conforto e lazer no Nordeste.",
          "Conheça construções históricas, mar azul cristalino e culinária internacional.",
          "Explore uma cidade elegante com cultura, tango e gastronomia de alto nível.",
          "Viva o charme europeu com passeios românticos e atrações históricas de Paris.",
          "Diversão garantida em parques temáticos e experiências mágicas para toda a família.",
          "Conheça tecnologia, tradição e uma cultura fascinante em uma viagem única no Japão."
        ];

        const resultadoMapeado = destinosBase.map((destino, index) => {
          const textoDinamicoApi = dadosDaApi[index]
            ? descricoesPortugues[index]
            : "Explore paisagens incríveis and viva momentos inesquecíveis neste destino.";

          return {
            ...destino,
            desc: `Pacote Promocional: ${textoDinamicoApi}`
          };
        });

        setListaDestinos(resultadoMapeado);
        setErroApi(null);
        setCarregando(false);
      })
      .catch((err) => {
        setErroApi(err.message);
        setCarregando(false);
      });
  }, []);

  const isCelular = larguraJanela <= 768;

  const handleNumeroCartaoChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.startsWith('4')) setBandeiraIdentificada('visa');
    else if (/^5[1-5]/.test(valor) || /^2[2-7]/.test(valor)) setBandeiraIdentificada('mastercard');
    else if (/^3[47]/.test(valor)) setBandeiraIdentificada('amex');
    else if (valor === '') setBandeiraIdentificada(''); 
    else setBandeiraIdentificada('outra'); 

    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNumeroCartao(valor);
  };

  const handleValidadeChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 2) {
      valor = `${valor.substring(0, 2)}/${valor.substring(2, 4)}`;
    }
    setValidadeCartao(valor);
  };

  const handleTelefoneChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d)/, '($1');
    }
    setTelefone(valor);
  };

  useEffect(() => {
    const hoteis = apiHoteisPorDestino[destinoAtivoId] || [];
    if (hoteis.length > 0) {
      setHotelId(hoteis[0].id);
    }
  }, [destinoAtivoId]);

  const destinoSelecionado = listaDestinos.find(d => d.id === destinoAtivoId);
  const hoteisDisponiveis = apiHoteisPorDestino[destinoAtivoId] || [];
  const hotelSelecionado = hoteisDisponiveis.find(h => h.id === hotelId) || hoteisDisponiveis[0];

  const obterPrecoVooCalculado = (idCia, idDestino) => {
    const idValido = idDestino ? Number(idDestino) : 1;
    const precoRef = (idValido * 90 + 310);
    let precoUnitario = precoRef;
    if (idCia === "cia-latam") precoUnitario = Math.round(precoRef);
    if (idCia === "cia-azul") precoUnitario = Math.round(precoRef * 1.12);
    if (idCia === "cia-gol") precoUnitario = Math.round(precoRef * 0.95);
    return precoUnitario * passageiros;
  };

  const estiloLayoutSite = {
    display: 'flex', gap: '30px', width: '100%', maxWidth: '100%',
    padding: isCelular ? '20px 15px' : '40px', boxSizing: 'border-box',
    alignItems: 'flex-start', flexDirection: isCelular ? 'column' : 'row', flexWrap: 'wrap'
  };

  const estiloPainelConfig = {
    flex: isCelular ? '1 1 100%' : '0 0 360px', width: '100%',
    background: '#f8fafc', padding: '24px 20px', borderRadius: '14px',
    border: '1px solid #e2e8f0', boxSizing: 'border-box'
  };

  const estiloGridVitrine = {
    flex: '1', width: '100%', display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px'
  };

  const estiloInputClean = {
    width: '100%', padding: '10px 12px', marginTop: '5px', marginBottom: '12px',
    border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem',
    color: '#334155', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none'
  };

  const estiloRotulo = {
    fontSize: '0.72rem', color: '#64748b', fontWeight: '700',
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'
  };

  if (carregando && listaDestinos.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontSize: '2rem' }}>🔄</span>
        <p style={{ fontWeight: 'bold' }}>Sincronizando dados com a API Externa...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>

      <div style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center 45%', color: '#ffffff', 
        padding: isCelular ? '30px 15px' : '55px 20px', width: '100%', boxSizing: 'border-box',
        borderBottom: '6px solid #0056b3', display: 'flex', flexDirection: 'column',      
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '24px',
        boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2)'
      }}>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          padding: isCelular ? '20px' : '30px 45px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.25)',
          maxWidth: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '18px', boxShadow: '0 12px 32px rgba(0,0,0,0.25)'
        }}>

          <img 
            src={logoAgencia} 
            alt="Logotipo ViajeJá" 
            style={{ 
              width: isCelular ? '90px' : '110px', height: isCelular ? '90px' : '110px',
              objectFit: 'cover', backgroundColor: '#ffffff', borderRadius: '50%',   
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', border: '3px solid rgba(255, 255, 255, 0.8)'
            }} 
          />

          <div>
            <h1 style={{ margin: '0 0 6px 0', fontSize: isCelular ? '1.8rem' : '2.5rem', fontWeight: '800', letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Agência de Viagens ViajeJá
            </h1>
            <p style={{ margin: '0', fontSize: isCelular ? '0.95rem' : '1.15rem', fontWeight: '500', opacity: 0.95, color: '#f1f5f9', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
              Encontre os melhores destinos do mundo com preços que cabem no seu bolso
            </p>
          </div>
        </div>
      </div>

      <div style={{ ...estiloLayoutSite, flex: 'none' }}>

        <aside style={estiloPainelConfig}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>
            👤 Meus Dados (Cadastro)
          </h3>

          <label style={estiloRotulo}>Nome Completo:</label>
          <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Seu Nome Completo" style={estiloInputClean} autoComplete="name" name="nome" />

          <div style={{ display: 'grid', gridTemplateColumns: isCelular ? '1fr' : '100px 1fr', gap: '8px' }}>
            <div>
              <label style={estiloRotulo}>Tipo:</label>
              <select value={tipoLogradouro} onChange={(e) => setTipoLogradouro(e.target.value)} style={estiloInputClean}>
                <option value="Rua">Rua</option>
                <option value="Avenida">Avenida</option>
                <option value="Estrada">Estrada</option>
                <option value="Travessa">Travessa</option>
              </select>
            </div>
            <div>
              <label style={estiloRotulo}>Endereço Completo:</label>
              <input type="text" value={enderecoCompleto} onChange={(e) => setEnderecoCompleto(e.target.value)} placeholder="Logradouro, número, apto" style={estiloInputClean} autoComplete="street-address" name="endereco" />
            </div>
          </div>

          <label style={estiloRotulo}>E-mail de Contato:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@provedor.com" style={estiloInputClean} autoComplete="email" name="email" />

          <label style={estiloRotulo}>Telefone Celular:</label>
          <input 
            type="tel" 
            value={telefone} 
            onChange={handleTelefoneChange} 
            placeholder="(21) 99999-9999" 
            maxLength="15" 
            style={estiloInputClean} 
            autoComplete="tel"
            name="telefone"
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer', marginBottom: '20px' }}>
            <input type="checkbox" checked={isWhatsapp} onChange={(e) => setIsWhatsapp(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            Este número celular possui WhatsApp
          </label>

          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>
              ⚙️ Opções da Viagem
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px 0' }}>
              Configurando: <strong style={{ color: '#007bff' }}>{destinoSelecionado?.nome || 'Carregando...'}</strong>
            </p>
          </div>

          <label style={estiloRotulo}>👥 Quantidade de Passageiros:</label>
          <select value={passageiros} onChange={(e) => setPassageiros(parseInt(e.target.value, 10))} style={estiloInputClean}>
            <option value={1}>1 Pessoa</option>
            <option value={2}>2 Pessoas</option>
            <option value={3}>3 Pessoas</option>
            <option value={4}>4 Pessoas</option>
          </select>

          <label style={estiloRotulo}>🛫 Linha Aérea:</label>
          <select value={ciaId} onChange={(e) => setCiaId(e.target.value)} style={estiloInputClean}>
            <option value="cia-latam">LATAM — R$ {obterPrecoVooCalculado("cia-latam", destinoAtivoId).toLocaleString('pt-BR')}</option>
            <option value="cia-azul">Azul — R$ {obterPrecoVooCalculado("cia-azul", destinoAtivoId).toLocaleString('pt-BR')}</option>
            <option value="cia-gol">GOL — R$ {obterPrecoVooCalculado("cia-gol", destinoAtivoId).toLocaleString('pt-BR')}</option>
          </select>

          <label style={estiloRotulo}>🏨 Escolha a Hospedagem:</label>
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)} style={estiloInputClean}>
            {hoteisDisponiveis.map(h => (
              <option key={h.id} value={h.id}>{h.nome} — R$ {h.diaria}/noite</option>
            ))}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={estiloRotulo}>Data Ida:</label>
              <input type="date" value={dataIda} onChange={(e) => setDataIda(e.target.value)} style={estiloInputClean} />
            </div>
            <div>
              <label style={estiloRotulo}>Data Volta:</label>
              <input type="date" value={dataRetorno} onChange={(e) => setDataRetorno(e.target.value)} style={estiloInputClean} />
            </div>
          </div>

          <label style={estiloRotulo}>💳 Forma de Pagamento:</label>
          <select value={pagamento} onChange={(e) => setPagamento(e.target.value)} style={estiloInputClean}>
            <option value="PIX (5% de Desconto)">PIX (5% de Desconto)</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Boleto Bancário">Boleto Bancário</option>
          </select>

          {pagamento === "Cartão de Crédito" && (
            <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', justifyContent: 'center', backgroundColor: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" style={{ width: '35px', height: 'auto', opacity: bandeiraIdentificada === 'visa' || !bandeiraIdentificada ? 1 : 0.2, transition: 'opacity 0.2s' }} />
                <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" style={{ width: '35px', height: 'auto', opacity: bandeiraIdentificada === 'mastercard' || !bandeiraIdentificada ? 1 : 0.2, transition: 'opacity 0.2s' }} />
                <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" style={{ width: '35px', height: 'auto', opacity: bandeiraIdentificada === 'amex' || !bandeiraIdentificada ? 1 : 0.2, transition: 'opacity 0.2s' }} />
              </div>

              <label style={estiloRotulo}>Número do Cartão:</label>
              <input type="text" value={numeroCartao} onChange={handleNumeroCartaoChange} placeholder="0000 0000 0000 0000" maxLength="19" style={estiloInputClean} autoComplete="cc-number" name="numero-cartao" />

              <label style={estiloRotulo}>Nome Impresso:</label>
              <input type="text" value={nomeCartao} onChange={(e) => setNomeCartao(e.target.value.toUpperCase())} placeholder="NOME COMO ESTÁ NO CARTÃO" style={estiloInputClean} autoComplete="cc-name" name="nome-cartao" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={estiloRotulo}>Validade:</label>
                  <input type="text" value={validadeCartao} onChange={handleValidadeChange} placeholder="MM/AA" maxLength="5" style={estiloInputClean} autoComplete="cc-exp" name="validade-cartao" />
                </div>
                <div>
                  <label style={estiloRotulo}>CVV:</label>
                  <input type="text" value={cvvCartao} onChange={(e) => setCvvCartao(e.target.value.replace(/\D/g, ''))} placeholder="000" maxLength="4" style={estiloInputClean} autoComplete="cc-csc" name="cvv-cartao" />
                </div>
              </div>
            </div>
          )}

          {/* O BOTÃO OFICIAL FOI REPOSICIONADO PARA O FIM DO FORMULÁRIO E RECEBEU A FUNÇÃO DO BANCO */}
          <div className="form-group-btn" style={{ marginTop: '10px' }}>
            <button type="button" id="btn-salvar" className="btn-confirmar" onClick={cadastrarViagemNoBanco}>
              Confirmar Cadastro e Viagem
            </button>
          </div>

        </aside>

        <main style={estiloGridVitrine}>
          {erroApi && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ef4444', fontWeight: 'bold', padding: '40px' }}>
              ❌ {erroApi}
            </p>
          )}

          {listaDestinos.map((destinoItem) => (
            <PacoteCard 
              key={destinoItem.id}
              destino={destinoItem}
              estaAtivo={destinoAtivoId === destinoItem.id}
              aoSelecionar={() => setDestinoAtivoId(destinoItem.id)}
              precoVooTotal={obterPrecoVooCalculado(destinoAtivoId === destinoItem.id ? ciaId : 'cia-latam', destinoItem.id)}
              hotel={destinoAtivoId === destinoItem.id ? hotelSelecionado : (apiHoteisPorDestino[destinoItem.id] ? apiHoteisPorDestino[destinoItem.id][0] : {nome: "Padrão", diaria: 150})}
              dataIda={destinoAtivoId === destinoItem.id ? dataIda : ''}
              dataRetorno={destinoAtivoId === destinoItem.id ? dataRetorno : ''}
              cadastro={{ nomeCompleto, enderecoCompleto, tipoLogradouro, email, telefone, isWhatsapp }}
            />
          ))}
        </main>

      </div>

      <section style={{ padding: isCelular ? '30px 15px' : '40px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', color: '#0f172a', fontSize: isCelular ? '1.4rem' : '1.75rem', fontWeight: '800', margin: '0 0 30px 0', letterSpacing: '-0.5px' }}>
          💬 O que dizem nossos VIAJANTES
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {listaDepoimentos.map((dep) => (
            <div 
              key={dep.id} 
              onMouseEnter={() => setIdCardFocado(dep.id)}
              onMouseLeave={() => setIdCardFocado(null)}
              style={{
                backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: idCardFocado === dep.id ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: idCardFocado === dep.id ? '0 12px 25px rgba(0, 0, 0, 0.08)' : '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}
            >
              <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                "{dep.texto}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={dep.avatar} alt={dep.nome} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontSize: '0.95rem', fontWeight: '700' }}>{dep.nome}</h4>
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{dep.local}</span>
                  <div style={{ color: '#fbbf24', fontSize: '0.85rem', marginTop: '2px' }}>
                    {'★'.repeat(dep.estrelas)}{'☆'.repeat(5 - dep.estrelas)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        backgroundColor: '#0f172a', color: '#94a3b8', padding: isCelular ? '24px 15px' : '30px 40px',
        fontSize: '0.82rem', borderTop: '4px solid #cbd5e1', boxSizing: 'border-box', width: '100%',
        display: 'flex', flexDirection: isCelular ? 'column' : 'row', justifyContent: 'space-between',
        alignItems: isCelular ? 'flex-start' : 'center', flexWrap: 'wrap', gap: '20px'
      }}>
        <div style={{ textAlign: 'left', minWidth: '280px' }}>
          <p style={{ margin: '0 0 4px 0', color: '#ffffff', fontWeight: '600' }}>
            &copy; {new Date().getFullYear()} Agência de Viagens ViajeJá Ltda. Todos os direitos reservados.
          </p>
          <p style={{ margin: '0' }}>
            CNPJ: 99.999.999/0001-99 — Ministério do Turismo (Cadastur): 99.99.99.99.99-9
          </p>
        </div>

        <div style={{ display: 'flex', gap: isCelular ? '12px' : '20px', flexWrap: 'wrap', flexDirection: isCelular ? 'column' : 'row' }}>
          <span style={{ cursor: 'pointer' }}>Políticas de Privacidade</span>
          <span style={{ cursor: 'pointer' }}>Termos de Uso</span>
          <span style={{ cursor: 'pointer' }}>Central de Ajuda</span>
        </div>
      </footer>
      <ChatBot /> {/* <--- ADICIONE ESTA TAG AQUI */}

    </div>
  );
}