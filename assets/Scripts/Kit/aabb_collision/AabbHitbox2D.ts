import { _decorator, Component, Rect, Vec3, Enum } from 'cc';
import { HitboxKind } from './HitboxKind';

const { ccclass, property } = _decorator;

@ccclass('AabbHitbox2D')
export class AabbHitbox2D extends Component {
    public static readonly active = new Set<AabbHitbox2D>();

    @property({ type: Enum(HitboxKind) })
    public kind: HitboxKind = HitboxKind.Player;

    @property
    public width = 80;

    @property
    public height = 80;

    @property
    public offsetX = 0;

    @property
    public offsetY = 0;

    @property
    public layer = 0;

    @property
    public mask = 0xFFFFFFFF;

    private readonly tmpScale = new Vec3();

    onEnable(): void {
        AabbHitbox2D.active.add(this);
    }

    onDisable(): void {
        AabbHitbox2D.active.delete(this);
    }

    onDestroy(): void {
        AabbHitbox2D.active.delete(this);
    }

    public isEnabled(): boolean {
        return this.enabled && this.node.activeInHierarchy;
    }

    public canCollideWith(otherLayer: number): boolean {
        return (this.mask & (1 << otherLayer)) !== 0;
    }

    public getWorldAabb(out: Rect): Rect {
        const p = this.node.worldPosition;
        this.tmpScale.set(this.node.worldScale);

        const w = this.width * Math.abs(this.tmpScale.x);
        const h = this.height * Math.abs(this.tmpScale.y);

        out.x = p.x + this.offsetX - w * 0.5;
        out.y = p.y + this.offsetY - h * 0.5;
        out.width = w;
        out.height = h;
        return out;
    }
}
