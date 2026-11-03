import { SERVICES } from '../content/services'

export default function NotFoundPage() {
  return (
    <main id="conteudo" className="section-v16 legal-page">
      <div className="container legal-container" style={{ textAlign: 'center' }}>
        <h1 className="title-lg">Página não encontrada</h1>
        <p className="subtitle-main">O endereço que você acessou não existe ou foi movido.</p>
        <div className="cta-group" style={{ justifyContent: 'center', margin: '2rem 0' }}>
          <a href="/" className="btn-v16 btn-v16-primary">Voltar para o início</a>
        </div>
        <div className="related-links" style={{ justifyContent: 'center' }}>
          {SERVICES.map((s) => (
            <a key={s.slug} href={`/${s.slug}`} className="related-link">{s.serviceType}</a>
          ))}
        </div>
      </div>
    </main>
  )
}
