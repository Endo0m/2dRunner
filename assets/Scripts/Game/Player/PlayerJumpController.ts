import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
import { TweenAnimations } from '../../Kit/tweens/TweenAnimations';
import { PlayerAnimationController } from '../Player/PlayerAnimationController';
import { AudioController } from '../Flow/AudioController';
const { ccclass, property } = _decorator;

@ccclass('PlayerJumpController')
export class PlayerJumpController extends Component {
    @property({ type: Node })
    public visualRoot: Node | null = null;
    @property({ type: PlayerAnimationController })
public anim: PlayerAnimationController | null = null;
@property({ type: AudioController })
public audio: AudioController | null = null;

    @property
    public jumpCooldownSeconds = 0.5;

    private cooldownTimerSeconds = 0;

    @property
    public jumpHeight = 180;

    @property
    public upSeconds = 0.18;

    @property
    public downSeconds = 0.22;

    private enabledForInput = false;
    private baseY = 0;

    onEnable(): void {
        const target = this.visualRoot ?? this.node;
        this.baseY = target.position.y;
    }

    public setEnabled(value: boolean): void {
        this.enabledForInput = value;
    }
    update(dt: number): void {
    if (this.cooldownTimerSeconds > 0) {
        this.cooldownTimerSeconds -= dt;
        if (this.cooldownTimerSeconds < 0) {
            this.cooldownTimerSeconds = 0;
        }
    }
}

public jump(): void {
    if (!this.enabledForInput) return;
    if (this.cooldownTimerSeconds > 0) return;
this.audio?.playJump();

    this.cooldownTimerSeconds = this.jumpCooldownSeconds;
    this.anim?.playJump();

    const target = this.visualRoot ?? this.node;
    TweenAnimations.stopAll(target);

    const from = target.position.clone();
    const up = new Vec3(from.x, this.baseY + this.jumpHeight, from.z);
    const down = new Vec3(from.x, this.baseY, from.z);

    tween(target)
        .to(this.upSeconds, { position: up }, { easing: 'quadOut' as any })
        .to(this.downSeconds, { position: down }, { easing: 'quadIn' as any })
        .start();
}


}
