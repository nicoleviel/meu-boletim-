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
// Configuração fixa do estudante (Turma 9B, Chamada nº 28)
const CONFIG_ALUNO = {
  turma: "9B",
  numeroChamada: 28,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Guarda o PIN em memória apenas durante a sessão
let pinSessao = "";

// Dados fictícios locais padronizados do 9º Ano
const dadosDisciplinasLocais = [
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

// Estado atual das disciplinas exibidas
let disciplinasAtuais = [];

// Função para normalizar notas antigas (ex: 82 -> 8.2, "8,5" -> 8.5)
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }
  let numero = Number(valor);
  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

// Validação de notas digitadas na edição (apenas 0 a 10 ou vazio)
function validarNotaEditada(valorTexto) {
  if (valorTexto === null || valorTexto === undefined || valorTexto.trim() === "") {
    return { valido: true, valor: null };
  }
  let texto = valorTexto.toString().trim().replace(",", ".");
  let num = Number(texto);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

// Validação de faltas digitadas na edição (inteiro >= 0)
function validarFaltaEditada(valorTexto) {
  if (valorTexto === null || valorTexto === undefined || valorTexto.toString().trim() === "") {
    return { valido: false, valor: null };
  }
  let texto = valorTexto.toString().trim();
  if (!/^\d+$/.test(texto)) {
    return { valido: false, valor: null };
  }
  let num = Number(texto);
  if (num < 0) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

// Renderiza a tabela e os cards de resumo no HTML
function renderizarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let quantMediasGerais = 0;
  let totalFaltasGeral = 0;
  let contadorBomDesempenho = 0;
  let contadorAtencao = 0;

  disciplinasAtuais.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    let faltasArray = [0, 0, 0];
    if (Array.isArray(item.faltas)) {
      faltasArray = item.faltas;
    }

    const totalFaltasDisc = faltasArray.reduce((acc, f) => acc + (Number(f) || 0), 0);
    totalFaltasGeral += totalFaltasDisc;

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

    const formatarExibicao = (n) => n !== null ? n.toFixed(1).replace(".", ",") : "—";

    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    const strongNome = document.createElement("strong");
    strongNome.textContent = item.disciplina || "Sem nome";
    tdNome.appendChild(strongNome);

    const td1 = document.createElement("td");
    td1.textContent = formatarExibicao(n1);

    const td2 = document.createElement("td");
    td2.textContent = formatarExibicao(n2);

    const td3 = document.createElement("td");
    td3.textContent = formatarExibicao(n3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = textoMedia;
    tdMedia.appendChild(strongMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasDisc;

    const tdSit = document.createElement("td");
    tdSit.className = classeSituacao;
    tdSit.textContent = situacao;

    tr.appendChild(tdNome);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(tdMedia);
    tr.appendChild(tdFaltas);
    tr.appendChild(tdSit);

    tabelaCorpo.appendChild(tr);
  });

  if (quantMediasGerais > 0) {
    const mediaGeral = (somaMediasGerais / quantMediasGerais).toFixed(1).replace(".", ",");
    document.getElementById("card-media").textContent = mediaGeral;
  } else {
    document.getElementById("card-media").textContent = "—";
  }

  document.getElementById("card-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = contadorBomDesempenho;
  document.getElementById("card-atencao").textContent = contadorAtencao;

  /*
    NOTA DE FREQUÊNCIA:
    O valor de 92% exibido no card de frequência é APENAS DEMONSTRATIVO/FICTÍCIO nesta etapa.
    Ele não é calculado com base nas faltas e será tratado de outra forma em versões futuras.
  */
}

// Abertura do boletim via API
async function fazerLogin() {
  const inputPin = document.getElementById("input-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Por favor, digite o seu PIN.";
    return;
  }

  msgLogin.className = "mensagem-status info";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();

    // Salva o PIN em memória e limpa o input
    pinSessao = pinDigitado;
    inputPin.value = "";

    // Aplica regra de prioridade de dados
    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      disciplinasAtuais = resultado.dados.disciplinas;
    } else {
      disciplinasAtuais = JSON.parse(JSON.stringify(dadosDisciplinasLocais));
    }

    // Exibe boletim e esconde área de login
    document.getElementById("area-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";

    renderizarBoletim();
  } catch (erro) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// Monta os campos do formulário de edição
function abrirEdicao() {
  const container = document.getElementById("container-edicao-disciplinas");
  container.innerHTML = "";
  document.getElementById("msg-salvar").textContent = "";

  disciplinasAtuais.forEach((item, index) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    let f1 = 0, f2 = 0, f3 = 0;
    if (Array.isArray(item.faltas)) {
      f1 = item.faltas[0] !== undefined ? item.faltas[0] : 0;
      f2 = item.faltas[1] !== undefined ? item.faltas[1] : 0;
      f3 = item.faltas[2] !== undefined ? item.faltas[2] : 0;
    }

    const formatarInputNota = (n) => n !== null ? n.toString().replace(".", ",") : "";

    const divLinha = document.createElement("div");
    divLinha.className = "linha-edicao";

    const spanNome = document.createElement("span");
    spanNome.textContent = item.disciplina || "Sem nome";
    divLinha.appendChild(spanNome);

    divLinha.innerHTML += `
      <input type="text" id="n1_${index}" placeholder="N1" value="${formatarInputNota(n1)}">
      <input type="text" id="n2_${index}" placeholder="N2" value="${formatarInputNota(n2)}">
      <input type="text" id="n3_${index}" placeholder="N3" value="${formatarInputNota(n3)}">
      <input type="text" id="f1_${index}" placeholder="F1" value="${f1}">
      <input type="text" id="f2_${index}" placeholder="F2" value="${f2}">
      <input type="text" id="f3_${index}" placeholder="F3" value="${f3}">
    `;

    container.appendChild(divLinha);
  });

  document.getElementById("area-edicao").style.display = "block";
}

// Salva alterações na API
async function salvarAlteracoes() {
  const msgSalvar = document.getElementById("msg-salvar");
  msgSalvar.textContent = "";

  let temErro = false;
  const novasDisciplinas = [];

  disciplinasAtuais.forEach((item, index) => {
    const inputN1 = document.getElementById(`n1_${index}`);
    const inputN2 = document.getElementById(`n2_${index}`);
    const inputN3 = document.getElementById(`n3_${index}`);
    const inputF1 = document.getElementById(`f1_${index}`);
    const inputF2 = document.getElementById(`f2_${index}`);
    const inputF3 = document.getElementById(`f3_${index}`);

    [inputN1, inputN2, inputN3, inputF1, inputF2, inputF3].forEach(el => el.classList.remove("campo-invalido"));

    const valN1 = validarNotaEditada(inputN1.value);
    const valN2 = validarNotaEditada(inputN2.value);
    const valN3 = validarNotaEditada(inputN3.value);

    const valF1 = validarFaltaEditada(inputF1.value);
    const valF2 = validarFaltaEditada(inputF2.value);
    const valF3 = validarFaltaEditada(inputF3.value);

    if (!valN1.valido) { inputN1.classList.add("campo-invalido"); temErro = true; }
    if (!valN2.valido) { inputN2.classList.add("campo-invalido"); temErro = true; }
    if (!valN3.valido) { inputN3.classList.add("campo-invalido"); temErro = true; }

    if (!valF1.valido) { inputF1.classList.add("campo-invalido"); temErro = true; }
    if (!valF2.valido) { inputF2.classList.add("campo-invalido"); temErro = true; }
    if (!valF3.valido) { inputF3.classList.add("campo-invalido"); temErro = true; }

    if (!temErro) {
      novasDisciplinas.push({
        disciplina: item.disciplina,
        tri1: valN1.valor,
        tri2: valN2.valor,
        tri3: valN3.valor,
        faltas: [valF1.valor, valF2.valor, valF3.valor]
      });
    }
  });

  if (temErro) {
    msgSalvar.className = "mensagem-status erro";
    msgSalvar.textContent = "Verifique os campos destacados em vermelho. Digite notas de 0 a 10 e faltas inteiras.";
    return;
  }

  msgSalvar.className = "mensagem-status info";
  msgSalvar.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgSalvar.className = "mensagem-status erro";
      msgSalvar.textContent = "Não foi possível salvar as alterações. Tente novamente.";
      return;
    }

    disciplinasAtuais = novasDisciplinas;
    renderizarBoletim();

    msgSalvar.className = "mensagem-status sucesso";
    msgSalvar.textContent = "Dados salvos com sucesso!";

    setTimeout(() => {
      document.getElementById("area-edicao").style.display = "none";
    }, 1500);

  } catch (erro) {
    msgSalvar.className = "mensagem-status erro";
    msgSalvar.textContent = "Erro de conexão ao salvar. Tente novamente.";
  }
}

// Configuração dos eventos
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", fazerLogin);

  document.getElementById("input-pin").addEventListener("keypress", (e) => {
    if (e.key === "Enter") fazerLogin();
  });

  document.getElementById("btn-alterar-dados").addEventListener("click", abrirEdicao);
  document.getElementById("btn-salvar-dados").addEventListener("click", salvarAlteracoes);

  document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
    document.getElementById("area-edicao").style.display = "none";
  });
});