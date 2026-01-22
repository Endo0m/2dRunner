import { _decorator, Component } from 'cc';
import { EnemyRunner } from './EnemyRunner';

const { ccclass, property } = _decorator;

@ccclass('EnemyStartTrigger')
export class EnemyStartTrigger extends Component {
    @property({ type: EnemyRunner })
    public enemy: EnemyRunner | null = null;

    @property
    public startOnce = true;

    private started = false;

    public startEnemy(): void {
        if (!this.enemy) return;
        if (this.startOnce && this.started) return;

        this.started = true;
        this.enemy.startMoving();
    }
}
