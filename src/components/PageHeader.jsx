export default function PageHeader({ eyebrow, title, text }) {
  return (
    <header className="mb-8 max-w-2xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title mt-2">{title}</h1>
      {text ? <p className="prose-copy mt-3">{text}</p> : null}
    </header>
  )
}
