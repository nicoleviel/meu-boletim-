// Dados fictícios padronizados das disciplinas do 9º Ano
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Função para normalizar qualquer formato de nota para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se a nota vier como texto com vírgula (ex: "8,5"), troca por ponto
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  // Se não for um número válido, descarta
  if (isNaN(numero)) {
    return null;
  }

  // Se estiver entre 0 e 10, já está correto
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Se for maior que 10 e até 100, divide por 10 (ex: 82 vira 8.2, 100 vira 10.0)
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Valores fora das regras são inválidos
  return null;
}

// Função principal para carregar o boletim no HTML
function carregarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let quantMediasGerais = 0;
  let totalFaltasGeral = 0;
  let contadorBomDesempenho = 0;
  let contadorAtencao = 0;

  // Percorre cada uma das 15 disciplinas
  dadosDisciplinas.forEach(item => {
    // Normaliza as notas dos 3 trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Soma o total de faltas da disciplina
    const totalFaltasDisc = item.faltas.reduce((acc, f) => acc + f, 0);
    totalFaltasGeral += totalFaltasDisc;

    // Calcula a média considerando apenas notas disponíveis (não transforma ausente em zero)
    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let mediaDisc = null;
    let textoMedia = "—";
    let situacao = "Nota ainda não disponível";
    let classeSituacao = "situacao-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, val) => acc + val, 0);
      mediaDisc = soma / notasValidas.length;
      textoMedia = mediaDisc.toFixed(1).replace(".", ",");

      somaMediasGerais += mediaDisc;
      quantMediasGerais++;

      if (mediaDisc >= 6.0) {
        situacao = "Bom desempenho";
        classeSituacao = "situacao-bom";
        contadorBomDesempenho++;
      } else {
        situacao = "Atenção";
        classeSituacao = "situacao-atencao";
        contadorAtencao++;
      }
    }

    // Função auxiliar para formatar a nota da tabela
    const formatarExibicao = (n) => n !== null ? n.toFixed(1).replace(".", ",") : "—";

    // Cria a linha da tabela no HTML
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarExibicao(n1)}</td>
      <td>${formatarExibicao(n2)}</td>
      <td>${formatarExibicao(n3)}</td>
      <td><strong>${textoMedia}</strong></td>
      <td>${totalFaltasDisc}</td>
      <td class="${classeSituacao}">${situacao}</td>
    `;
    tabelaCorpo.appendChild(tr);
  });

  // Atualiza os Cards de Resumo no topo
  if (quantMediasGerais > 0) {
    const mediaGeral = (somaMediasGerais / quantMediasGerais).toFixed(1).replace(".", ",");
    document.getElementById("card-media").innerText = mediaGeral;
  } else {
    document.getElementById("card-media").innerText = "—";
  }

  document.getElementById("card-faltas").innerText = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").innerText = contadorBomDesempenho;
  document.getElementById("card-atencao").innerText = contadorAtencao;

  /*
    NOTA DE FREQUÊNCIA:
    O valor de 92% exibido no card de frequência é APENAS DEMONSTRATIVO/FICTÍCIO nesta etapa.
    Ele não é calculado com base nas faltas e será tratado de outra forma em versões futuras.
  */
}

// Executa a função assim que a página carregar
document.addEventListener("DOMContentLoaded", carregarBoletim);