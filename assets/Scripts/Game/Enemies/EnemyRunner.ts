import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyRunner')
export class EnemyRunner extends Component {
    @property
    public speedPixelsPerSecond = 120;

    private readonly tmp = new Vec3();
    private isMoving = false;

    onEnable(): void {
        // на старте стоим
        this.isMoving = false;
    }

    public startMoving(): void {
        this.isMoving = true;
        this.enabled = true;
    }

    public stopMoving(): void {
        this.isMoving = false;
    }

    update(dt: number): void {
        if (!this.isMoving) return;

        this.node.getPosition(this.tmp);
        this.tmp.x -= this.speedPixelsPerSecond * dt;
        this.node.setPosition(this.tmp);
    }
}
