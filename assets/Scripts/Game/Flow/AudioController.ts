import { _decorator, Component, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({ type: AudioSource })
    public musicSource: AudioSource | null = null;

    @property({ type: AudioSource })
    public sfxSource: AudioSource | null = null;
@property({ type: AudioClip })
public sfxPickup: AudioClip | null = null;

    @property({ type: AudioClip }) public musicGameplay: AudioClip | null = null;
    @property({ type: AudioClip }) public musicWin: AudioClip | null = null;
    @property({ type: AudioClip }) public musicLose: AudioClip | null = null;

    @property({ type: AudioClip }) public sfxJump: AudioClip | null = null;
    @property({ type: AudioClip }) public sfxHurt: AudioClip | null = null;

    public playGameplayMusic(): void {
        if (!this.musicSource || !this.musicGameplay) return;
        this.musicSource.stop();
        this.musicSource.clip = this.musicGameplay;
        this.musicSource.loop = true;
        this.musicSource.play();
    }

    public playWinMusic(): void {
        this.playOneShotMusic(this.musicWin);
    }
public playPickup(): void {
    if (this.sfxSource && this.sfxPickup) {
        this.sfxSource.playOneShot(this.sfxPickup);
    }
}

    public playLoseMusic(): void {
        this.playOneShotMusic(this.musicLose);
    }

    private playOneShotMusic(clip: AudioClip | null): void {
        if (!this.musicSource || !clip) return;
        this.musicSource.stop();
        this.musicSource.loop = false;
        this.musicSource.clip = clip;
        this.musicSource.play();
    }

    public playJump(): void {
        if (this.sfxSource && this.sfxJump) {
            this.sfxSource.playOneShot(this.sfxJump);
        }
    }

    public playHurt(): void {
        if (this.sfxSource && this.sfxHurt) {
            this.sfxSource.playOneShot(this.sfxHurt);
        }
    }
}
