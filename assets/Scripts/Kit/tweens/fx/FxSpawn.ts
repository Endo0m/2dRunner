import { Node, Prefab, instantiate, Sprite, UITransform } from 'cc';

export class FxSpawn {
    public static spawn(prefab: Prefab, parent: Node): Node {
        const node = instantiate(prefab);
        node.setParent(parent);
        return node;
    }

    public static copySpriteAndSize(fromNode: Node, toNode: Node): void {
        const fromSprite = fromNode.getComponent(Sprite);
        const toSprite = toNode.getComponent(Sprite);

        if (fromSprite && toSprite) {
            toSprite.spriteFrame = fromSprite.spriteFrame;
            toSprite.sizeMode = fromSprite.sizeMode;
        }

        const fromUi = fromNode.getComponent(UITransform);
        const toUi = toNode.getComponent(UITransform);

        if (fromUi && toUi) {
            toUi.setContentSize(fromUi.contentSize);
        }
    }
}
