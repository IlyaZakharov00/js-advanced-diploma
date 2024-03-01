import gamePlay from "./GamePlay";
import themes from "./themes";
import Team from "./Team.js";
import { generateTeam, characterGenerator } from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import GameState from "./GameState.js";
import getRandomUserncePosition from "./getRandomUserPosition.js";
import getRandomEnemyPosition from "./getRandomEnemyPosition.js";
import Bowerman from "./characters/Bowerman.js";
import Magician from "./characters/Magician.js";
import daemon from "./characters/Daemon.js";
import Swordsman from "./characters/Swordsman.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import Character from "./Character.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.gameState = new GameState();
    this.stateService = stateService;
    // this.allPersons = [];
    // this.countSquare;
    // this.allowIndexsMove;
    // this.countAttack;
    // this.allowIndexsAttack;
    this.userTeam = []; // команда user
    this.userPositions = []; // позиции команды user
    this.userTeamWithPosition = []; //объекты персонаж-позиция команды user
    this.enemyTeam = []; // команда enemy
    this.enemyPositions = []; // позиции команды enemy
    this.enemyTeamWithPosition = []; //объекты персонаж-позиция команды enemy
  }

  init() {
    // начало игры
    this.gamePlay.drawUi(themes[this.gameState.level]); //отрисовка оформления уровня

    this.userTeam = generateTeam([Magician, Bowerman, Swordsman], 1, 4); //создание команды user

    this.userPositions = getRandomUserncePosition(); //создание рандомных позиций

    for (let i = 0; i < this.userTeam.length; i++) {
      let fighterAndPosition = new PositionedCharacter(
        this.userTeam[i],
        this.userPositions[i]
      ); //создание объекта типа PositionedCharacter
      this.userTeamWithPosition.push(fighterAndPosition); //добавление в userTeamWithPosition
      this.gameState.heroesList.push(fighterAndPosition); //добавление в heroesList
    }

    this.enemyTeam = generateTeam([Undead, daemon, Vampire], 1, 4); //создание команды enemy

    this.enemyPositions = getRandomEnemyPosition(); //создание рандомных позиций

    for (let i = 0; i < this.enemyTeam.length; i++) {
      let fighterAndPosition = new PositionedCharacter(
        this.enemyTeam[i],
        this.enemyPositions[i]
      ); //создание объекта типа PositionedCharacter
      this.enemyTeamWithPosition.push(fighterAndPosition); //добавление в enemyTeamWithPosition и в heroesList
      this.gameState.heroesList.push(fighterAndPosition); //добавление в heroesList
    }

    this.gamePlay.redrawPositions([
      // отрисовка персонажей
      ...this.userTeamWithPosition,
      ...this.enemyTeamWithPosition,
    ]);

    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index); // отслеживание наведения курсора на ячейку
    });

    this.gamePlay.addCellClickListener((index) => {
      this.gamePlay.cells.forEach((elem) => elem.classList.remove("selected")); // удаление класса selected со всех персонажей
      this.onCellClick(index); // отслеживание клика по индексу
    });

    this.gamePlay.addCellLeaveListener((index) => {
      this.onCellLeave(index); //логика при покидании фокуса клетки
    });
  }

  onCellClick(index) {
    if (this.findPersonByIndex(index)) {
      //проверка. был ли клик совершен на персонаже
      const hero = this.findPersonByIndex(index).character;
      if (
        // проверка типа персонажа
        hero instanceof Swordsman ||
        hero instanceof Bowerman ||
        hero instanceof Magician
      ) {
        if (!this.gameState.characterSelected) {
          // провекра есть ли выбранный персонаж

          this.gamePlay.selectCell(index); // Подсвечивание игрока

          this.gameState.characterSelected = index; //запись, что игрок был выбран

          this.gameState.permissionMove = true; // ход разрешен

          this.countSquare = this.findCountSquare(index); // поиск количества квадратиков. максимальная величина шага
          this.allowIndexsMove = this.calcMove(this.countSquare, index); // доступные индексы для ходьбы

          this.countAttack = this.findAttackSquare(index); // поиск количества квадратиков. максимальная величина атаки
          this.allowIndexsAttack = this.calcAttack(this.countAttack, index); // доступные индексы для атаки
        } else {
          this.gameState.characterSelected = null; // если есть выбранные персонаж, то записываем null
          this.gameState.permissionMove = false; // если есть выбранный персонаж, то запрещаем ход
        }
      } else {
        gamePlay.showError("Так нельзя!"); // выбрасывание ошибки
      }
    }

    // Перемещение персонажа пользователя

    if (
      //проверка, что нажатая ячейка с таким то индексом не содрежит игрока user или enemy. Проверка permissionMove
      !this.findPersonByIndex(index) &&
      !this.findEnemyPerson(index) &&
      this.gameState.permissionMove &&
      this.allowIndexsMove.includes(index)
    ) {
      this.userMoveClickIndex(index); // перемещение персонажа на выбранную ячейку
      this.gamePlay.cells.forEach(
        (elem) => elem.classList.remove("selected-green") // удаление курсора выбора ячейки
      );
    } else if (this.gameState.characterSelected) {
      // курсор чтобы сбрасывался при нажатии на индекс ячейки недоступный для ходьбы на своего персонажа
      if (!this.findPersonByIndex(index)) {
        this.gameState.characterSelected = null;
        this.gameState.permissionMove = false;
      }
    }
  }

  onCellEnter(index) {
    // метод работает при наведении курсора на персонажа.

    if (this.findPersonByIndex(index)) {
      const hero = this.findPersonByIndex(index).character;
      const message = `\u{1F396}${hero.level}\u{2694}${hero.attack}\u{1F6E1}${hero.defence}\u{2764}${hero.health}`;
      this.gamePlay.showCellTooltip(message, index); // если сработает метод findPersonByIndex то выведется окошоко с сообщением
    }

    if (this.findUserPerson(index)) {
      this.gamePlay.setCursor("pointer"); //pointer при выборе игрока
    }

    if (!this.findPersonByIndex(index) && this.findtSelectedCharacter()) {
      if (this.allowIndexsMove.includes(index)) {
        this.gamePlay.setCursor("pointer");
        this.gamePlay.selectCell(index, "green"); //зеленый круг при выборе ячейки поля для ходьбы. С ограничениями в зависимости от типа персонажа.
        this.gameState.permissionMove = true;
      }
    }

    if (this.findEnemyPerson(index) && this.findtSelectedCharacter()) {
      if (this.allowIndexsAttack.includes(index)) {
        this.gamePlay.setCursor("pointer");
        this.gamePlay.selectCell(index, "red"); // красный круг при выборе атаки во время хода игрока
      }
    } else if (this.findUserPerson(index) && this.findtSelectedCharacter()) {
      this.gamePlay.setCursor("not-allowed"); //при недопустимых условиях курсор not-allowed
    }
  }

  onCellLeave(index) {
    //логика при покидании фокуса ячейки
    this.gamePlay.cells.forEach((elem) =>
      elem.classList.remove("selected-red")
    );
    this.gamePlay.cells.forEach((elem) =>
      elem.classList.remove("selected-green")
    );
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor("auto");
  }

  findPersonByIndex(index) {
    // поиск игрока по индексу ячейки
    return this.gameState.heroesList.find(
      (person) => person.position === index
    );
  }

  findUserPerson(index) {
    // поиск игрока user по индексу
    return this.userTeamWithPosition.find(
      (person) => person.position === index
    );
  }

  findEnemyPerson(index) {
    // поиск игрока Enemy по индексу
    return this.enemyTeamWithPosition.find(
      (person) => person.position === index
    );
  }

  findtSelectedCharacter() {
    // поиск выбранного игрока
    return this.gameState.heroesList.find(
      (elem) => elem.position === this.gameState.characterSelected
    );
  }

  findCountSquare(index) {
    //возвращение числа возможных ячеек при ходьбе в зависимости от типа персонажа
    const pers = this.findPersonByIndex(index);
    if (pers.character.type == "swordsman" || pers.character.type == "undead") {
      let countSquare = 4;
      return countSquare;
    }
    if (pers.character.type == "bowman" || pers.character.type == "vampire") {
      let countSquare = 2;
      return countSquare;
    }
    if (pers.character.type == "magician" || pers.character.type == "daemon") {
      let countSquare = 1;
      return countSquare;
    }
  }

  calcMove(countSquare, indexSelected) {
    this.allowIndexsMove = [];
    let rightIndex = [];
    let leftIndex = [];
    let upIndex = [];
    let downIndex = [];

    const leftBorder = []; //левая граница
    const rightBorder = []; //правая граница

    for (
      // заполнение левой и правой границ
      let i = 0, j = this.gamePlay.boardSize - 1;
      leftBorder.length < this.gamePlay.boardSize;
      i += this.gamePlay.boardSize, j += this.gamePlay.boardSize
    ) {
      leftBorder.push(i);
      rightBorder.push(j);
    }

    const upBorder = []; //верхняя и нижняя граница
    const downBorder = []; //нижняя и нижняя граница

    for (
      // заполнение верхней и нижней границ
      let i = 0, j = this.gamePlay.boardSize * this.gamePlay.boardSize - 1;
      upBorder.length < this.gamePlay.boardSize;
      i += 1, j -= 1
    ) {
      upBorder.push(i);
      downBorder.push(j);
    }

    //клетки по вертикали
    for (let i = 1; i <= countSquare; i++) {
      //проверка является ли клетка на которой стоит игрок границей. если нет то пушим в доступные для ходьбы индексы

      if (!upBorder.includes(indexSelected)) {
        const index = indexSelected - this.gamePlay.boardSize * i;
        if (index >= 0) {
          this.allowIndexsMove.push(
            indexSelected - this.gamePlay.boardSize * i
          ); // клетки сверху
          upIndex.push(index);
        }
      }

      if (!downBorder.includes(indexSelected)) {
        const index = indexSelected + this.gamePlay.boardSize * i;
        if (index < this.gamePlay.boardSize ** 2) {
          this.allowIndexsMove.push(
            indexSelected + this.gamePlay.boardSize * i
          ); // клетки снизу
          downIndex.push(index);
        }
      }
    }
    //клетки по вертикали

    //клетки справа
    for (let i = 1; i <= countSquare; i++) {
      if (rightBorder.includes(indexSelected)) {
        //проверка является ли клетка на которой персонаж границей.
        break;
      }

      this.allowIndexsMove.push(indexSelected + i); // клетки справа
      rightIndex.push(indexSelected + i);

      let diagDownRight = indexSelected + (this.gamePlay.boardSize * i + i); // клетки снизу по диагонали справа
      if (diagDownRight < this.gamePlay.boardSize ** 2) {
        this.allowIndexsMove.push(diagDownRight);
        rightIndex.push(diagDownRight);
      }

      let diagUpRight = indexSelected - (this.gamePlay.boardSize * i - i); // клетки справа сверху по диагонали
      if (diagUpRight >= 0) {
        this.allowIndexsMove.push(diagUpRight);
        rightIndex.push(diagUpRight);
      }

      if (rightBorder.includes(indexSelected + i)) break;
    }
    //клетки справа

    //клетки слева
    for (let i = 1; i <= countSquare; i++) {
      if (leftBorder.includes(indexSelected)) {
        //проверка является ли клетка на которой персонаж границей.
        break;
      }
      this.allowIndexsMove.push(indexSelected - i); // клетки слева
      leftIndex.push(indexSelected - i);

      let diagDownLeft = indexSelected + (this.gamePlay.boardSize * i - i); // клетки слева по диагонали снизу
      if (diagDownLeft < this.gamePlay.boardSize ** 2) {
        this.allowIndexsMove.push(diagDownLeft); // клетки слева по диагонали снизу
        leftIndex.push(diagDownLeft);
      }

      let diagUpLeft = indexSelected - (this.gamePlay.boardSize * i + i); // клетки слева сверху по диагонали
      if (diagUpLeft >= 0) {
        this.allowIndexsMove.push(diagUpLeft); // клетки сверху по диагонали слева
        leftIndex.push(diagUpLeft);
      }

      if (leftBorder.includes(indexSelected - i)) break;
    }
    //клетки слева

    console.log(
      upIndex + " upIndex",
      downIndex + " downIndex",
      leftIndex + " leftIndex",
      rightIndex + " rightIndex",
      " ИНДЕКСЫ ХОДЬБЫ"
    );
    return this.allowIndexsMove;
  }

  userMoveClickIndex(index) {
    this.findtSelectedCharacter().position = index; // поиск персонажа по индексу и замена этого индекса
    this.gamePlay.deselectCell(this.gameState.characterSelected); // удаление выбранных персонажей
    this.gamePlay.redrawPositions(this.gameState.heroesList); // перерисовка позиций персонажей
    this.gameState.characterSelected = null;
    this.gameState.permissionMove = false;
  }

  findAttackSquare(index) {
    //возвращение числа возможных ячеек при атаке в зависимости от типа персонажа
    const pers = this.findPersonByIndex(index);
    if (pers.character.type == "swordsman" || pers.character.type == "undead") {
      let attackSquare = 1;
      return attackSquare;
    }
    if (pers.character.type == "bowman" || pers.character.type == "vampire") {
      let attackSquare = 2;
      return attackSquare;
    }
    if (pers.character.type == "magician" || pers.character.type == "daemon") {
      let attackSquare = 4;
      return attackSquare;
    }
  }

  calcAttack(countAttack, indexSelected) {
    //надо сделать радиус атаки

    this.allowIndexsAttack = [];

    let rightIndex = [];
    let leftIndex = [];
    let upIndex = [];
    let downIndex = [];

    const leftBorder = []; //левая граница
    const rightBorder = []; //правая граница

    for (
      // заполнение левой и правой границ
      let i = 0, j = this.gamePlay.boardSize - 1;
      leftBorder.length < this.gamePlay.boardSize;
      i += this.gamePlay.boardSize, j += this.gamePlay.boardSize
    ) {
      leftBorder.push(i);
      rightBorder.push(j);
    }

    const upBorder = []; //верхняя и нижняя граница
    const downBorder = []; //нижняя и нижняя граница

    for (
      // заполнение верхней и нижней границ
      let i = 0, j = this.gamePlay.boardSize * this.gamePlay.boardSize - 1;
      upBorder.length < this.gamePlay.boardSize;
      i += 1, j -= 1
    ) {
      upBorder.push(i);
      downBorder.push(j);
    }

    //клетки по вертикали
    for (let i = 1; i <= countAttack; i++) {
      //проверка является ли клетка на которой стоит игрок границей. если нет то пушим в доступные для ходьбы индексы

      if (!upBorder.includes(indexSelected)) {
        const index = indexSelected - this.gamePlay.boardSize * i;
        if (index >= 0) {
          this.allowIndexsAttack.push(
            indexSelected - this.gamePlay.boardSize * i
          ); // клетки сверху
          upIndex.push(index);
        }
      }

      if (!downBorder.includes(indexSelected)) {
        const index = indexSelected + this.gamePlay.boardSize * i;
        if (index < this.gamePlay.boardSize ** 2) {
          this.allowIndexsAttack.push(
            indexSelected + this.gamePlay.boardSize * i
          ); // клетки снизу
          downIndex.push(index);
        }
      }
    }
    //клетки по вертикали

    //клетки справа
    for (let i = 1; i <= countAttack; i++) {
      if (rightBorder.includes(indexSelected)) {
        //проверка является ли клетка на которой персонаж границей.
        break;
      }

      this.allowIndexsAttack.push(indexSelected + i); // клетки справа
      rightIndex.push(indexSelected + i);

      let diagDownRight = indexSelected + (this.gamePlay.boardSize * i + i); // клетки снизу по диагонали справа
      if (diagDownRight < this.gamePlay.boardSize ** 2) {
        this.allowIndexsAttack.push(diagDownRight);
        rightIndex.push(diagDownRight);
      }

      let diagUpRight = indexSelected - (this.gamePlay.boardSize * i - i); // клетки справа сверху по диагонали
      if (diagUpRight >= 0) {
        this.allowIndexsAttack.push(diagUpRight);
        rightIndex.push(diagUpRight);
      }

      if (rightBorder.includes(indexSelected + i)) break;
    }
    //клетки справа

    //клетки слева
    for (let i = 1; i <= countAttack; i++) {
      if (leftBorder.includes(indexSelected)) {
        //проверка является ли клетка на которой персонаж границей.
        break;
      }
      this.allowIndexsAttack.push(indexSelected - i); // клетки слева
      leftIndex.push(indexSelected - i);

      let diagDownLeft = indexSelected + (this.gamePlay.boardSize * i - i); // клетки слева по диагонали снизу
      if (diagDownLeft < this.gamePlay.boardSize ** 2) {
        this.allowIndexsAttack.push(diagDownLeft); // клетки слева по диагонали снизу
        leftIndex.push(diagDownLeft);
      }

      let diagUpLeft = indexSelected - (this.gamePlay.boardSize * i + i); // клетки слева сверху по диагонали
      if (diagUpLeft >= 0) {
        this.allowIndexsAttack.push(diagUpLeft); // клетки сверху по диагонали слева
        leftIndex.push(diagUpLeft);
      }

      if (leftBorder.includes(indexSelected - i)) break;
    }
    //клетки слева

    console.log(
      upIndex + " upIndex",
      downIndex + " downIndex",
      leftIndex + " leftIndex",
      rightIndex + " rightIndex",
      " ИНДЕКСЫ АТАКИ"
    );
    return this.allowIndexsMove;
  }
}
console.log(GameController);
