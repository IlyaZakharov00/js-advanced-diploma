import Swordsman from "../characters/Swordsman.js";

test("should create Swordsman", () => {
  const result = new Swordsman(1);
  expect(result).toEqual({
    health: 100,
    level: 1,
    attack: 40,
    defence: 10,
    type: "swordsman",
  });
});
