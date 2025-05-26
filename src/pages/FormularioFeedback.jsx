import React, { useState } from "react";
import "./FormularioFeedback.css";

export default function FormReclamacao() {
  const [mensagem, setMensagem] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tipoFeedback, setTipoFeedback] = useState("problema");
  const [anexos, setAnexos] = useState([]);
  const [status, setStatus] = useState({ texto: "", tipo: "" }); // para usar classes sucesso/erro

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mensagem.trim().length < 10) {
      setStatus({ texto: "Mensagem muito curta.", tipo: "erro" });
      return;
    }

    const formData = new FormData();
    formData.append("mensagem", mensagem);
    formData.append("titulo", titulo);
    formData.append("tipoFeedback", tipoFeedback);

    anexos.forEach((file) => {
      formData.append("anexos", file);
    });

    try {
      const token = localStorage.getItem("token"); // JWT armazenado
      const response = await fetch("http://localhost:3000/api/reclamacoes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ texto: "Reclamação enviada com sucesso!", tipo: "sucesso" });
        setMensagem("");
        setTitulo("");
        setAnexos([]);
      } else {
        setStatus({ texto: data.error || "Erro ao enviar reclamação", tipo: "erro" });
      }
    } catch (error) {
      setStatus({ texto: "Erro de rede", tipo: "erro" });
    }
  };

  const handleFileChange = (e) => {
    setAnexos(Array.from(e.target.files));
  };

  return (
    <div className="formulario-feedback-container">
      <h2>Deixe seu Feedback</h2>
      {status.texto && (
        <div className={`mensagem ${status.tipo}`}>
          {status.texto}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="titulo">Título (opcional)</label>
          <input
            id="titulo"
            type="text"
            placeholder="Título (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoFeedback">Tipo de Feedback</label>
          <select
            id="tipoFeedback"
            value={tipoFeedback}
            onChange={(e) => setTipoFeedback(e.target.value)}
          >
            <option value="sugestao">Sugestão</option>
            <option value="problema">Problema</option>
            <option value="elogio">Elogio</option>
            <option value="duvida">Dúvida</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            placeholder="Escreva sua mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="anexos">Anexar arquivos</label>
          <input
            id="anexos"
            className="input-file"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {anexos.length > 0 && (
            <div className="lista-anexos">
              <h4>Anexos selecionados:</h4>
              {anexos.map((file, idx) => (
                <div key={idx} className="anexo-item">
                  <span className="file-icon">📎</span>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn-enviar">
          Enviar Reclamação
        </button>
      </form>
    </div>
  );
}
