import { _decorator, Component, Node, Prefab, instantiate, Vec3, view, UITransform } from 'cc';
const { ccclass, property } = _decorator;

type ConfettiParticle = {
    node: Node;
    velocity: Vec3;
    angularVelocityDeg: number;
    lifetime: number;
    age: number;
};

@ccclass('ConfettiBurst')
export class ConfettiBurst extends Component {
    @property({ type: Node })
    public fxLayer: Node | null = null;
@property({ type: [Prefab] })
public confettiPrefabs: Prefab[] = [];


    @property({ type: Node })
    public leftEmitterWorld: Node | null = null;

    @property({ type: Node })
    public rightEmitterWorld: Node | null = null;

    @property
    public spawnCountTotal = 220;

    @property
    public spawnSeconds = 0.35;

    @property
    public minSpeed = 900;

    @property
    public maxSpeed = 1400;

    @property
    public spreadDegrees = 22;

    @property
    public gravityPixelsPerSecond2 = 2200;

    @property
    public minLifetimeSeconds = 1.0;

    @property
    public maxLifetimeSeconds = 1.8;

    @property
    public minAngularVelocityDegPerSec = -360;

    @property
    public maxAngularVelocityDegPerSec = 360;

    private particles: ConfettiParticle[] = [];
    private spawnTimer = 0;
    private spawned = 0;
    private spawning = false;

    update(dt: number): void {
        this.updateSpawning(dt);
        this.updateParticles(dt);
    }

    public burst(): void {
    if (!this.fxLayer || this.confettiPrefabs.length === 0) return;

        if (!this.leftEmitterWorld || !this.rightEmitterWorld) return;

        this.spawnTimer = 0;
        this.spawned = 0;
        this.spawning = true;
    }

    private updateSpawning(dt: number): void {
        if (!this.spawning) return;

        this.spawnTimer += dt;

        const total = Math.max(1, Math.floor(this.spawnCountTotal));
        const duration = Math.max(0.01, this.spawnSeconds);
        const targetSpawned = Math.min(total, Math.floor((this.spawnTimer / duration) * total));

        while (this.spawned < targetSpawned) {
            const fromLeft = (this.spawned % 2) === 0;
            this.spawnOne(fromLeft);
            this.spawned++;
        }

        if (this.spawned >= total) {
            this.spawning = false;
        }
    }

    private spawnOne(fromLeft: boolean): void {
        const prefab = this.confettiPrefabs[Math.floor(Math.random() * this.confettiPrefabs.length)];
const n = instantiate(prefab);

        const emitter = fromLeft ? this.leftEmitterWorld : this.rightEmitterWorld;
        if (!emitter) return;

        
        this.fxLayer.addChild(n);

        // позиция: берём worldPosition эмиттера и ставим в fxLayer local через worldPosition (fxLayer обычно под Canvas)
        const wp = emitter.worldPosition;
        n.setWorldPosition(wp);

        const dirToCenter = this.computeDirectionToScreenCenter(wp);
        const dir = this.applySpread(dirToCenter, this.spreadDegrees);

        const speed = this.randomRange(this.minSpeed, this.maxSpeed);
        const vel = new Vec3(dir.x * speed, dir.y * speed, 0);

        const life = this.randomRange(this.minLifetimeSeconds, this.maxLifetimeSeconds);
        const ang = this.randomRange(this.minAngularVelocityDegPerSec, this.maxAngularVelocityDegPerSec);

        this.particles.push({
            node: n,
            velocity: vel,
            angularVelocityDeg: ang,
            lifetime: life,
            age: 0,
        });
    }

    private updateParticles(dt: number): void {
        if (this.particles.length === 0) return;

        const gravity = this.gravityPixelsPerSecond2;

        // границы экрана для удаления
        const size = view.getVisibleSize();
        const margin = 200;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.age += dt;

            // v.y -= g*dt
            p.velocity.y -= gravity * dt;

            // pos += v*dt
            const wp = p.node.worldPosition;
            p.node.setWorldPosition(wp.x + p.velocity.x * dt, wp.y + p.velocity.y * dt, wp.z);

            // rotation
            p.node.angle += p.angularVelocityDeg * dt;

            // kill conditions
            const sp = this.worldToScreenFast(p.node.worldPosition);
            const out =
                sp.x < -margin || sp.x > size.width + margin ||
                sp.y < -margin || sp.y > size.height + margin;

            if (p.age >= p.lifetime || out) {
                p.node.destroy();
                this.particles.splice(i, 1);
            }
        }
    }

    private computeDirectionToScreenCenter(worldPos: Vec3): Vec3 {
        const size = view.getVisibleSize();
        const centerScreen = new Vec3(size.width * 0.5, size.height * 0.55, 0);

        const sp = this.worldToScreenFast(worldPos);
        const d = new Vec3(centerScreen.x - sp.x, centerScreen.y - sp.y, 0);
        const len = Math.max(0.0001, Math.sqrt(d.x * d.x + d.y * d.y));
        return new Vec3(d.x / len, d.y / len, 0);
    }

    private applySpread(dir: Vec3, spreadDeg: number): Vec3 {
        const spreadRad = (spreadDeg * Math.PI) / 180;
        const angle = (Math.random() * 2 - 1) * spreadRad;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vec3(
            dir.x * cos - dir.y * sin,
            dir.x * sin + dir.y * cos,
            0
        );
    }

    private worldToScreenFast(world: Vec3): Vec3 {
        // Для UI-Canvas в 2D обычно world == screen-ish, но безопаснее через view:
        // Здесь используем упрощённо: берём world, как есть, если Canvas/Camera не трогаем.
        // Если у тебя камера UI и мир, лучше передать Camera и использовать camera.worldToScreen().
        return new Vec3(world.x, world.y, 0);
    }

    private randomRange(a: number, b: number): number {
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        return min + Math.random() * (max - min);
    }
}
