import { _decorator, Component, Node, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TutorialPanelController')
export class TutorialPanelController extends Component {
    @property({ type: Node })
    public panelRoot: Node | null = null;

    @property({ type: Label })
    public textLabel: Label | null = null;

    public show(text: string): void {
        if (this.textLabel) this.textLabel.string = text;
        (this.panelRoot ?? this.node).active = true;
    }

    public hide(): void {
        (this.panelRoot ?? this.node).active = false;
    }
}
