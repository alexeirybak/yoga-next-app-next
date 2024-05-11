import CardData from "../page";
type CardData = {
  id: number;
  image: string;
  name: string;
};

const cardsData: CardData[] = [
  {
    id: 1,
    image: "/yoga.jpg",
    name: "Йога",
  },
  {
    id: 2,
    image: "/stretching.jpg",
    name: "Стретчинг",
  },
  {
    id: 3,
    image: "/zumba.jpg",
    name: "Зумба",
  },
  {
    id: 4,
    image: "/step.jpg",
    name: "Степ-аэробика",
  },
  {
    id: 5,
    image: "/bodyflex.jpg",
    name: "Бодифлекс",
  },
];

export default cardsData;
