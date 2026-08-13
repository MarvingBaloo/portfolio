export default function Fenetre({ titre, children, className = "" }) {
  return (
    <div className={`fenetre ${className}`}>
      <div className="fenetre-barre">
        <span aria-hidden="true" className="fenetre-point" />
        <span aria-hidden="true" className="fenetre-point" />
        <span aria-hidden="true" className="fenetre-point" />
        {titre ? <span className="fenetre-titre">{titre}</span> : null}
      </div>
      {children}
    </div>
  );
}
