import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HealthController')
export class HealthController extends Component {
    @property
    public maxLives = 3;

    @property
    public invulnerableSecondsAfterHit = 0.6;

    private currentLives = 0;
    private invulnerableTimerSeconds = 0;

    public onLivesChanged: ((lives: number) => void) | null = null;
    public onDied: (() => void) | null = null;

    onEnable(): void {
        this.resetToMax();
    }

    update(dt: number): void {
        if (this.invulnerableTimerSeconds > 0) {
            this.invulnerableTimerSeconds -= dt;
            if (this.invulnerableTimerSeconds < 0) this.invulnerableTimerSeconds = 0;
        }
    }

    public resetToMax(): void {
        this.currentLives = this.maxLives;
        this.invulnerableTimerSeconds = 0;
        this.onLivesChanged?.(this.currentLives);
    }

    public canTakeDamage(): boolean {
        return this.currentLives > 0 && this.invulnerableTimerSeconds <= 0;
    }

    public tryApplyDamage(amount: number = 1): boolean {
        if (!this.canTakeDamage()) return false;

        const nextLives = Math.max(0, this.currentLives - Math.max(1, Math.floor(amount)));
        if (nextLives === this.currentLives) return false;

        this.currentLives = nextLives;
        this.invulnerableTimerSeconds = this.invulnerableSecondsAfterHit;

        this.onLivesChanged?.(this.currentLives);

        if (this.currentLives <= 0) {
            this.onDied?.();
        }

        return true;
    }

    public getLives(): number {
        return this.currentLives;
    }
}
