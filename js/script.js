import axios from "axios";

const API_URL = "http://localhost:8080/tasks"; // Ajuste a URL conforme necessário

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botaoCriar").addEventListener("click", criarTarefa);
  carregarTarefas();
});

// Criar tarefa
function criarTarefa() {
  const nome = document.getElementById("nomeCriar").value;
  const descricao = document.getElementById("descricaoCriar").value;

  // Verifica se os campos estão preenchidos
  if (!nome || !descricao) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const novaTarefa = {
    title_task: nome, // API espera 'title_task'
    description_task: descricao // API espera 'description_task'
  };

  axios.post(API_URL, novaTarefa, {
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      console.log("Tarefa adicionada:", response.data);
      alert("Tarefa criada com sucesso!");
      carregarTarefas(); // Atualiza a tabela
    })
    .catch(error => {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Erro ao criar a tarefa!");
    });
}

// Carregar tarefas na tabela
function carregarTarefas() {
  axios.get(API_URL)
    .then(response => {
      const tarefas = response.data.content || response.data; // Ajuste conforme a estrutura da API
      const tabela = document.getElementById("tabelaTarefas");
      tabela.innerHTML = ""; // Limpa a tabela

      tarefas.forEach(task => {
        const novaLinha = tabela.insertRow();
        novaLinha.insertCell(0).textContent = task.id;
        novaLinha.insertCell(1).textContent = task.title_task; // Ajuste conforme API
        novaLinha.insertCell(2).textContent = task.status || "Pendente";

        // Criar botões de ação
        const celulaAcoes = novaLinha.insertCell(3);
        celulaAcoes.innerHTML = `
          <button class="btn btn-primary btn-sm me-2" onclick="editarTarefa(${task.id}, '${task.title_task}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirTarefa(${task.id})">Excluir</button>
        `;
      });
    })
    .catch(error => console.error("Erro ao carregar tarefas:", error));
}

// Editar tarefa
function editarTarefa(id, nomeAtual) {
  const novoNome = prompt("Editar nome da tarefa:", nomeAtual);
  if (!novoNome || novoNome.trim() === "") return;

  axios.put(`${API_URL}/update/${id}`, { title_task: novoNome })
    .then(() => {
      alert("Tarefa atualizada com sucesso!");
      carregarTarefas();
    })
    .catch(error => console.error("Erro ao atualizar tarefa:", error));
}

// Excluir tarefa
function excluirTarefa(id) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  axios.delete(`${API_URL}/delete/${id}`)
    .then(() => {
      alert("Tarefa excluída com sucesso!");
      carregarTarefas();
    })
    .catch(error => console.error("Erro ao excluir tarefa:", error));
}
