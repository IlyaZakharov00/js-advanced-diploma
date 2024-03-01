import Undead from "../characters/Undead.js";

test("should create Undead", () => {
  const result = new Undead(1);
  expect(result).toEqual({
    health: 100,
    level: 1,
    attack: 40,
    defence: 10,
    type: "undead",
  });
});
