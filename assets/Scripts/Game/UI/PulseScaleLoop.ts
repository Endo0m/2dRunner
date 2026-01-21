import { _decorator, Component, Node, Tween } from 'cc';
import { TweenAnimations } from '../../Kit/tweens/TweenAnimations';

const { ccclass, property } = _decorator;

@ccclass('PulseScaleLoop')
export class PulseScaleLoop extends Component {

    @property
    public minScale = 0.95;

    @property
    public maxScale = 1.05;

    @property
    public halfPeriodSeconds = 0.4;

    @property
    public stopPrevious = true;

    private tween: Tween<Node> | null = null;

    onEnable(): void {
        this.startPulse();
    }

    onDisable(): void {
        this.stopPulse();
    }

    private startPulse(): void {
        this.tween = TweenAnimations.pulseScaleLoop(this.node, {
            minScale: this.minScale,
            maxScale: this.maxScale,
            halfPeriodSeconds: this.halfPeriodSeconds,
            stopPrevious: this.stopPrevious,
        });

        this.tween?.start();
    }

    private stopPulse(): void {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
    }
}
