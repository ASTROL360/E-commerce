export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <dialog className="modal" open onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            No
          </button>
          <button className="danger-button" type="button" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </dialog>
    </div>
  );
}
