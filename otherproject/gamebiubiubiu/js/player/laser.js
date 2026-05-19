import Sprite from '../base/sprite';

const LASER_IMG_SRC = 'images/bullet.png';
const LASER_WIDTH = 8;
const LASER_HEIGHT = 80;

export default class Laser extends Sprite {
  constructor() {
    super(LASER_IMG_SRC, LASER_WIDTH, LASER_HEIGHT);
  }

  init(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = true;
    this.visible = true;
  }

  update() {
    if (GameGlobal.databus.isGameOver) {
      return;
    }
  
    this.y -= this.speed;

    if (this.y < -this.height) {
      this.destroy();
    }
  }

  destroy() {
    this.isActive = false;
    this.remove();
  }

  remove() {
    this.isActive = false;
    this.visible = false;
    GameGlobal.databus.removeBullets(this);
  }
}
