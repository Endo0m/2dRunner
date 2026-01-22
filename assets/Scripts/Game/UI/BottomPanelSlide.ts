import { _decorator, Component, Node, tween, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BottomPanelSlide')
export class BottomPanelSlide extends Component {
    @property({ type: Node })
    public panelNode: Node | null = null;

    @property
    public durationSeconds = 0.35;

    @property
    public closedExtraMargin = 40;

    @property
    public openY = 0;

    @property
    public useAutoClosedY = true;

    private isOpen = false;
    private isAnimating = false;
    private closedY = 0;

    onEnable(): void {
        const panel = this.panelNode ?? this.node;
        this.recalculateClosedY(panel);
        this.applyInstant(false);
    }

    public open(): void {
        this.setOpen(true);
    }

    public close(): void {
        this.setOpen(false);
    }

    public toggle(): void {
        this.setOpen(!this.isOpen);
    }

    public setOpen(value: boolean): void {
        if (this.isAnimating) return;
        if (this.isOpen === value) return;

        const panel = this.panelNode ?? this.node;
        this.recalculateClosedY(panel);

        this.isOpen = value;
        this.isAnimating = true;

        const targetY = value ? this.openY : this.closedY;
        const p = panel.position;

        tween(panel)
            .to(this.durationSeconds, { position: new Vec3(p.x, targetY, p.z) }, { easing: 'quadOut' as any })
            .call(() => { this.isAnimating = false; })
            .start();
    }

    private applyInstant(open: boolean): void {
        const panel = this.panelNode ?? this.node;
        this.isOpen = open;

        this.recalculateClosedY(panel);

        const y = open ? this.openY : this.closedY;
        const p = panel.position;
        panel.setPosition(p.x, y, p.z);
    }

    private recalculateClosedY(panel: Node): void {
        if (!this.useAutoClosedY) return;

        const ui = panel.getComponent(UITransform);
        const height = ui ? ui.contentSize.height : 0;

        
        this.closedY = this.openY - height - this.closedExtraMargin;
    }
}
