import { _decorator, Component, Rect } from 'cc';
import { AabbHitbox2D } from './AabbHitbox2D';
import { IAabbCollisionListener } from './IAabbCollisionListener';

const { ccclass, property } = _decorator;

@ccclass('AabbCollisionWorld2D')
export class AabbCollisionWorld2D extends Component {
    @property({ type: AabbHitbox2D })
    public sensor: AabbHitbox2D | null = null;

    private listener: IAabbCollisionListener | null = null;

    private readonly sensorRect = new Rect();
    private readonly otherRect = new Rect();
    private readonly activeOverlaps = new Set<number>();

    public setListener(listener: IAabbCollisionListener | null): void {
        this.listener = listener;
    }

    update(): void {
        if (!this.sensor || !this.listener) return;
        if (!this.sensor.isEnabled()) return;

        this.sensor.getWorldAabb(this.sensorRect);

        const currentOverlaps = new Set<number>();

        for (const other of AabbHitbox2D.active) {
            if (!other || other === this.sensor) continue;
            if (!other.isEnabled()) continue;

            if (!this.sensor.canCollideWith(other.layer)) continue;
            if (!other.canCollideWith(this.sensor.layer)) continue;

            other.getWorldAabb(this.otherRect);

            if (!this.sensorRect.intersects(this.otherRect)) continue;

            const key = this.pairKey(this.sensor, other);
            currentOverlaps.add(key);

            if (!this.activeOverlaps.has(key)) {
                this.activeOverlaps.add(key);
                this.listener.onAabbEnter(this.sensor, other);
            }
        }

        for (const key of this.activeOverlaps) {
            if (!currentOverlaps.has(key)) {
                this.activeOverlaps.delete(key);
            }
        }
    }

    private pairKey(a: AabbHitbox2D, b: AabbHitbox2D): number {
        const ha = this.hashString(a.node.uuid);
        const hb = this.hashString(b.node.uuid);

        const min = ha < hb ? ha : hb;
        const max = ha < hb ? hb : ha;

        return ((min & 0xFFFF) << 16) | (max & 0xFFFF);
    }

    private hashString(value: string): number {
        let h = 0;
        for (let i = 0; i < value.length; i++) {
            h = ((h << 5) - h) + value.charCodeAt(i);
            h |= 0;
        }
        return h;
    }
}
