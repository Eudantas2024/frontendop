import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PainelAdmin.css";

const PainelAdmin = () => {
  const [reclamacoesPendentes, setReclamacoesPendentes] = useState([]);
  const [reclamacoesAprovadas, setReclamacoesAprovadas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [mensagemCor, setMensagemCor] = useState("red");
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      setMensagem("Acesso negado. Faça login como administrador.");
      setTimeout(() => navigate("/admin"), 1500);
    } else {
      carregarReclamacoesPendentes();
      carregarReclamacoesAprovadas();
    }
  }, []);

  const carregarReclamacoesPendentes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reclamacoes/pendentes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setReclamacoesPendentes(await res.json());
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  const carregarReclamacoesAprovadas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reclamacoes/aprovadas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setReclamacoesAprovadas(await res.json());
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  const aprovarReclamacao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reclamacoes/aprovar/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensagemCor("green");
        setMensagem("✅ Feedback Aprovado!");
        carregarReclamacoesPendentes();
        carregarReclamacoesAprovadas();
      }
    } catch {
      setMensagemCor("red");
      setMensagem("Erro ao aprovar feedback.");
    }
  };

  const excluirReclamacao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reclamacoes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensagemCor("green");
        setMensagem("🗑️ Feedback excluído com sucesso!");
        carregarReclamacoesPendentes();
        carregarReclamacoesAprovadas();
      }
    } catch {
      setMensagemCor("red");
      setMensagem("Erro ao excluir feedback.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="container">
      {/* Botão de Logout no canto superior direito */}

      <button onClick={handleLogout} className="botao-logout">Clique aqui para Fazer Logout</button>

      <h2>Área Administrativa</h2>
      {mensagem && <p style={{ color: mensagemCor }}>{mensagem}</p>}

      <main>
        <h3>Reclamações Pendentes:</h3>
        {reclamacoesPendentes.map((r) => (
          <section key={r._id} className="card-reclamacao">
            <p><strong>Consumidor:</strong> {r.username}</p>
            <p><strong>Assunto:</strong> {r.titulo}</p>
            <p><strong>Descrição:</strong> {r.mensagem}</p>
            <button className="aprovar" onClick={() => aprovarReclamacao(r._id)}>Aprovar</button>
            <button className="excluir" onClick={() => excluirReclamacao(r._id)}>Excluir</button>
          </section>
        ))}

        <h3>Reclamações Aprovadas:</h3>
        {reclamacoesAprovadas.map((r) => (
          <section key={r._id} className="card-reclamacao">
            <p><strong>Consumidor:</strong> {r.username}</p>
            <p><strong>Assunto:</strong> {r.titulo}</p>
            <p><strong>Descrição:</strong> {r.mensagem}</p>
            <button className="excluir" onClick={() => excluirReclamacao(r._id)}>Excluir</button>
          </section>
        ))}
      </main>
    </div>
  );
};

export default PainelAdmin;
