// @ts-check

class DOMElement {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    /**
     * @private
     * @type {HTMLElement}
     */
    this.element = element;

    this.applyStyles = this.applyStyles.bind(this);
  }

  /**
   * @param {Partial<CSSStyleDeclaration>} styles
   * @returns {this}
   */
  applyStyles(styles) {
    Object.entries(styles).forEach(
      ([property, value]) => (this.element.style[property] = value)
    );

    return this;
  }
}

class Dice {
  /**
   * @param {number} faces
   */
  constructor(faces = 6) {
    this.faces = faces;
  }

  roll() {
    const min = 1;
    const max = this.faces;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

class Piece {
  /**
   * @param {HTMLElement} element
   * @param {number} x
   * @param {number} y
   */
  constructor(element, x = 0, y = 0) {
    /**
     * @private
     * @type {HTMLElement}
     */
    this.element = element;

    /**
     * @readonly
     * @type {number}
     */
    this.x = x;

    /**
     * @readonly
     * @type {number}
     */
    this.y = y;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Piece}
   */
  with(x, y) {
    return new Piece(this.element, x, y);
  }

  /**
   * @param {number} x
   * @returns {Piece}
   */
  withX(x) {
    return new Piece(this.element, x, this.y);
  }

  /**
   * @param {number} y
   * @returns {Piece}
   */
  withY(y) {
    return new Piece(this.element, this.x, y);
  }

  /**
   * @param {number} x
   * @param {number} y
   *
   * @returns {Piece}
   */
  move(x, y) {
    return new Piece(this.element, this.x + x, this.y + y);
  }

  /**
   * @param {number} x
   * @returns {Piece}
   */
  moveX(x) {
    return this.move(x, this.y);
  }

  /**
   * @param {number} y
   * @returns {Piece}
   */
  moveY(y) {
    return this.move(this.x, y);
  }

  render() {
    new DOMElement(this.element).applyStyles({
      top: this.y + "px",
      left: this.x + "px",
    });
  }
}

class Board {
  /**
   * @param {HTMLElement} wrapper
   * @param {Dice} dice
   * @param {Piece} piece
   */
  constructor(wrapper, dice, piece) {
    /**
     * @private
     * @type {HTMLElement}
     */
    this.wrapper = wrapper;

    /**
     * @private
     * @type {Dice}
     */
    this.dice = dice;

    /**
     * @private
     * @type {Piece}
     */
    this.piece = piece;

    /**
     * @readonly
     * @type {number}
     */
    this.size = this.wrapper.querySelector(".square").clientWidth ?? 0;

    /**
     * @readonly
     * @type {number}
     */
    this.tiles = this.wrapper.querySelectorAll(".square").length;
  }

  render() {
    this.piece.render();
    return this;
  }

  reset() {
    this.piece = this.piece.withX(0);
    return this.render();
  }

  playRound() {
    const maxX = (this.tiles - 1) * this.size;
    this.piece = this.piece.moveX(this.dice.roll() * this.size);

    if (this.piece.x > maxX) {
      this.piece = this.piece.withX(maxX);
    }

    return this.render();
  }
}

/**
 *
 * @param {{ play: HTMLButtonElement, reset: HTMLButtonElement, board: Board }} dependencies
 */
function app({ play, reset, board }) {
  play.addEventListener("click", () => board.playRound());
  reset.addEventListener("click", () => board.reset());
}

app({
  play: document.querySelector("#play"),
  reset: document.querySelector("#reset"),
  board: new Board(
    document.querySelector(".board"),
    new Dice(),
    new Piece(document.querySelector(".piece"))
  ),
});
