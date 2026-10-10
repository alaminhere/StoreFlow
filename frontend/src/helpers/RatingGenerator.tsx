import { Star } from '@/helpers/icon/icon';
 
const RatingGenerator = (value: number) => {
  const initialStar = 5;
  const star = Array.from({ length: initialStar }, (_, index) => {
    return index + 1;
  });

  return star.map((item, index) =>
    item <= value ? (
      <Star key={index} size={14} fill="#FFC633" strokeWidth={0} />
    ) : (
      <Star key={index} size={14} fill="#666666" strokeWidth={0} />
    ),
  );
};

export default RatingGenerator;
