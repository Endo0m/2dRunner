import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TransformVariantSwitcher')
export class TransformVariantSwitcher extends Component {
    @property({ type: Vec3 })
    public portraitPosition: Vec3 = new Vec3();

    @property({ type: Vec3 })
    public landscapePosition: Vec3 = new Vec3();

    @property({ type: Vec3 })
    public portraitScale: Vec3 = new Vec3(1, 1, 1);

    @property({ type: Vec3 })
    public landscapeScale: Vec3 = new Vec3(1, 1, 1);

    @property
    public portraitAngle = 0;

    @property
    public landscapeAngle = 0;

    public setLandscapeMode(isLandscape: boolean): void {
        if (isLandscape) {
            this.node.setPosition(this.landscapePosition);
            this.node.setScale(this.landscapeScale);
            this.node.angle = this.landscapeAngle;
        } else {
            this.node.setPosition(this.portraitPosition);
            this.node.setScale(this.portraitScale);
            this.node.angle = this.portraitAngle;
        }
    }
}
