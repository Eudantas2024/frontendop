import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PainelAdmin.css";

// Função auxiliar para ler mensagem de erro da resposta HTTP
const lerMensagemErro = async (res) => {
  try {
    const texto = await res.text();
    try {
      const json = JSON.parse(texto);
      return json.error || texto;
    } catch {
      return texto || "Resposta inválida.";
    }
  } catch {
    return "Resposta inválida.";
  }
};

const PainelAdmin = () => {
  const [reclamacoes, setReclamacoes] = useState([]);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarReclamacoesPendentes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reclamacoes/pendentes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const dados = await res.json();
        setReclamacoes(dados);
        setMensagem("");
      } else {
        setMensagem("Acesso não autorizado.");
        localStorage.removeItem("adminToken");
        setTimeout(() => navigate("/admin"), 1500);
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  const aprovarReclamacao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reclamacoes/aprovar/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setMensagemCor("green");
        setMensagem("Reclamação aprovada com sucesso.");
        carregarReclamacoesPendentes();
      } else {
        const erroMsg = await lerMensagemErro(res);
        setMensagemCor("red");
        setMensagem(`Erro ao aprovar reclamação: ${erroMsg}`);
      }
    } catch {
      setMensagemCor("red");
      setMensagem("Erro na conexão com o servidor.");
    }
  };

  const excluirReclamacao = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reclamacoes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMensagemCor("green");
        setMensagem("Reclamação excluída com sucesso.");
        carregarReclamacoesPendentes();
      } else {
        const erroMsg = await lerMensagemErro(res);
        setMensagemCor("red");
        setMensagem(`Erro ao excluir reclamação: ${erroMsg}`);
      }
    } catch {
      setMensagemCor("red");
      setMensagem("Erro na conexão com o servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="container">
      <h2>Área Administrativa</h2>
      {mensagem && <p style={{ color: mensagemCor }}>{mensagem}</p>}
      <main>
        {reclamacoes.length === 0 ? (
          <p>Nenhuma reclamação pendente.</p>
        ) : (
          <>
            <h3>Reclamações Pendentes:</h3>
            {reclamacoes.map((r) => {
              const dataFormatada = new Date(r.dataEnvio).toLocaleString("pt-BR");
              return (
                <section
                  key={r._id}
                  style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
                >
                  <p>
                    <strong>Consumidor:</strong> {r.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {r.email}
                  </p>
                  <p>
                    <strong>Título:</strong> {r.titulo || "(sem título)"}
                  </p>
                  <p>
                    <strong>Descrição:</strong> {r.mensagem}
                  </p>
                  <p>
                    <small>Enviado em: {dataFormatada}</small>
                  </p>
                  <button onClick={() => aprovarReclamacao(r._id)}>Aprovar</button>{" "}
                  <button onClick={() => excluirReclamacao(r._id)}>Excluir</button>
                </section>
              );
            })}
          </>
        )}
      </main>
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Sair
      </button>
    </div>
  );
};

export default PainelAdmin;
