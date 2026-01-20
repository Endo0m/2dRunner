import { Node, Prefab, UITransform, Vec3, tween, Tween, UIOpacity } from 'cc';
import { TweenAnimations } from '../TweenAnimations';
import { FxSpawn } from './FxSpawn';

export interface FlyToTargetOptions {
    fxPrefab: Prefab;
    fxLayer: Node;
    sourceWorldNode: Node;
    targetWorldNode: Node;

    copySpriteFromSource?: boolean;

    pop?: boolean;
    popUpSeconds?: number;
    popDownSeconds?: number;
    popUpScale?: number;
    popDownScale?: number;

    flyDurationSeconds?: number;
    arcHeight?: number;
    rotateDegrees?: number;
    startScale?: number;
    endScale?: number;

    destroyOnComplete?: boolean;
}
export interface PulseOptions {
    target: Node;
    halfPeriodSeconds?: number;
    minScale?: number;
    maxScale?: number;
    easing?: string;
}

export interface PopOnlyOptions {
    target: Node;
    durationSeconds?: number;
    fromScale?: number;
    toScale?: number;
    easing?: string;
}

export interface ShakeOnlyOptions {
    target: Node;
    durationSeconds?: number;
    strengthX?: number;
    strengthY?: number;
    vibrato?: number;
    damping?: number;
}

export interface FadeOnlyOptions {
    target: Node;
    to: number;
    durationSeconds?: number;
    from?: number;
    easing?: string;
}

export class FxPresets {
    /**
     * DOTween-style: one call = pop + fly-to-target + destroy.
     *
     * Use for: pickup->score, coin->counter, reward->slot, etc.
     */
    public static flyToTarget(options: FlyToTargetOptions): Node | null {
        const fxLayerTransform = options.fxLayer.getComponent(UITransform);
        if (!fxLayerTransform) {
            return null;
        }

        const fromLocal = fxLayerTransform.convertToNodeSpaceAR(options.sourceWorldNode.worldPosition);
        const toLocal = fxLayerTransform.convertToNodeSpaceAR(options.targetWorldNode.worldPosition);

        const fxNode = FxSpawn.spawn(options.fxPrefab, options.fxLayer);
        fxNode.setPosition(fromLocal);
        fxNode.setScale(1, 1, 1);

        const copySprite = options.copySpriteFromSource !== undefined ? options.copySpriteFromSource : true;
        if (copySprite) {
            FxSpawn.copySpriteAndSize(options.sourceWorldNode, fxNode);
        }

        const popEnabled = options.pop !== undefined ? options.pop : true;

        const popUpSeconds = options.popUpSeconds !== undefined ? options.popUpSeconds : 0.08;
        const popDownSeconds = options.popDownSeconds !== undefined ? options.popDownSeconds : 0.06;
        const popUpScale = options.popUpScale !== undefined ? options.popUpScale : 1.25;
        const popDownScale = options.popDownScale !== undefined ? options.popDownScale : 1.05;

        const flyDurationSeconds = options.flyDurationSeconds !== undefined ? options.flyDurationSeconds : 0.75;
        const arcHeight = options.arcHeight !== undefined ? options.arcHeight : 180;
        const rotateDegrees = options.rotateDegrees !== undefined ? options.rotateDegrees : 720;

        const startScale = options.startScale !== undefined ? options.startScale : (popEnabled ? popDownScale : 1.0);
        const endScale = options.endScale !== undefined ? options.endScale : 0.0;

        const destroyOnComplete = options.destroyOnComplete !== undefined ? options.destroyOnComplete : true;

        TweenAnimations.stopAll(fxNode);

        if (!popEnabled) {
            TweenAnimations.flyArcLocal(fxNode, fromLocal, toLocal, {
                durationSeconds: flyDurationSeconds,
                arcHeight: arcHeight,
                rotateDegrees: rotateDegrees,
                startScale: startScale,
                endScale: endScale,
                destroyOnComplete: destroyOnComplete,
                stopPrevious: false
            }).start();

            return fxNode;
        }

        const popUp = TweenAnimations.popScale(fxNode, {
            durationSeconds: popUpSeconds,
            fromScale: 1.0,
            toScale: popUpScale,
            easing: 'quadOut',
            stopPrevious: false
        });

        const popDown = TweenAnimations.popScale(fxNode, {
            durationSeconds: popDownSeconds,
            fromScale: popUpScale,
            toScale: popDownScale,
            easing: 'quadIn',
            stopPrevious: false
        });

        const fly = TweenAnimations.flyArcLocal(fxNode, fromLocal, toLocal, {
            durationSeconds: flyDurationSeconds,
            arcHeight: arcHeight,
            rotateDegrees: rotateDegrees,
            startScale: startScale,
            endScale: endScale,
            destroyOnComplete: destroyOnComplete,
            stopPrevious: false
        });

        tween(fxNode).sequence(
            popUp as unknown as Tween<Node>,
            popDown as unknown as Tween<Node>,
            fly as unknown as Tween<Node>
        ).start();

        return fxNode;
    }
public static pulseScale(options: PulseOptions): void {
    const halfPeriod = options.halfPeriodSeconds !== undefined ? options.halfPeriodSeconds : 0.35;

    TweenAnimations.pulseScaleLoop(options.target, {
        halfPeriodSeconds: halfPeriod,
        minScale: options.minScale,
        maxScale: options.maxScale,
        easing: options.easing !== undefined ? options.easing : 'sineInOut'
    }).start();
}

public static stopTweens(target: Node): void {
    TweenAnimations.stopAll(target);
}

    /** One-liner: pop on any node (buttons, icons, CTA). */
    public static pop(options: PopOnlyOptions): void {
        const duration = options.durationSeconds !== undefined ? options.durationSeconds : 0.12;
        const fromScale = options.fromScale !== undefined ? options.fromScale : 0.9;
        const toScale = options.toScale !== undefined ? options.toScale : 1.0;
        const easing = options.easing !== undefined ? options.easing : 'backOut';

        TweenAnimations.popScale(options.target, {
            durationSeconds: duration,
            fromScale: fromScale,
            toScale: toScale,
            easing: easing
        }).start();
    }

    /** One-liner: fail feedback shake. */
    public static shake(options: ShakeOnlyOptions): void {
        const duration = options.durationSeconds !== undefined ? options.durationSeconds : 0.18;

        TweenAnimations.shakePosition(options.target, {
            durationSeconds: duration,
            strengthX: options.strengthX,
            strengthY: options.strengthY,
            vibrato: options.vibrato,
            damping: options.damping
        }).start();
    }

    /** One-liner: punch rotation (UI life). */
    public static punchRotation(target: Node, degrees: number, durationSeconds?: number): void {
        const duration = durationSeconds !== undefined ? durationSeconds : 0.14;

        TweenAnimations.punchRotation(target, {
            durationSeconds: duration,
            degrees: degrees
        }).start();
    }

    /** One-liner: fade node to opacity (requires UIOpacity). */
    public static fade(options: FadeOnlyOptions): void {
        const duration = options.durationSeconds !== undefined ? options.durationSeconds : 0.2;
        const easing = options.easing !== undefined ? options.easing : 'quadOut';

        const t = TweenAnimations.fade(options.target, {
            durationSeconds: duration,
            from: options.from,
            to: options.to,
            easing: easing
        });

        if (t) {
            t.start();
        }
    }

    /** Ensure UIOpacity exists (helper for fade workflows). */
    public static ensureOpacity(target: Node): UIOpacity {
        let opacity = target.getComponent(UIOpacity);
        if (!opacity) {
            opacity = target.addComponent(UIOpacity);
        }
        return opacity;
    }
}
