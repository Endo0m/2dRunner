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
import { EnemyStartTrigger } from '../Enemies/EnemyStartTrigger';
import { PraisePopupController } from '../UI/PraisePopupController';
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
@property({ type: PraisePopupController })
public praisePopup: PraisePopupController | null = null;
private pickupCount = 0;
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
    
    private sessionCoins = 0;

    onEnable(): void {
        this.collisionWorld?.setListener(this);
        
    this.resetToStart();
        this.health!.onLivesChanged = (lives) => this.hud?.setLives(lives);
        this.health!.onDied = () => this.lose();
this.health!.onDamaged = () => {
    this.playerAnim?.playHurt();
    this.audio?.playHurt();
    this.pickupCount = 0;
};


    }

    onDisable(): void {
        this.collisionWorld?.setListener(null);
    }
private resetToStart(): void {
    this.state = GameFlowState.AwaitingStart;

    this.sessionCoins = 0;

    this.worldScroller?.setRunning(false);
    this.playerJump?.setEnabled(false);

    this.hud?.setCoins(0);

    this.health?.resetToMax(); 

    this.resultPanel?.hide();
    this.tutorialPanel?.show('Tap to start');

    this.playerAnim?.playIdle();
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
        case HitboxKind.Enemy: {
            const trigger = other.node.getComponent(EnemyStartTrigger);
            trigger?.startEnemy();
            break;
}  
    }
}




private startRun(): void {
    this.state = GameFlowState.Running;

    this.audio?.playGameplayMusic();
    this.playerAnim?.playRun();

    this.tutorialPanel?.hide();

   
    this.playerJump?.setEnabled(false);

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

    this.playerJump?.setEnabled(true);

    
    this.playerJump?.jump();
}


   private collectPickup(pickupNode: any): void {
    const amount = this.hud?.rollPickupAmount(10, 20) ?? 10;
    this.sessionCoins += amount;

    this.audio?.playPickup();
    this.hud?.playPickupFlyFx(pickupNode);
    this.hud?.addCoinsAnimated(amount);

    this.pickupCount++;
    if ((this.pickupCount % 2) === 0) {
        this.praisePopup?.show(this.pickPraiseText());
    }

    pickupNode?.destroy();
}

private pickPraiseText(): string {
    
    const variants = ['Nice!', 'Great!', 'Awesome!', 'Perfect!', 'Cool!'];
    return variants[Math.floor(Math.random() * variants.length)];
}


  
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
