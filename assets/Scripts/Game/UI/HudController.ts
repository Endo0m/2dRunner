import { _decorator, Component, Label, Node, Prefab, tween } from 'cc';
import { FxPresets } from '../../Kit/tweens/fx/FxPresets';

const { ccclass, property } = _decorator;

@ccclass('HudController')
export class HudController extends Component {
    @property({ type: Label })
    public coinLabel: Label | null = null;

    @property({ type: Node })
    public coinTargetNode: Node | null = null;

    @property({ type: Node })
    public fxLayer: Node | null = null;

    @property({ type: Prefab })
    public pickupFlyFxPrefab: Prefab | null = null;

    @property({ type: [Node] })
    public hearts: Node[] = [];

    private coins = 0;

    public setCoins(value: number): void {
        this.coins = Math.max(0, Math.floor(value));
        this.updateCoinText();
    }

    public addCoinsAnimated(delta: number): void {
        const from = this.coins;
        const to = Math.max(0, from + Math.floor(delta));

        this.coins = to;

        const proxy = { v: from };
        tween(proxy)
            .to(0.2, { v: to }, {
                easing: 'quadOut' as any,
                onUpdate: () => {
                    const rounded = Math.floor(proxy.v);
                    if (this.coinLabel) this.coinLabel.string = `$${rounded}`;
                }
            })
            .start();
    }

    public setLives(lives: number): void {
        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].active = i < lives;
        }
    }

    public rollPickupAmount(minInclusive: number, maxInclusive: number): number {
        const min = Math.floor(minInclusive);
        const max = Math.floor(maxInclusive);
        const r = min + Math.floor(Math.random() * (max - min + 1));
        return r;
    }

    public playPickupFlyFx(pickupNode: Node): void {
        if (!this.pickupFlyFxPrefab || !this.fxLayer || !this.coinTargetNode) return;

        FxPresets.flyToTarget({
            fxPrefab: this.pickupFlyFxPrefab,
            fxLayer: this.fxLayer,
            sourceWorldNode: pickupNode,
            targetWorldNode: this.coinTargetNode,
            copySpriteFromSource: true,
            flyDurationSeconds: 0.6,
            arcHeight: 140,
            rotateDegrees: 540,
            destroyOnComplete: true,
        });
    }

    private updateCoinText(): void {
        if (this.coinLabel) this.coinLabel.string = `$${this.coins}`;
    }
}
