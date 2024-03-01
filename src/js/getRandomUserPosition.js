export default function getRandomUserncePosition() {
  const arrNumberPosition = [
    0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
  ];
  const uniquePos = [];

  do {
    const randomIndex = Math.trunc(Math.random() * arrNumberPosition.length);
    uniquePos.push(arrNumberPosition[randomIndex]);
    arrNumberPosition.splice(randomIndex, 1);
  } while (arrNumberPosition.length !== 1);
  return uniquePos;
}
