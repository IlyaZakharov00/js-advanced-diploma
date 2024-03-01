import Magician from "../characters/Magician.js";

test("should create Magician", () => {
  const result = new Magician(1);
  expect(result).toEqual({
    health: 100,
    level: 1,
    attack: 10,
    defence: 40,
    type: "magician",
  });
});
