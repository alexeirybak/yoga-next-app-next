interface Exercise {
  name: string;
  made: number;
  quantity: number;
}

interface ProgressModalProps {
  exercises: Exercise[];
  exerciseQuantities: { [key: string]: number };
  onClose: () => void;
  onSaveProgress: () => void;
  onUpdateExerciseQuantity: (exerciseName: string, quantity: number) => void;
}

export const ProgressSave: React.FC<ProgressModalProps> = ({
  exercises,
  exerciseQuantities,
  onClose,
  onSaveProgress,
  onUpdateExerciseQuantity,
}) => {
  return (
    <div className="modalOverlay">
      <div className="modalContentProgress w-[426px] h-[596px]">
        <div className="relative">
          <button className="text-2xl w-5 absolute right-0" onClick={onClose}>
            &#10060;
          </button>
          <h2 className="text-[32px] mb-12">Мой прогресс</h2>
          <ul className="max-h-[347px] overflow-y-auto listMenuScroll pr-5">
            {exercises.map((exercise: Exercise) => (
              <li key={exercise.name}>
                <div className="text-lg leading-110 mb-2.5">
                  Сколько раз вы сделали “{exercise.name}”?
                </div>
                <label htmlFor={exercise.name} />
                <input
                  id={exercise.name}
                  type="text"
                  value={exerciseQuantities[exercise.name] || ""}
                  onChange={(e) =>
                    onUpdateExerciseQuantity(
                      exercise.name,
                      parseInt(e.target.value, 10)
                    )
                  }
                  placeholder={(exerciseQuantities[exercise.name] || 0).toString()}
                  className="border-[1px] border-[#d0cece] rounded-lg px-4 py-[18px] w-full h-[52px] mb-5"
                />
              </li>
            ))}
          </ul>

          <button
            onClick={onSaveProgress}
            className="btnGreen mt-[14px] w-full rounded-[46px] px-[26px] py-4"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
