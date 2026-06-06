import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const chatEndRef = useRef(null);

  const [mensagens, setMensagens] = useState([
    {
      texto:
        '🌎 Bem-vindo à Agência de Viagens!\n\n' +
        'Posso ajudar você com:\n\n' +
        '✈️ Destinos\n' +
        '🏨 Hospedagens\n' +
        '💳 Pagamentos\n' +
        '🎁 Promoções\n' +
        '📄 Documentação\n' +
        '📞 Atendimento\n\n' +
        'Clique em uma opção abaixo ou digite sua dúvida.',
      de: 'bot'
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [mensagens]);

  const respostasPredefinidas = {
    saudacao: {
      palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
      resposta:
        'Olá! Seja bem-vindo à nossa Agência de Viagens. Como posso ajudar?'
    },

    destinos: {
      palavras: ['destino', 'destinos', 'viagem', 'viagens'],
      resposta:
        'Temos pacotes para Rio de Janeiro, Gramado, Natal, Cartagena, Buenos Aires, Paris, Orlando e Tóquio.'
    },

    preco: {
      palavras: ['preço', 'precos', 'valor', 'quanto custa', 'custo'],
      resposta:
        'Os valores variam conforme destino, voo e hospedagem escolhidos.'
    },

    pagamento: {
      palavras: ['pagamento', 'pix', 'cartão', 'cartao', 'boleto'],
      resposta:
        'Aceitamos PIX com 5% de desconto, Cartão de Crédito e Boleto Bancário.'
    },

    hotel: {
      palavras: ['hotel', 'hospedagem', 'quarto'],
      resposta:
        'Cada destino possui opções de hospedagem disponíveis.'
    },

    voo: {
      palavras: ['voo', 'avião', 'aviao', 'passagem'],
      resposta:
        'Após escolher um destino você poderá selecionar a companhia aérea disponível.'
    },

    passageiros: {
      palavras: ['passageiros', 'pessoas', 'família', 'familia'],
      resposta:
        'Você pode selecionar a quantidade de passageiros durante a reserva.'
    },

    cadastro: {
      palavras: ['cadastro', 'dados', 'registro'],
      resposta:
        'Preencha seus dados pessoais no formulário para prosseguir com a reserva.'
    },

    promocao: {
      palavras: ['promoção', 'promocao', 'desconto', 'oferta'],
      resposta:
        'Pagamentos via PIX recebem 5% de desconto.'
    },

    documentos: {
      palavras: ['documento', 'documentos', 'passaporte', 'rg'],
      resposta:
        'Viagens nacionais exigem RG válido. Viagens internacionais podem exigir passaporte.'
    },

    contato: {
      palavras: ['telefone', 'whatsapp', 'suporte', 'atendimento'],
      resposta:
        'Nosso suporte funciona 24 horas pelo WhatsApp: (21) 98881-3452.'
    },

    reserva: {
      palavras: ['reservar', 'reserva', 'comprar'],
      resposta:
        'Para reservar, preencha seus dados, escolha destino, hospedagem, voo e forma de pagamento.'
    },

    ajuda: {
      palavras: ['ajuda', 'help'],
      resposta:
        'Posso ajudar com destinos, hospedagens, pagamentos, documentos e reservas.'
    }
  };

  const buscarResposta = (texto) => {
    const entrada = texto.toLowerCase();

    let resposta =
      'Não encontrei uma resposta para sua pergunta. Tente perguntar sobre destinos, hotéis, voos, pagamentos ou promoções.';

    for (const categoria in respostasPredefinidas) {
      const item = respostasPredefinidas[categoria];

      if (
        item.palavras.some((palavra) =>
          entrada.includes(palavra)
        )
      ) {
        resposta = item.resposta;
        break;
      }
    }

    return resposta;
  };

  const respostaRapida = (texto) => {
    const resposta = buscarResposta(texto);

    setMensagens((prev) => [
      ...prev,
      { texto, de: 'user' },
      { texto: resposta, de: 'bot' }
    ]);
  };

  const enviarMensagem = () => {
    if (!input.trim()) return;

    const resposta = buscarResposta(input);

    setMensagens((prev) => [
      ...prev,
      {
        texto: input,
        de: 'user'
      },
      {
        texto: resposta,
        de: 'bot'
      }
    ]);

    setInput('');
  };

  return (
    <div className="chatbot-container">

      {isOpen && (
        <div className="chat-window">

          <div className="chat-header">
            🤖 Assistente de Viagens
          </div>

          <div className="chat-body">

            {mensagens.map((msg, index) => (
              <div
                key={index}
                className={`msg ${msg.de}`}
              >
                {msg.texto}
              </div>
            ))}

            <div className="quick-buttons">

              <button
                onClick={() =>
                  respostaRapida('destinos')
                }
              >
                🌎 Destinos
              </button>

              <button
                onClick={() =>
                  respostaRapida('pagamento')
                }
              >
                💳 Pagamento
              </button>

              <button
                onClick={() =>
                  respostaRapida('promoção')
                }
              >
                🎁 Promoções
              </button>

              <button
                onClick={() =>
                  respostaRapida('telefone')
                }
              >
                📞 Contato
              </button>

            </div>

            <div ref={chatEndRef}></div>

          </div>

          <div className="chat-footer">

            <input
              type="text"
              value={input}
              placeholder="Digite sua dúvida..."
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                enviarMensagem()
              }
            />

            <button onClick={enviarMensagem}>
              Enviar
            </button>

          </div>

        </div>
      )}

      <button
        className="chat-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✖' : '🤖'}
      </button>

    </div>
  );
}