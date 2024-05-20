import React from 'react';

interface Exercise {
    name: string;
    quantity: number;
    made: number;
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
          <button
            className="text-2xl w-5 absolute right-0"
            onClick={onClose}
          >
            &#10060;
          </button>
          <h2 className="text-[32px] mb-12">Мой прогресс</h2>
          <div className="max-h-[347px] overflow-y-auto">
            {exercises.map((exercise: Exercise) => (
              <>
                <div
                  key={exercise.name}
                  className="text-lg leading-110 mb-2.5"
                >
                  Сколько раз вы сделали “{exercise.name}”
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
                  placeholder="0"
                  className="border-[1px] border-[#d0cece] rounded-lg px-4 py-[18px] w-full h-[52px] mb-5"
                />
              </>
            ))}
          </div>

          <button
            onClick={onSaveProgress}
            className="mt-[14px] w-full text-lg leading-110 rounded-[46px] px-[26px] py-4 bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white transition-colors duration-300 ease-in-out"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};