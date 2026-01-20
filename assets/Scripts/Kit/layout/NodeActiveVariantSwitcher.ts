import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeActiveVariantSwitcher')
export class NodeActiveVariantSwitcher extends Component {
    @property({ type: Node })
    public portraitNode: Node | null = null;

    @property({ type: Node })
    public landscapeNode: Node | null = null;

    public setLandscapeMode(isLandscape: boolean): void {
        if (this.portraitNode) {
            this.portraitNode.active = !isLandscape;
        }
        if (this.landscapeNode) {
            this.landscapeNode.active = isLandscape;
        }
    }
}
