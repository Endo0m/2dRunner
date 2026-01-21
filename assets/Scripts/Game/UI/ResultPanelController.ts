import { _decorator, Component, Label, Node, Color, Sprite, tween } from 'cc';

const { ccclass, property } = _decorator;

export enum ResultVariant {
    Win = 1,
    Lose = 2,
}

@ccclass('ResultPanelController')
export class ResultPanelController extends Component {
    @property({ type: Node })
    public panelRoot: Node | null = null;

    @property({ type: Label })
    public titleLabel: Label | null = null;

    @property({ type: Label })
    public coinsLabel: Label | null = null;

    @property({ type: Sprite })
    public tintSprite: Sprite | null = null;

    @property
    public winTitle = 'You win';

    @property
    public loseTitle = 'You lose';

    @property
    public winTint: Color = new Color(120, 255, 160, 255);

    @property
    public loseTint: Color = new Color(255, 140, 140, 255);

    public hide(): void {
        (this.panelRoot ?? this.node).active = false;
    }

    public show(variant: ResultVariant, coins: number): void {
        (this.panelRoot ?? this.node).active = true;

        if (this.titleLabel) {
            this.titleLabel.string = variant === ResultVariant.Win ? this.winTitle : this.loseTitle;
        }

        if (this.tintSprite) {
            this.tintSprite.color = variant === ResultVariant.Win ? this.winTint : this.loseTint;
        }

        const target = Math.max(0, Math.floor(coins));
        const proxy = { v: 0 };

        if (this.coinsLabel) this.coinsLabel.string = `$0`;

        tween(proxy)
            .to(0.6, { v: target }, {
                easing: 'quadOut' as any,
                onUpdate: () => {
                    if (this.coinsLabel) this.coinsLabel.string = `$${Math.floor(proxy.v)}`;
                }
            })
            .start();
    }
}
