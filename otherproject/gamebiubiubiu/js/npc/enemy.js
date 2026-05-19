import Animation from '../base/animation';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import EnemyBullet from './enemyBullet';

const ENEMY_IMG_SRC = 'images/enemy.png';
const ENEMY_WIDTH = 60;
const ENEMY_HEIGHT = 60;
const EXPLO_IMG_PREFIX = 'images/explosion';
const ENEMY_SHOOT_INTERVAL = 80; // 敌人射击间隔（每80帧射击一次）
const ENEMY_SHOOT_START_FRAME = 600; // 10秒后敌机才能射击 (10 * 60帧)

export default class Enemy extends Animation {
  speed = Math.random() * 6 + 3; // 飞行速度

  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT);
  }

  init() {
    this.x = this.getRandomX();
    this.y = -this.height;

    this.isActive = true;
    this.visible = true;
    this.shootTimer = 0; // 射击计时器
    // 设置爆炸动画
    this.initExplosionAnimation();
  }

  /**
   * 敌人射击操作
   */
  shoot() {
    const enemyBullet = GameGlobal.databus.pool.getItemByClass('enemyBullet', EnemyBullet);
    const bulletSpeed = 6;
    enemyBullet.init(
      this.x + this.width / 2 - enemyBullet.width / 2,
      this.y + this.height,
      bulletSpeed
    );
    GameGlobal.databus.enemyBullets.push(enemyBullet);
  }

  // 生成随机 X 坐标
  getRandomX() {
    return Math.floor(Math.random() * (SCREEN_WIDTH - ENEMY_WIDTH));
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    const EXPLO_FRAME_COUNT = 19;
    const frames = Array.from(
      { length: EXPLO_FRAME_COUNT },
      (_, i) => `${EXPLO_IMG_PREFIX}${i + 1}.png`
    );
    this.initFrames(frames);
  }

  // 每一帧更新敌人位置
  update() {
    if (GameGlobal.databus.isGameOver) {
      return;
    }

    this.y += this.speed;

    // 敌人射击
    this.shootTimer++;
    if (this.shootTimer >= ENEMY_SHOOT_INTERVAL) {
      this.shoot();
      this.shootTimer = 0;
    }

    // 对象回收
    if (this.y > SCREEN_HEIGHT + this.height) {
      this.remove();
    }
  }

  destroy() {
    this.isActive = false;
    // 播放销毁动画后移除
    this.playAnimation();
    GameGlobal.musicManager.playExplosion(); // 播放爆炸音效
    wx.vibrateShort({
      type: 'light'
    }); // 轻微震动
    this.on('stopAnimation', () => this.remove.bind(this));
  }

  remove() {
    this.isActive = false;
    this.visible = false;
    GameGlobal.databus.removeEnemy(this);
  }
}
