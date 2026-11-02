import { SearchXIcon } from './icons';

export default function EmptyState({ icon, title, text, children }) {
  return (
    <div className="jb-empty" role="status">
      <span className="jb-empty__icon">{icon || <SearchXIcon size={22} />}</span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children && <div className="jb-empty__actions">{children}</div>}
    </div>
  );
}
