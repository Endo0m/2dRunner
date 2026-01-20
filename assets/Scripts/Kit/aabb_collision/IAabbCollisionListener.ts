import { AabbHitbox2D } from './AabbHitbox2D';

export interface IAabbCollisionListener {
    onAabbEnter(self: AabbHitbox2D, other: AabbHitbox2D): void;
}
