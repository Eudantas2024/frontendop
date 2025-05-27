import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaCommentDots, FaSearch, FaBullhorn } from 'react-icons/fa';
import './UltimasReclamacoes.css';

function UltimasReclamacoes() {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');

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
                        reclamacoesFiltradas.map((rec) => (
                            <div key={rec._id} className="card-reclamacao">

                                <p className='cliente'>
                                    <FaUser className="icone-user" /> <strong>Cliente:</strong> {rec.username}
                                </p>
                                <p className='feedback'>
                                    <FaBullhorn className="icone-megafone" /> <strong>Tipo de Feedback:</strong> {rec.tipoFeedback}
                                </p>
                                <p>
                                    <FaEnvelope className="icone-envelope" /> <strong>Assunto:</strong> {rec.titulo}
                                </p>
                                <p>
                                    <FaCommentDots className="icone-msg" /> <strong>Mensagem:</strong> <br /><br /> {rec.mensagem}
                                </p>


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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UltimasReclamacoes;
