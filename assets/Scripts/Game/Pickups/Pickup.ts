import { _decorator, Component } from 'cc';
import { TweenAnimations } from '../../Kit/tweens/TweenAnimations';

const { ccclass, property } = _decorator;

@ccclass('Pickup')
export class Pickup extends Component {
    @property
    public halfPeriodSeconds = 0.35;
    @property
    public minScalefloat = 0.2;
    @property
    public maxScalefloat = 0.4;
    onEnable(): void {
        TweenAnimations.pulseScaleLoop(this.node, {
            halfPeriodSeconds: this.halfPeriodSeconds,
            minScale: this.minScalefloat,
            maxScale: this.maxScalefloat,
            easing: 'sineInOut',
            stopPrevious: true,
        }).start();
    }

    onDisable(): void {
        TweenAnimations.stopAll(this.node);
    }
}
