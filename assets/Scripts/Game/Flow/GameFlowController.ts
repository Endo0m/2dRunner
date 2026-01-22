import { _decorator, Component } from 'cc';
import { AabbCollisionWorld2D } from '../../Kit/aabb_collision/AabbCollisionWorld2D';
import { IAabbCollisionListener } from '../../Kit/aabb_collision/IAabbCollisionListener';
import { AabbHitbox2D } from '../../Kit/aabb_collision/AabbHitbox2D';
import { HitboxKind } from '../../Kit/aabb_collision/HitboxKind';
import { WorldScroller } from './WorldScroller';
import { TutorialPanelController } from '.././UI/TutorialPanelController';
import { HudController } from '.././UI/HudController';
import { ResultPanelController, ResultVariant } from '.././UI/ResultPanelController';
import { PlayerJumpController } from '../Player/PlayerJumpController';
import { HealthController } from '../Player/HealthController';
import { PlayerAnimationController } from '../Player/PlayerAnimationController';
import { AudioController } from './AudioController';
import { ConfettiBurst } from '../UI/ConfettiBurst';
const { ccclass, property } = _decorator;

enum GameFlowState {
    AwaitingStart = 1,
    Running = 2,
    TutorialPause = 3,
    Won = 4,
    Lost = 5,
}

@ccclass('GameFlowController')
export class GameFlowController extends Component implements IAabbCollisionListener {
    @property({ type: WorldScroller })
    public worldScroller: WorldScroller | null = null;

@property({ type: ConfettiBurst })
public confetti: ConfettiBurst | null = null;

@property({ type: AudioController })
public audio: AudioController | null = null;

 @property({ type: PlayerAnimationController })
public playerAnim: PlayerAnimationController | null = null;
    @property({ type: HealthController })
    public health: HealthController | null = null;
    @property({ type: AabbCollisionWorld2D })
    public collisionWorld: AabbCollisionWorld2D | null = null;

    @property({ type: PlayerJumpController })
    public playerJump: PlayerJumpController | null = null;

    @property({ type: TutorialPanelController })
    public tutorialPanel: TutorialPanelController | null = null;

    @property({ type: HudController })
    public hud: HudController | null = null;

    @property({ type: ResultPanelController })
    public resultPanel: ResultPanelController | null = null;

    private state: GameFlowState = GameFlowState.AwaitingStart;
    // private lives = 3;
    private sessionCoins = 0;

    onEnable(): void {
        this.collisionWorld?.setListener(this);
        // this.enterAwaitingStart();
        this.health!.onLivesChanged = (lives) => this.hud?.setLives(lives);
        this.health!.onDied = () => this.lose();
this.health!.onDamaged = () => {
    this.playerAnim?.playHurt();
    this.audio?.playHurt();
};


    }

    onDisable(): void {
        this.collisionWorld?.setListener(null);
    }

    public onTap(): void {
    if (this.state === GameFlowState.AwaitingStart) {
        this.startRun();
        return;
    }

    if (this.state === GameFlowState.TutorialPause) {
        this.resumeFromTutorialWithJump();
        return;
    }

    if (this.state === GameFlowState.Running) {
        this.playerJump?.jump();
        return;
    }
}


public onAabbEnter(self: AabbHitbox2D, other: AabbHitbox2D): void {
    if (this.state !== GameFlowState.Running) return;

    switch (other.kind) {
        case HitboxKind.Pickup:
            this.collectPickup(other.node);
            break;
        case HitboxKind.Damage:
            this.applyDamage();
            break;
        case HitboxKind.Trigger:
            this.pauseForTutorial('Tap to jump');
            break;
        case HitboxKind.Finish:
            this.win();
            break;
    }
}


    // private enterAwaitingStart(): void {
    //     this.state = GameFlowState.AwaitingStart;

    //     this.worldScroller?.setRunning(false);
    //     this.playerJump?.setEnabled(false);

    //     this.sessionCoins = 0;
    //     this.lives = 3;

    //     this.hud?.setCoins(0);
    //     this.hud?.setLives(this.lives);
    //     this.health?.resetToMax();
    //     this.hud?.setLives(this.health?.getLives() ?? 3);

    //     this.resultPanel?.hide();
    //     this.tutorialPanel?.show('Tap to start');
    // }


  private startRun(): void {
    this.state = GameFlowState.Running;

    this.audio?.playGameplayMusic();
    this.playerAnim?.playRun();

    this.tutorialPanel?.hide();
    this.playerJump?.setEnabled(true);
    this.worldScroller?.setRunning(true);
}


    private pauseForTutorial(text: string): void {
        this.state = GameFlowState.TutorialPause;
        this.playerAnim?.playIdle();

        this.worldScroller?.setRunning(false);
        this.tutorialPanel?.show(text);
    }

    private resumeFromTutorialWithJump(): void {
        this.state = GameFlowState.Running;
        this.tutorialPanel?.hide();
        this.worldScroller?.setRunning(true);
        this.playerAnim?.playRun();

        this.playerJump?.jump();

    }

    private collectPickup(pickupNode: any): void {
        const amount = this.hud?.rollPickupAmount(10, 20) ?? 10;
        this.sessionCoins += amount;
    this.audio?.playPickup();  
        this.hud?.playPickupFlyFx(pickupNode);
        this.hud?.addCoinsAnimated(amount);

        pickupNode?.destroy();
    }

    // private applyDamage(): void {
    //     this.lives = Math.max(0, this.lives - 1);
    //     this.hud?.setLives(this.lives);
    //     if (!this.health) return;

    //      const applied = this.health.tryApplyDamage(1);
    //      if (!applied) return;
    //     if (this.lives <= 0) {
    //         this.lose();
    //     }
    // }
private applyDamage(): void {
    if (!this.health) return;
    this.health.tryApplyDamage(1);
}

    public win(): void {
        if (this.state === GameFlowState.Won || this.state === GameFlowState.Lost) return;
        this.state = GameFlowState.Won;
this.confetti?.burst();

        this.worldScroller?.setRunning(false);
        this.playerJump?.setEnabled(false);
this.audio?.playWinMusic();
        this.resultPanel?.show(ResultVariant.Win, this.sessionCoins);
    }

    public lose(): void {
        if (this.state === GameFlowState.Won || this.state === GameFlowState.Lost) return;
        this.state = GameFlowState.Lost;
this.playerAnim?.playIdle();
this.audio?.playLoseMusic();
        this.worldScroller?.setRunning(false);
        this.playerJump?.setEnabled(false);

        this.resultPanel?.show(ResultVariant.Lose, this.sessionCoins);
    }
}
