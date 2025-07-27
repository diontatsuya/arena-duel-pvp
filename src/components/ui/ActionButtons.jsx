// src/components/ui/ActionButtons.jsx
const ActionButtons = ({ onAction }) => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={() => onAction(1)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
      >
        Serang
      </button>
      <button
        onClick={() => onAction(2)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        Bertahan
      </button>
      <button
        onClick={() => onAction(3)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
      >
        Pulihkan
      </button>
    </div>
  );
};

export default ActionButtons;
