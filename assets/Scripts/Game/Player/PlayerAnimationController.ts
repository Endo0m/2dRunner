import { _decorator, Component, Animation } from 'cc';
const { ccclass, property } = _decorator;

enum PlayerAnimState {
    Idle,
    Run,
    Jump,
    Hurt,
}

@ccclass('PlayerAnimationController')
export class PlayerAnimationController extends Component {
    @property({ type: Animation })
    public animation: Animation | null = null;

    @property public idleClip = 'idle';
    @property public runClip = 'run';
    @property public jumpClip = 'jump';
    @property public hurtClip = 'hurt';

    private state: PlayerAnimState = PlayerAnimState.Idle;
    private desiredLoopState: PlayerAnimState = PlayerAnimState.Idle;

    onEnable(): void {
        this.animation?.on(Animation.EventType.FINISHED, this.onFinished, this);
        this.playIdle();
    }

    onDisable(): void {
        this.animation?.off(Animation.EventType.FINISHED, this.onFinished, this);
    }

    public playIdle(): void {
        this.desiredLoopState = PlayerAnimState.Idle;
        this.play(PlayerAnimState.Idle, this.idleClip);
    }

    public playRun(): void {
        this.desiredLoopState = PlayerAnimState.Run;
        this.play(PlayerAnimState.Run, this.runClip);
    }

    public playJump(): void {
        this.play(PlayerAnimState.Jump, this.jumpClip);
    }

    public playHurt(): void {
        this.play(PlayerAnimState.Hurt, this.hurtClip);
    }

    private play(state: PlayerAnimState, clip: string): void {
        if (!this.animation) return;
        this.state = state;
        this.animation.play(clip);
    }

    private onFinished(): void {
        if (this.state === PlayerAnimState.Jump || this.state === PlayerAnimState.Hurt) {
            this.desiredLoopState === PlayerAnimState.Run
                ? this.playRun()
                : this.playIdle();
        }
    }
}
