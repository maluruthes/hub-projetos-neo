function ProjectForm({
  novoProjeto,
  setNovoProjeto,
  listaMembros,
  projetoEditando,
  cadastrarProjeto,
  setMostrarFormulario
}) {
  return (
    <form className="project-form" onSubmit={cadastrarProjeto}>
      <h2>{projetoEditando ? "Editar projeto" : "Novo projeto"}</h2>

      <label>Nome do projeto</label>
      <input
        type="text"
        placeholder="Digite o nome do projeto"
        value={novoProjeto.nome}
        onChange={(e) =>
          setNovoProjeto({ ...novoProjeto, nome: e.target.value })
        }
        required
      />

      <label>Empresa parceira</label>
      <select
        value={novoProjeto.empresa}
        onChange={(e) =>
          setNovoProjeto({ ...novoProjeto, empresa: e.target.value })
        }
        required
      >
        <option value="">Selecione uma empresa</option>
        <option value="WEG">WEG</option>
        <option value="CERTI">CERTI</option>
        <option value="Embraco">Embraco</option>
        <option value="Landis+Gyr">Landis+Gyr</option>
      </select>

      <label>Descrição</label>
      <textarea
        placeholder="Descreva o projeto"
        value={novoProjeto.descricao}
        onChange={(e) =>
          setNovoProjeto({ ...novoProjeto, descricao: e.target.value })
        }
        required
      />

      <label>Membros participantes</label>

      <div className="members-selection">
        {listaMembros.length === 0 ? (
          <p>Nenhum membro cadastrado.</p>
        ) : (
          listaMembros.map((membro) => (
            <label key={membro.id} className="member-option">
              <input
                type="checkbox"
                checked={novoProjeto.membros
                  .split(',')
                  .map((nome) => nome.trim())
                  .includes(membro.name)}
                onChange={(e) => {
                  const selecionados = novoProjeto.membros
                    .split(',')
                    .map((nome) => nome.trim())
                    .filter((nome) => nome !== '')

                  const atualizados = e.target.checked
                    ? [...selecionados, membro.name]
                    : selecionados.filter(
                        (nome) => nome !== membro.name
                      )

                  setNovoProjeto({
                    ...novoProjeto,
                    membros: atualizados.join(', ')
                  })
                }}
              />

              <span>{membro.name}</span>
            </label>
          ))
        )}
      </div>

      <div className="form-buttons">
        <button
          type="button"
          className="cancel-button"
          onClick={() => setMostrarFormulario(false)}
        >
          Cancelar
        </button>

        <button type="submit" className="save-button">
          Salvar projeto
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
