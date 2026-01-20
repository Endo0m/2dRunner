import { _decorator, Component, Rect, Vec3 } from 'cc';
import { HitboxKind } from './HitboxKind';

const { ccclass, property } = _decorator;

@ccclass('AabbHitbox2D')
export class AabbHitbox2D extends Component {
    @property
    public width = 80;

    @property
    public height = 80;

    @property
    public offsetX = 0;

    @property
    public offsetY = 0;

    @property({ type: HitboxKind })
    public kind: HitboxKind = HitboxKind.Trigger;

    /**
     * Layer (0..31). Как "physics layers": кто ты.
     */
    @property
    public layer = 0;

    /**
     * Mask битами: с какими layers ты вообще хочешь сталкиваться.
     * Пример: mask = (1<<2) | (1<<3)
     */
    @property
    public mask = 0xFFFFFFFF;

    private readonly rect = new Rect();
    private readonly tmpScale = new Vec3();

    public isEnabled(): boolean {
        return this.enabled && this.node.activeInHierarchy;
    }

    public canCollideWith(otherLayer: number): boolean {
        return (this.mask & (1 << otherLayer)) !== 0;
    }

    public getWorldAabb(out: Rect): Rect {
        // Учитываем scale (rotation игнорируем — для UI/playables обычно ок)
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
