import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('WorldScroller')
export class WorldScroller extends Component {
    @property({ type: Node })
    public world: Node | null = null;

    @property
    public speedPixelsPerSecond = 520;

    private running = false;
    private readonly tmp = new Vec3();

    public setRunning(value: boolean): void {
        this.running = value;
    }

    update(dt: number): void {
        if (!this.running || !this.world) return;

        this.world.getPosition(this.tmp);
        this.tmp.x -= this.speedPixelsPerSecond * dt;
        this.world.setPosition(this.tmp);
    }
}
