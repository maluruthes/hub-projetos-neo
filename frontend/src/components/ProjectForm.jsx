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
      <div className="project-form-header">
        <h2>{projetoEditando ? "Editar projeto" : "Novo projeto"}</h2>
        <p>
          Preencha as informações para cadastrar um projeto no Hub NEO.
        </p>
      </div>

      <div className="project-form-grid">
        <div className="form-field">
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
        </div>

        <div className="form-field">
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
        </div>
      </div>

      <div className="form-field description-field">
        <label>Descrição</label>
        <textarea
          placeholder="Descreva os objetivos e detalhes do projeto"
          value={novoProjeto.descricao}
          onChange={(e) =>
            setNovoProjeto({ ...novoProjeto, descricao: e.target.value })
          }
          required
        />
      </div>

      <div className="members-field">
        <div className="members-field-header">
          <div>
            <label>Membros participantes</label>
            <p>Selecione os integrantes envolvidos no projeto.</p>
          </div>
          <span className="members-count">
            {novoProjeto.membros
              .split(',')
              .filter(nome => nome.trim() !== '').length} selecionados
          </span>
        </div>

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
                    .map(nome => nome.trim())
                    .includes(membro.name)}
                  onChange={(e) => {
                    const selecionados = novoProjeto.membros
                      .split(',')
                      .map(nome => nome.trim())
                      .filter(nome => nome !== '')

                    const atualizados = e.target.checked
                      ? [...selecionados, membro.name]
                      : selecionados.filter(
                          nome => nome !== membro.name
                        )

                    setNovoProjeto({
                      ...novoProjeto,
                      membros: atualizados.join(', ')
                    })
                  }}
                />

                <span className="member-avatar">
                  {membro.name.charAt(0).toUpperCase()}
                </span>

                <span className="member-name">{membro.name}</span>
              </label>
            ))
          )}
        </div>
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
