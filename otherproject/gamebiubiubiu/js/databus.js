import Pool from './base/pool';
import Laser from './player/laser';

let instance;

/**
 * 全局状态管理器
 * 负责管理游戏的状态，包括帧数、分数、子弹、敌人和动画等
 */
export default class DataBus {
  // 直接在类中定义实例属性
  enemys = []; // 存储敌人
  bullets = []; // 存储玩家子弹
  enemyBullets = []; // 存储敌方子弹
  animations = []; // 存储动画
  frame = 0; // 当前帧数
  score = 0; // 当前分数
  isGameOver = false; // 游戏是否结束
  pool = new Pool(); // 初始化对象池

  constructor() {
    // 确保单例模式
    if (instance) return instance;

    instance = this;
  }

  // 重置游戏状态
  reset() {
    this.frame = 0; // 当前帧数
    this.score = 0; // 当前分数
    this.bullets = []; // 存储玩家子弹
    this.enemyBullets = []; // 存储敌方子弹
    this.enemys = []; // 存储敌人
    this.animations = []; // 存储动画
    this.isGameOver = false; // 游戏是否结束
  }

  // 游戏结束
  gameOver() {
    this.isGameOver = true;
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   * @param {Object} enemy - 要回收的敌人对象
   */
  removeEnemy(enemy) {
    const temp = this.enemys.splice(this.enemys.indexOf(enemy), 1);
    if (temp) {
      this.pool.recover('enemy', enemy); // 回收敌人到对象池
    }
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   * @param {Object} bullet - 要回收的子弹对象
   */
  removeBullets(bullet) {
    const temp = this.bullets.splice(this.bullets.indexOf(bullet), 1);
    if (temp) {
      // 根据子弹类型回收
      const poolName = bullet instanceof Laser ? 'laser' : 'bullet';
      this.pool.recover(poolName, bullet);
    }
  }

  /**
   * 回收敌方子弹，进入对象池
   * @param {Object} bullet - 要回收的敌方子弹对象
   */
  removeEnemyBullets(bullet) {
    const temp = this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
    if (temp) {
      this.pool.recover('enemyBullet', bullet);
    }
  }
}
