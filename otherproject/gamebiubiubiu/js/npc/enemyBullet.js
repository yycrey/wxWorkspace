import Sprite from '../base/sprite';
import { SCREEN_HEIGHT } from '../render';

const ENEMY_BULLET_IMG_SRC = 'images/bullet.png';
const ENEMY_BULLET_WIDTH = 16;
const ENEMY_BULLET_HEIGHT = 30;

export default class EnemyBullet extends Sprite {
  constructor() {
    super(ENEMY_BULLET_IMG_SRC, ENEMY_BULLET_WIDTH, ENEMY_BULLET_HEIGHT);
  }

  init(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = true;
    this.visible = true;
    this.rotation = 180; // 旋转180度，让子弹朝下
  }

  // 每一帧更新子弹位置（向下飞）
  update() {
    if (GameGlobal.databus.isGameOver) {
      return;
    }
  
    this.y += this.speed;

    // 超出屏幕外销毁
    if (this.y > SCREEN_HEIGHT + this.height) {
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
    this.rotation = 180; // 重置旋转角度
    // 回收子弹对象
    GameGlobal.databus.removeEnemyBullets(this);
  }
}