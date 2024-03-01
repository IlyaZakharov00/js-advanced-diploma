import Vampire from "../characters/Vampire.js";

test("should create Vampire", () => {
  const result = new Vampire(1);
  expect(result).toEqual({
    health: 100,
    level: 1,
    attack: 25,
    defence: 25,
    type: "vampire",
  });
});
