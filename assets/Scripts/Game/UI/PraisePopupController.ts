import { _decorator, Component, Node, Label, UIOpacity, Vec3, tween } from 'cc';
import { TweenAnimations } from '../../Kit/tweens/TweenAnimations';

const { ccclass, property } = _decorator;

@ccclass('PraisePopupController')
export class PraisePopupController extends Component {
    @property({ type: Node })
    public root: Node | null = null;

    @property({ type: Label })
    public label: Label | null = null;

    @property
    public floatUpPixels = 70;

    @property
    public durationSeconds = 0.6;

    @property
    public startScale = 1;

    @property
    public endScale = 1.05;

    private basePos = new Vec3();
    private opacity: UIOpacity | null = null;

    onEnable(): void {
        const n = this.root ?? this.node;
        this.basePos.set(n.position);
        this.opacity = n.getComponent(UIOpacity) ?? n.addComponent(UIOpacity);
        n.active = false;
    }

    public show(text: string): void {
        const n = this.root ?? this.node;
        if (!this.label || !this.opacity) return;

        this.label.string = text;

        n.active = true;
        TweenAnimations.stopAll(n);

        n.setPosition(this.basePos);
        n.setScale(this.startScale, this.startScale, 1);
        this.opacity.opacity = 255;

        const up = new Vec3(this.basePos.x, this.basePos.y + this.floatUpPixels, this.basePos.z);

        // Два параллельных твина: движение/скейл и fade
        tween(n)
            .to(this.durationSeconds, { position: up, scale: new Vec3(this.endScale, this.endScale, 1) }, { easing: 'quadOut' as any })
            .call(() => { n.active = false; })
            .start();

        tween(this.opacity)
            .to(this.durationSeconds, { opacity: 0 }, { easing: 'quadIn' as any })
            .start();
    }
}
