export default class MusicController {
    constructor() {
        this.player = null;
    }

    setPlayer(player) {
        this.player = player;
    }

    playTheme() {
        this.player.playTrack("main");
    }

    playHurryTheme() {
        this.player.playTrack("hurry");
    }
}
