import { _decorator, Component, Node, input, Input, EventTouch } from 'cc';
import { GameFlowController } from './GameFlowController';

const { ccclass, property } = _decorator;

@ccclass('TapInput')
export class TapInput extends Component {
    @property({ type: GameFlowController })
    public flow: GameFlowController | null = null;

    @property({ type: Node })
    public tapArea: Node | null = null;

    onEnable(): void {
        const target = this.tapArea ?? this.node;
        target.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDisable(): void {
        const target = this.tapArea ?? this.node;
        target.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(_e: EventTouch): void {
        this.flow?.onTap();
    }
}
