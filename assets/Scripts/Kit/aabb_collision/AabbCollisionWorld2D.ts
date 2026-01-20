import { _decorator, Component, Rect } from 'cc';
import { AabbHitbox2D } from './AabbHitbox2D';
import { IAabbCollisionListener } from './IAabbCollisionListener';

const { ccclass, property } = _decorator;

@ccclass('AabbCollisionWorld2D')
export class AabbCollisionWorld2D extends Component {
    @property({ type: AabbHitbox2D })
    public sensor: AabbHitbox2D | null = null;

    private readonly targets: AabbHitbox2D[] = [];

    private listener: IAabbCollisionListener | null = null;

    private readonly sensorRect = new Rect();
    private readonly otherRect = new Rect();

    // enter-only: запоминаем, кто уже в контакте
    private readonly activeOverlaps = new Set<number>();

    public setListener(listener: IAabbCollisionListener | null): void {
        this.listener = listener;
    }

    public registerTarget(hitbox: AabbHitbox2D): void {
        if (this.targets.indexOf(hitbox) === -1) {
            this.targets.push(hitbox);
        }
    }

    public unregisterTarget(hitbox: AabbHitbox2D): void {
        const index = this.targets.indexOf(hitbox);
        if (index !== -1) {
            this.targets.splice(index, 1);
        }
    }

    update(): void {
        if (!this.sensor || !this.listener) return;
        if (!this.sensor.isEnabled()) return;

        this.sensor.getWorldAabb(this.sensorRect);

        // Собираем overlaps текущего кадра
        const currentOverlaps = new Set<number>();

        for (let i = 0; i < this.targets.length; i++) {
            const other = this.targets[i];
            if (!other || !other.isEnabled()) continue;

            if (!this.sensor.canCollideWith(other.layer)) continue;
            if (!other.canCollideWith(this.sensor.layer)) continue;

            other.getWorldAabb(this.otherRect);

            if (!this.sensorRect.intersects(this.otherRect)) {
                continue;
            }

            const key = this.pairKey(this.sensor, other);
            currentOverlaps.add(key);

            if (!this.activeOverlaps.has(key)) {
                this.activeOverlaps.add(key);
                this.listener.onAabbEnter(this.sensor, other);
            }
        }

        // Чистим пары, которые больше не пересекаются
        // (важно: чтобы повторный enter сработал снова)
        for (const key of this.activeOverlaps) {
            if (!currentOverlaps.has(key)) {
                this.activeOverlaps.delete(key);
            }
        }
    }

    private pairKey(a: AabbHitbox2D, b: AabbHitbox2D): number {
        // Стабильный ключ пары: используем uuid hashCode.
        // Простая и достаточная стратегия для playables.
        const ha = this.hashString(a.node.uuid);
        const hb = this.hashString(b.node.uuid);

        const min = ha < hb ? ha : hb;
        const max = ha < hb ? hb : ha;

        // Комбинируем два 16-bit сегмента (с риском коллизий, но крайне редко и приемлемо для playables)
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
