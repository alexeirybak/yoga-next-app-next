import "../../globals.css";

interface ModalConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <p className="mb-5">Вы уверены, что хотите отписаться от курса? Все, что связано с Вашим прогрессом, будет навсегда удалено.</p>
        <div className="flex flex-row justify-center gap-x-[30px]">
          <button
            className="bg-[#eee] hover:bg-[#c6ff00] active:bg-black text-black active:text-white p-2 rounded-[12px] w-[100px]"
            onClick={onConfirm}
          >
            Да
          </button>
          <button
            className="bg-custom-lime hover:bg-[#c6ff00] active:bg-black text-black active:text-white p-2 rounded-[12px] w-[100px]"
            onClick={onCancel}
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};
