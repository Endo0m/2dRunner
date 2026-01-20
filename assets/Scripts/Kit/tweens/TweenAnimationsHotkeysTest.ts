import { _decorator, Component, input, Input, EventKeyboard, KeyCode, Node, Prefab } from 'cc';
import { FxPresets } from './fx/FxPresets';

const { ccclass, property } = _decorator;

@ccclass('FxKitHotkeysTest')
export class FxKitHotkeysTest extends Component {
    @property({ type: Node })
    public targetNode: Node | null = null;

    @property({ type: Node })
    public fxLayer: Node | null = null;

    @property({ type: Node })
    public fromNode: Node | null = null;

    @property({ type: Node })
    public toNode: Node | null = null;

    @property({ type: Prefab })
    public fxPrefab: Prefab | null = null;

    onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        if (this.targetNode) {
            FxPresets.ensureOpacity(this.targetNode);
        }
    }

    onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            // Q: pop (button/icon)
            case KeyCode.KEY_Q:
                this.requireTarget();
                FxPresets.pop({
                    target: this.targetNode!,
                    durationSeconds: 0.12,
                    fromScale: 0.9,
                    toScale: 1.0,
                    easing: 'backOut'
                });
                break;

            // W: pop CTA style (bigger)
            case KeyCode.KEY_W:
                this.requireTarget();
                FxPresets.pop({
                    target: this.targetNode!,
                    durationSeconds: 0.10,
                    fromScale: 0.85,
                    toScale: 1.1,
                    easing: 'backOut'
                });
                break;

            // E: fade in
            case KeyCode.KEY_E:
                this.requireTarget();
                FxPresets.ensureOpacity(this.targetNode!);
                FxPresets.fade({
                    target: this.targetNode!,
                    from: 0,
                    to: 255,
                    durationSeconds: 0.2,
                    easing: 'quadOut'
                });
                break;

            // R: fade out
            case KeyCode.KEY_R:
                this.requireTarget();
                FxPresets.ensureOpacity(this.targetNode!);
                FxPresets.fade({
                    target: this.targetNode!,
                    from: 255,
                    to: 0,
                    durationSeconds: 0.2,
                    easing: 'quadIn'
                });
                break;

            // T: shake (fail feedback)
            case KeyCode.KEY_T:
                this.requireTarget();
                FxPresets.shake({
                    target: this.targetNode!,
                    durationSeconds: 0.18,
                    strengthX: 14,
                    strengthY: 10,
                    vibrato: 10,
                    damping: 0.7
                });
                break;

            // Y: punch rotation
            case KeyCode.KEY_Y:
                this.requireTarget();
                FxPresets.punchRotation(this.targetNode!, 10, 0.14);
                break;

            // U: pulse loop start (idle/CTA)
            case KeyCode.KEY_U:
                this.requireTarget();
                FxPresets.pulseScale({
                    target: this.targetNode!,
                    halfPeriodSeconds: 0.35,
                    minScale: 0.97,
                    maxScale: 1.06,
                    easing: 'sineInOut'
                });
                break;

            // I: stop tweens on target (stop pulse, stop anything)
            case KeyCode.KEY_I:
                this.requireTarget();
                FxPresets.stopTweens(this.targetNode!);
                break;

            // O: flyToTarget (one-liner pickup->score)
            case KeyCode.KEY_O:
                this.requireFlyRefs();
                FxPresets.flyToTarget({
                    fxPrefab: this.fxPrefab!,
                    fxLayer: this.fxLayer!,
                    sourceWorldNode: this.fromNode!,
                    targetWorldNode: this.toNode!,
                    pop: true,
                    flyDurationSeconds: 0.75,
                    arcHeight: 180,
                    rotateDegrees: 720,
                    destroyOnComplete: true
                });
                break;

            // P: flyToTarget (no pop, faster)
            case KeyCode.KEY_P:
                this.requireFlyRefs();
                FxPresets.flyToTarget({
                    fxPrefab: this.fxPrefab!,
                    fxLayer: this.fxLayer!,
                    sourceWorldNode: this.fromNode!,
                    targetWorldNode: this.toNode!,
                    pop: false,
                    flyDurationSeconds: 0.55,
                    arcHeight: 140,
                    rotateDegrees: 0,
                    destroyOnComplete: true
                });
                break;
        }
    }

    private requireTarget(): void {
        if (!this.targetNode) {
            throw new Error('FxKitHotkeysTest: targetNode is not assigned');
        }
    }

    private requireFlyRefs(): void {
        if (!this.fxLayer || !this.fromNode || !this.toNode || !this.fxPrefab) {
            throw new Error('FxKitHotkeysTest: fxLayer/fromNode/toNode/fxPrefab must be assigned');
        }
    }
}
