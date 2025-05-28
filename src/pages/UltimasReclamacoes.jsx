import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaCommentDots, FaSearch, FaBullhorn } from 'react-icons/fa';
import './UltimasReclamacoes.css';

function UltimasReclamacoes() {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [mensagemExpandida, setMensagemExpandida] = useState(null); // Estado para controlar qual mensagem está expandida

    useEffect(() => {
        fetch('http://localhost:3000/api/reclamacoes/aprovadas')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Erro ao buscar reclamações.');
                }
                return res.json();
            })
            .then((dados) => {
                setReclamacoes(dados);
            })
            .catch((err) => {
                setErro(err.message);
            });
    }, []);

    const reclamacoesFiltradas = reclamacoes.filter((rec) => {
        const buscaLower = busca.toLowerCase();
        return (
            rec.titulo.toLowerCase().includes(buscaLower) ||
            rec.mensagem.toLowerCase().includes(buscaLower)
        );
    });

    return (
        <div className="container">
            <div className="ultimas-reclamacoes">
                <h2>Últimos Feedbacks Publicados</h2>

                {/* Barra de busca com ícone */}
                <div className="barra-busca">
                    <input
                        type="text"
                        placeholder="Buscar por assunto ou mensagem..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="input-busca"
                    />
                    <FaSearch className="icone-busca" />
                </div>

                {erro && <p className="erro">{erro}</p>}

                <div className="lista-reclamacoes">
                    {reclamacoesFiltradas.length === 0 ? (
                        <p>Nenhuma reclamação encontrada para a busca realizada.</p>
                    ) : (
                        reclamacoesFiltradas.map((rec) => {
                            const mensagemFormatada = mensagemExpandida === rec._id ? rec.mensagem :
                                rec.mensagem.length > 500 ? rec.mensagem.slice(0, 500) + '...' : rec.mensagem;
                            const tiposFeedback = {
                                problema: "Crítica",
                                sugestao: "Sugestão",
                                elogio: "Elogio",
                                duvida: "Dúvida",
                                outros: "Outros"
                            };


                            return (
                                <div key={rec._id} className="card-reclamacao">
                                    <p className='feedback'>
                                        <FaBullhorn className="icone-megafone" /> <strong></strong> {tiposFeedback[rec.tipoFeedback] || rec.tipoFeedback}
                                    </p>
                                    <p className='cliente'>
                                        <FaUser className="icone-user" /> <strong>Cliente:</strong> {rec.username}
                                    </p>
                                    <p className='assunto'>
                                        <FaEnvelope className="icone-envelope" /> <strong>Assunto:</strong> {rec.titulo}
                                    </p>
                                    <p className="mensagem-texto">
                                        <FaCommentDots className="icone-msg" /> <strong>Mensagem:</strong> <br /><br />
                                        {mensagemFormatada}
                                    </p>
                                    {/* Só exibe o botão se a mensagem tiver mais de 500 caracteres */}
                                    {rec.mensagem.length > 500 && (
                                        <button onClick={() => setMensagemExpandida(mensagemExpandida === rec._id ? null : rec._id)} className="botao-ver-mais">
                                            {mensagemExpandida === rec._id ? 'Ver menos' : 'Ver mais'}
                                        </button>
                                    )}

                                    <div className="data-reclamacao">
                                        <strong>Registrado em:</strong>{' '}
                                        {rec.createdAt
                                            ? new Date(rec.createdAt).toLocaleString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })
                                            : 'Data não disponível'}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default UltimasReclamacoes;
