// eslint-disable-next-line react/prop-types
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog">
      <div className="confirmation-content">
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;