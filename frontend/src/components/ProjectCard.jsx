function ProjectCard({ projeto, editarProjeto, excluirProjeto }) {
  const iniciais = projeto.membros.slice(0, 4)

  return (
    <div className="project-card">
      <div className="project-card-top">
        <span className="company-tag">
          {projeto.empresa}
        </span>

        <div className="card-actions">
          <button
            onClick={() => editarProjeto(projeto)}
            title="Editar projeto"
          >
            ✎
          </button>

          <button
            onClick={() => excluirProjeto(projeto.id)}
            title="Excluir projeto"
          >
            ×
          </button>
        </div>
      </div>

      <div className="project-card-content">
        <h3>{projeto.nome}</h3>

        <p className="project-description">
          {projeto.descricao || 'Nenhuma descrição informada.'}
        </p>
      </div>

      <div className="project-card-footer">
        <div className="project-team">
          <div className="members">
            {iniciais.map((membro, index) => (
              <span
                className="member-avatar"
                key={`${membro}-${index}`}
                title={membro}
              >
                {membro.charAt(0).toUpperCase()}
              </span>
            ))}

            {projeto.membros.length > 4 && (
              <span className="member-avatar extra-members">
                +{projeto.membros.length - 4}
              </span>
            )}
          </div>

          <span className="member-count">
            {projeto.membros.length}{' '}
            {projeto.membros.length === 1 ? 'membro' : 'membros'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
