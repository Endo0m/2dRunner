import { Node, Tween, tween, Vec3, UIOpacity } from 'cc';

export type TweenEasing = string | ((k: number) => number);


export interface PopOptions {
    durationSeconds: number;
    fromScale?: number;
    toScale?: number;
    easing?: TweenEasing;
    stopPrevious?: boolean;
}
export interface PulseScaleLoopOptions {
    halfPeriodSeconds: number;
    minScale?: number;
    maxScale?: number;
    easing?: TweenEasing;
    stopPrevious?: boolean;
}

export interface FadeOptions {
    durationSeconds: number;
    from?: number;
    to: number;
    easing?: TweenEasing;
    stopPrevious?: boolean;
}

export interface ShakeOptions {
    durationSeconds: number;
    strengthX?: number;
    strengthY?: number;
    vibrato?: number;
    damping?: number; // 0..1
    stopPrevious?: boolean;
    restoreOriginal?: boolean;
}

export interface PunchRotationOptions {
    durationSeconds: number;
    degrees: number;
    vibrato?: number;
    damping?: number; // 0..1
    stopPrevious?: boolean;
    restoreOriginal?: boolean;
}

export interface FlyArcOptions {
    durationSeconds: number;
    arcHeight: number;
    rotateDegrees?: number;
    startScale?: number;
    endScale?: number;
    moveEasing?: TweenEasing;
    scaleEasing?: TweenEasing;
    destroyOnComplete?: boolean;
    stopPrevious?: boolean;
}

export class TweenAnimations {
    public static stopAll(target: Node): void {
        Tween.stopAllByTarget(target);
    }

    public static popScale(target: Node, options: PopOptions): Tween<Node> {
        const stopPrevious = options.stopPrevious !== undefined ? options.stopPrevious : true;
        const fromScale = options.fromScale !== undefined ? options.fromScale : 0.9;
        const toScale = options.toScale !== undefined ? options.toScale : 1.0;
        const easing = options.easing !== undefined ? options.easing : 'backOut';

        if (stopPrevious) {
            this.stopAll(target);
        }

        target.setScale(fromScale, fromScale, 1);

        return tween(target).to(
            options.durationSeconds,
            { scale: new Vec3(toScale, toScale, 1) },
            { easing: easing as any }
        );
    }

    public static fade(target: Node, options: FadeOptions): Tween<UIOpacity> | null {
        const opacityComponent = target.getComponent(UIOpacity);
        if (!opacityComponent) {
            return null;
        }

        const stopPrevious = options.stopPrevious !== undefined ? options.stopPrevious : true;
        const easing = options.easing !== undefined ? options.easing : 'quadOut';
        const fromValue = options.from !== undefined ? options.from : opacityComponent.opacity;

        if (stopPrevious) {
            Tween.stopAllByTarget(opacityComponent);
        }

        opacityComponent.opacity = fromValue;

        return tween(opacityComponent).to(
            options.durationSeconds,
            { opacity: options.to },
            { easing: easing as any  }
        );
    }

    public static shakePosition(target: Node, options: ShakeOptions): Tween<Node> {
        const stopPrevious = options.stopPrevious !== undefined ? options.stopPrevious : true;
        const restoreOriginal = options.restoreOriginal !== undefined ? options.restoreOriginal : true;

        const duration = options.durationSeconds;
        const strengthX = options.strengthX !== undefined ? options.strengthX : 12;
        const strengthY = options.strengthY !== undefined ? options.strengthY : 12;
        const vibrato = Math.max(2, options.vibrato !== undefined ? options.vibrato : 10);
        const damping = this.clamp01(options.damping !== undefined ? options.damping : 0.65);

        if (stopPrevious) {
            this.stopAll(target);
        }

        const original = target.position.clone();

        const steps = vibrato;
        const stepDuration = duration / steps;

        const proxy = { i: 0 };
        const tmp = new Vec3();

        const sequence = tween(proxy);

        for (let step = 0; step < steps; step++) {
            sequence.to(stepDuration, { i: step + 1 }, {
                onUpdate: () => {
                    const t = proxy.i / steps;
                    const amp = 1 - (t * damping);

                    const rx = (Math.random() * 2 - 1) * strengthX * amp;
                    const ry = (Math.random() * 2 - 1) * strengthY * amp;

                    tmp.set(original.x + rx, original.y + ry, original.z);
                    target.setPosition(tmp);
                }
            });
        }

        if (restoreOriginal) {
            sequence.call(() => target.setPosition(original));
        }

        return sequence as unknown as Tween<Node>;
    }
public static pulseScaleLoop(target: Node, options: PulseScaleLoopOptions): Tween<Node> {
    const stopPrevious = options.stopPrevious !== undefined ? options.stopPrevious : true;

    const minScale = options.minScale !== undefined ? options.minScale : 0.95;
    const maxScale = options.maxScale !== undefined ? options.maxScale : 1.05;

    const halfPeriodSeconds = options.halfPeriodSeconds;
    const easing = options.easing !== undefined ? options.easing : 'sineInOut';

    if (stopPrevious) {
        this.stopAll(target);
    }

    target.setScale(minScale, minScale, 1);

    const up = tween(target).to(
        halfPeriodSeconds,
        { scale: new Vec3(maxScale, maxScale, 1) },
        { easing: easing as any }
    );

    const down = tween(target).to(
        halfPeriodSeconds,
        { scale: new Vec3(minScale, minScale, 1) },
        { easing: easing as any }
    );

    return tween(target).repeatForever(
        tween(target).sequence(
            up as unknown as Tween<Node>,
            down as unknown as Tween<Node>
        )
    );
}

    public static punchRotation(target: Node, options: PunchRotationOptions): Tween<Node> {
        const stopPrevious = options.stopPrevious !== undefined ? options.stopPrevious : true;
        const restoreOriginal = options.restoreOriginal !== undefined ? options.restoreOriginal : true;

        const duration = options.durationSeconds;
        const degrees = options.degrees;

        const vibrato = Math.max(2, options.vibrato !== undefined ? options.vibrato : 8);
        const damping = this.clamp01(options.damping !== undefined ? options.damping : 0.55);

        if (stopPrevious) {
            this.stopAll(target);
        }

        const originalAngle = target.angle;

        const steps = vibrato;
        const stepDuration = duration / steps;

        const proxy = { t: 0 };
        const sequence = tween(proxy);

        for (let step = 0; step < steps; step++) {
            sequence.to(stepDuration, { t: (step + 1) / steps }, {
                onUpdate: () => {
                    const p = proxy.t;
                    const amp = 1 - (p * damping);
                    const dir = (step % 2 === 0) ? 1 : -1;

                    target.angle = originalAngle + (degrees * amp * dir);
                }
            });
        }

        if (restoreOriginal) {
            sequence.call(() => { target.angle = originalAngle; });
        }

        return sequence as unknown as Tween<Node>;
    }

    /**
     * Fly from A to B along a quadratic Bezier arc in LOCAL space (UI-friendly).
     * Optional rotation + scaling + destroy-on-complete.
     */
    public static flyArcLocal(target: Node, fromLocal: Vec3, toLocal: Vec3, options: FlyArcOptions): Tween<Node> {
        const stopPrevious = options.stopPrevious !== undefined ? options.stopPrevious : true;

        const duration = options.durationSeconds;
        const arcHeight = options.arcHeight;

        const rotateDegrees = options.rotateDegrees !== undefined ? options.rotateDegrees : 0;
        const startScale = options.startScale !== undefined ? options.startScale : 1.0;
        const endScale = options.endScale !== undefined ? options.endScale : 0.0;

        const moveEasing = options.moveEasing !== undefined ? options.moveEasing : 'quadInOut';
        const scaleEasing = options.scaleEasing !== undefined ? options.scaleEasing : 'quadIn';

        const destroyOnComplete = options.destroyOnComplete !== undefined ? options.destroyOnComplete : false;

        if (stopPrevious) {
            this.stopAll(target);
        }

        target.setPosition(fromLocal);
        target.angle = 0;
        target.setScale(startScale, startScale, 1);

        const startX = fromLocal.x;
        const startY = fromLocal.y;

        const endX = toLocal.x;
        const endY = toLocal.y;

        const midX = (startX + endX) * 0.5;
        const midY = Math.max(startY, endY) + arcHeight;

        const positionProxy = { t: 0 };

        const tmp0 = new Vec3();
        const tmp1 = new Vec3();
        const tmp2 = new Vec3();
        const out = new Vec3();

        const moveTween = tween(positionProxy).to(duration, { t: 1 }, {
            easing: moveEasing as any,
            onUpdate: () => {
                const t = positionProxy.t;
                const u = 1 - t;

                const uu = u * u;
                const ut2 = 2 * u * t;
                const tt = t * t;

                tmp0.set(startX * uu, startY * uu, 0);
                tmp1.set(midX * ut2, midY * ut2, 0);
                tmp2.set(endX * tt, endY * tt, 0);

                out.set(tmp0.x + tmp1.x + tmp2.x, tmp0.y + tmp1.y + tmp2.y, 0);
                target.setPosition(out);
            }
        });

        const scaleTween = tween(target).to(
            duration,
            { scale: new Vec3(endScale, endScale, 1) },
            { easing: scaleEasing as any }
        );

        const rotateTween = rotateDegrees !== 0
            ? tween(target).by(duration, { angle: rotateDegrees })
            : tween(target);

        const combined = tween(target).parallel(
            moveTween as unknown as Tween<Node>,
            scaleTween,
            rotateTween
        );

        if (destroyOnComplete) {
            combined.call(() => target.destroy());
        }

        return combined;
    }

    private static clamp01(value: number): number {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }
}
