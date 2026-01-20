import { _decorator, Component, screen, view } from 'cc';
const { ccclass } = _decorator;

type LayoutConsumer = { setLandscapeMode: (isLandscape: boolean) => void };

@ccclass('LayoutController')
export class LayoutController extends Component {
    private lastIsLandscape: boolean | null = null;
    private consumers: LayoutConsumer[] = [];

    onEnable(): void {
        screen.on('window-resize', this.apply, this);
        this.collectConsumers();
        this.apply();
    }

    onDisable(): void {
        screen.off('window-resize', this.apply, this);
        this.consumers.length = 0;
        this.lastIsLandscape = null;
    }

    private collectConsumers(): void {
        this.consumers.length = 0;

        const components = this.node.getComponentsInChildren(Component);
        for (let i = 0; i < components.length; i++) {
            const c: any = components[i];
            if (c && typeof c.setLandscapeMode === 'function') {
                this.consumers.push(c as LayoutConsumer);
            }
        }
    }

    private apply(): void {
        const visible = view.getVisibleSize();
        const isLandscape = visible.width >= visible.height;

        if (this.lastIsLandscape === isLandscape) {
            return;
        }

        this.lastIsLandscape = isLandscape;

        for (let i = 0; i < this.consumers.length; i++) {
            this.consumers[i].setLandscapeMode(isLandscape);
        }
    }
}
