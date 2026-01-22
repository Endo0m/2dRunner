import { _decorator, Component, Camera, view, Vec3, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScreenVisibilityActivator')
export class ScreenVisibilityActivator extends Component {
    @property({ type: Camera })
    public camera: Camera | null = null;
    public paused = false;
    @property({ type: Component })
    public targetComponent: Component | null = null;

    @property
    public marginPixels = 80;

    private readonly tmp = new Vec3();
update(): void {
    if (this.paused) {
        if (this.targetComponent) {
            this.targetComponent.enabled = false;
        }
        return;
    }

    if (!this.camera || !this.targetComponent) return;

    this.tmp.set(this.node.worldPosition);
    const sp = this.camera.worldToScreen(this.tmp);

    const size = view.getVisibleSize();
    const m = this.marginPixels;

    const visible =
        sp.x >= -m && sp.x <= size.width + m &&
        sp.y >= -m && sp.y <= size.height + m;

    this.targetComponent.enabled = visible;
}

}
