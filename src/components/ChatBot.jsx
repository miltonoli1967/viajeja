import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [robotEmotion, setRobotEmotion] = useState('normal'); // normal, happy, sad, thinking

  const chatEndRef = useRef(null);

  const [mensagens, setMensagens] = useState([
    {
      texto: 'Bem-vindo a ViajeJa!\n\nSou seu assistente virtual.\n\nPosso ajudar com:\n- Destinos e pacotes\n- Hospedagens\n- Pagamentos\n- Promocoes\n- Documentacao\n- Contato\n\nDigite sua duvida ou clique nas opcoes abaixo!',
      de: 'bot'
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [mensagens]);

  const chamarSupabaseChat = async (mensagemUsuario) => {
    const URL_FUNCAO = 'https://ribfgqtpnulruiopaqro.supabase.co/functions/v1/chat';
    const CHAVE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYmZncXRwbnVscnVpb3BhcXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODIzOTMsImV4cCI6MjA5NjM1ODM5M30.soePVl4sniP6s9rH9kGIBB-4wdEZNyYB3VdK5cIc31k';

    setRobotEmotion('thinking'); // Robô fica pensando

    try {
      const response = await fetch(URL_FUNCAO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHAVE_ANON}`
        },
        body: JSON.stringify({
          message: mensagemUsuario
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const dados = await response.json();

      if (dados.response) {
        setRobotEmotion('happy'); // Robô fica feliz!
        setTimeout(() => setRobotEmotion('normal'), 3000); // Volta ao normal depois de 3s
        return dados.response;
      } else {
        setRobotEmotion('sad'); // Robô fica triste
        setTimeout(() => setRobotEmotion('normal'), 3000);
        return 'Desculpe, nao consegui processar. Tente novamente ou entre em contato pelo WhatsApp (21) 98881-3452.';
      }

    } catch (error) {
      console.error('Erro Supabase Chat:', error);
      setRobotEmotion('sad'); // Robô fica triste com erro
      setTimeout(() => setRobotEmotion('normal'), 3000);
      return 'Erro ao conectar com a IA. Verifique sua conexao ou tente novamente mais tarde.';
    }
  };

  const respostasRapidas = {
    contato: {
      palavras: ['telefone', 'whatsapp', 'suporte', 'atendimento', 'falar', 'contato'],
      resposta: 'WhatsApp: (21) 98881-3452\nEmail: contato@viajeja.com\n\nAtendimento 24 horas!'
    },
    promocao: {
      palavras: ['promocao', 'desconto', 'oferta', 'promo'],
      resposta: 'Promocao especial!\n\nPagamento via PIX: 5% de desconto em todos os pacotes!\n\nAproveite agora!'
    }
  };

  const verificarRespostaRapida = (texto) => {
    const entrada = texto.toLowerCase();

    for (const categoria in respostasRapidas) {
      const item = respostasRapidas[categoria];
      if (item.palavras.some((palavra) => entrada.includes(palavra))) {
        return item.resposta;
      }
    }
    return null;
  };

  const enviarMensagem = async (textoOverride = null) => {
    const texto = textoOverride || input;
    if (!texto.trim()) return;

    setMensagens((prev) => [...prev, { texto, de: 'user' }]);

    if (!textoOverride) {
      setInput('');
    }

    const respostaRapida = verificarRespostaRapida(texto);

    if (respostaRapida) {
      setRobotEmotion('happy');
      setMensagens((prev) => [...prev, { texto: respostaRapida, de: 'bot' }]);
      setTimeout(() => setRobotEmotion('normal'), 2000);
      return;
    }

    setIsLoading(true);
    const respostaIA = await chamarSupabaseChat(texto);
    setIsLoading(false);
    setMensagens((prev) => [...prev, { texto: respostaIA, de: 'bot' }]);
  };

  const respostaRapida = (texto) => {
    enviarMensagem(texto);
  };

  return (
    <div className="chatbot-container">

      {isOpen && (
        <div className="chat-window">

          <div className="chat-header">
            <div className="chat-avatar-container">
              <div className={`robot-header-container robot-${robotEmotion}`}>
                <div className="robot-antenna"></div>
                <div className="robot-body">
                  <div className="robot-eyes">
                    <div className="robot-eye"></div>
                    <div className="robot-eye"></div>
                  </div>
                  <div className="robot-mouth"></div>
                </div>
              </div>
              <div>
                <div>Assistente ViajeJa</div>
                <div className="robot-status">
                  <span className="status-dot"></span>
                  <span>{robotEmotion === 'thinking' ? 'Pensando...' : 'Online'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-body">

            {mensagens.map((msg, index) => (
              <div key={index} className={msg.de === 'bot' ? 'msg-with-avatar' : ''}>
                {msg.de === 'bot' && (
                  <div className="msg-avatar"></div>
                )}
                <div className={`msg-bubble ${msg.de}`}>
                  {msg.texto}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="msg-with-avatar">
                <div className="msg-avatar"></div>
                <div className="typing-robot">
                  <div className="typing-robot-avatar"></div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div className="quick-buttons">

              <button
                onClick={() => respostaRapida('Quais destinos voces oferecem?')}
                disabled={isLoading}
              >
                Destinos
              </button>

              <button
                onClick={() => respostaRapida('Quais formas de pagamento?')}
                disabled={isLoading}
              >
                Pagamento
              </button>

              <button
                onClick={() => respostaRapida('Tem promocao?')}
                disabled={isLoading}
              >
                Promocoes
              </button>

              <button
                onClick={() => respostaRapida('contato')}
                disabled={isLoading}
              >
                Contato
              </button>

            </div>

            <div ref={chatEndRef}></div>

          </div>

          <div className="chat-footer">

            <input
              type="text"
              value={input}
              placeholder={isLoading ? 'Aguarde...' : 'Digite sua duvida...'}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !isLoading && enviarMensagem()
              }
              disabled={isLoading}
            />

            <button onClick={() => enviarMensagem()} disabled={isLoading}>
              {isLoading ? '...' : 'Enviar'}
            </button>

          </div>

        </div>
      )}

      <button
        className="chat-button-robot"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="robot-button-icon">
          <div className="robot-button-antenna"></div>
          <div className="robot-button-body">
            <div className="robot-button-eye"></div>
            <div className="robot-button-eye"></div>
          </div>
        </div>
      </button>

    </div>
  );
}