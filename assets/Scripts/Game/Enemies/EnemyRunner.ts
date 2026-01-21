import { _decorator, Component, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('EnemyRunner')
export class EnemyRunner extends Component {
    @property
    public speedPixelsPerSecond = 120;

    private readonly tmp = new Vec3();

    update(dt: number): void {
        this.node.getPosition(this.tmp);
        this.tmp.x -= this.speedPixelsPerSecond * dt;
        this.node.setPosition(this.tmp);
    }
}
