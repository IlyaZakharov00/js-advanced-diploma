export default function getRandomEnemyPosition() {
  const arrNumberPosition = [
    6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
  ];
  const uniquePos = [];

  do {
    const randomIndex = Math.trunc(Math.random() * arrNumberPosition.length);
    uniquePos.push(arrNumberPosition[randomIndex]);
    arrNumberPosition.splice(randomIndex, 1);
  } while (arrNumberPosition.length !== 1);
  return uniquePos;
}
