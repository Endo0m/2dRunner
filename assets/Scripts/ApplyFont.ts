import { _decorator, Component, Label, Font } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ApplyFont')
export class ApplyFont extends Component {
  @property(Label)
  public label: Label | null = null;

  @property(Font)
  public font: Font | null = null;

  start() {
    if (this.label && this.font) {
      this.label.font = this.font;
      this.label.string = this.label.string;
    }
  }
}
