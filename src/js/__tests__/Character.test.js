import Character from "../Character";

test("should return error", () => {
  const result = () => {
    new Character(1);
  };
  expect(result).toThrow("Нельзя создавать объекты класса Character");
});
