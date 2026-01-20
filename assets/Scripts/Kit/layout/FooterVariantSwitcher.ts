import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FooterVariantSwitcher')
export class FooterVariantSwitcher extends Component {
    @property({ type: Sprite })
    public targetSprite: Sprite | null = null;

    @property({ type: SpriteFrame })
    public portraitFrame: SpriteFrame | null = null;

    @property({ type: SpriteFrame })
    public landscapeFrame: SpriteFrame | null = null;

    public setLandscapeMode(isLandscape: boolean): void {
        if (!this.targetSprite) return;

        const frame = isLandscape ? this.landscapeFrame : this.portraitFrame;
        if (frame && this.targetSprite.spriteFrame !== frame) {
            this.targetSprite.spriteFrame = frame;
        }
    }
}
