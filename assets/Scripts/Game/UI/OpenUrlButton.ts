import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpenUrlButton')
export class OpenUrlButton extends Component {
    @property
    public url = '';

    public open(): void {
        if (!this.url) return;

        
        window.open(this.url, '_blank');
    }
}
