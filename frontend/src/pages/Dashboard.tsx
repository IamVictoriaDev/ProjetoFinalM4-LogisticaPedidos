export default function Dashboard() {
  return <h1>Dashboard</h1>
import { useEffect, useRef } from "react";
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = 220;

    const dados = [6, 10, 8, 14, 9, 13, 7];

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#6a5cff";

    dados.forEach((valor, i) => {
      let x = (canvas.width / (dados.length - 1)) * i;
      let y = canvas.height - valor * 10;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }, []);

  const atividade = [
    { txt: "PED-005 movido para Em Transporte", cor: "blue" },
    { txt: "PED-008 entregue com sucesso", cor: "green" },
    { txt: "PED-009 criado por Atacado Recife", cor: "blue" },
    { txt: "PED-003 movido para Em Separação", cor: "orange" },
    { txt: "PED-001 status atualizado", cor: "red" }
  ];

  const acoes = [
    { txt: "Confirmar entrega - Atacado SP", cor: "blue" },
    { txt: "Liberar PED-005 para transporte", cor: "red" },
    { txt: "Revisar estoque Arroz 5kg", cor: "orange" }
  ];

  return (
    <div style={{ display: "flex", background: "#f6f7fb" }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: "250px",
        height: "100vh",
        background: "linear-gradient(180deg, #5f2cff, #b026ff)",
        color: "white",
        padding: "25px"
      }}>
        <h1>LOGIX</h1>

        <button style={btn}>Dashboard</button>
        <button style={btn}>Pedidos</button>
        <button style={btn}>Kanban</button>
        <button style={btn}>Relatórios</button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "25px" }}>
        <h2>Dashboard</h2>
        <p style={{ color: "#777", marginBottom: "20px" }}>
          Visão operacional de hoje
        </p>

        {/* GRID */}
        <div style={{ display: "flex", gap: "20px" }}>
          
          <div style={box}>
            <h3>Pedidos — últimos 7 dias</h3>
            <canvas ref={canvasRef} style={{ width: "100%" }} />
          </div>

          <div style={box}>
            <h3>Atividade Recente</h3>
            {atividade.map((item, i) => (
              <div key={i} style={{ ...itemStyle, ...colors[item.cor] }}>
                {item.txt}
              </div>
            ))}
          </div>

        </div>

        <div style={{ ...box, marginTop: "20px" }}>
          <h3>Ações Pendentes</h3>
          {acoes.map((item, i) => (
            <div key={i} style={{ ...itemStyle, ...colors[item.cor] }}>
              {item.txt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// estilos
const btn = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  cursor: "pointer"
};

const box = {
  flex: 1,
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
};

const itemStyle = {
  padding: "10px",
  borderRadius: "8px",
  marginTop: "8px",
  fontSize: "14px"
};

const colors = {
  green: { background: "#e6f7ee" },
  blue: { background: "#eaf0ff" },
  orange: { background: "#fff3e6" },
  red: { background: "#ffeaea" }
};
