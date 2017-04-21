// /ËˆÃ´dÄ“ËŒÅ/

(function () {

    var AudioContext = window.AudioContext || window.webkitAudioContext;

    function OdeoSoundCloudPlayer(id, odeo) {

        this.id = id;
        this.odeo = odeo;

        SC.initialize({
            client_id: this.id
        });

        this.audio = document.createElement('audio');
        this.audio.loop = true;
        this.audio.autoplay = true;
        this.audio.crossOrigin = '';

        this.songSource = this.odeo.context.createMediaElementSource(this.audio);
        this.songSource.connect(this.odeo.analyser);
        this.songSource.connect(this.odeo.context.destination);

    }

    OdeoSoundCloudPlayer.prototype.getSong = function (songURL) {

        this.audio.play();

        SC.resolve(songURL).then(function (song) {

            console.log(song);
            //songInfo.innerHTML = '<p><b><a href="' + song.permalink_url + '" >' + song.title + '</a> <a href="#" id="pauseBtn" >PAUSE</a></b><br/><a href="' + song.user.permalink_url + '">' + song.user.username + '</a></p>'

            this.audio.src = song.stream_url + "?client_id=" + this.id;

            this.songSource.connect(this.odeo.analyser);
            this.songSource.connect(this.odeo.context.destination);

        }.bind(this));

    }

    OdeoSoundCloudPlayer.prototype.stop = function () {

        this.audio.pause();

    }

    function OdeoMediaPlayer(odeo) {

        this.audioElement = document.createElement('audio');
        this.audioElement.controls = 'controls';
        this.audioElement.style.position = "absolute";
        this.audioElement.style.bottom = "0";
        this.audioElement.style.width = "300px";
        this.audioElement.style.left = window.innerWidth / 2 - 300 / 2 + "px";
        document.body.appendChild(this.audioElement);
        odeo.audioElement = this.audioElement
        this.odeo = odeo;

        window.addEventListener("resize", onResize)
    }

    function onResize() {
        if (this.odeo.audioElement)
            this.odeo.audioElement.style.left = window.innerWidth / 2 - 300 / 2 + "px";

    }

    OdeoMediaPlayer.prototype.play = function (src) {

        if (typeof src === 'string') {
            this.audioElement.src = src;
            if (this.audioElement.canPlayType('audio/mpeg;')) {
                //this.audioElement.type = 'audio/mpeg';
                this.audioElement.src = src+'.mp3';
            } else {
                //this.audioElement.type = 'audio/ogg';
                this.audioElement.src = src+'.ogg';
            }
            this.audioElement.play();
            this.audioSource = this.odeo.context.createMediaElementSource(this.audioElement);
        } else {
            this.audioSource = this.odeo.context.createMediaElementSource(src);
        }
        this.audioSource.connect(this.odeo.analyser);
        this.audioSource.connect(this.odeo.context.destination);

    }

    function OdeoMicrophone(odeo) {

        this.microphone = null;
        this.odeo = odeo;

    }

    OdeoMicrophone.prototype.play = function () {

        if (navigator.getUserMedia) {

            navigator.getUserMedia({audio: true}, function (stream) {

                this.microphone = this.odeo.context.createMediaStreamSource(stream);
                this.microphone.connect(this.odeo.analyser);

            }.bind(this),
                    function () {

                    });

        } else if (navigator.mediaDevices) {

            navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {

                this.microphone = this.odeo.context.createMediaStreamSource(stream);
                this.microphone.connect(this.odeo.analyser);

            }.bind(this)).catch(function (err) {
            });
        }

    }

    OdeoMicrophone.prototype.stop = function () {

        this.microphone.disconnect(this.odeo.analyser);

    }

    function Odeo(opts) {

        this.options = opts || {};

        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.options.fftSize || 256;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        this.spectrumTexture = null;

        this.soundCloudPlayer = null;
        this.microphone = null;
        this.media = null;

    }

    Odeo.prototype.playMedia = function (src) {

        if (!this.media)
            this.media = new OdeoMediaPlayer(this);
        this.media.play(src);

    }

    Odeo.prototype.useMicrophone = function () {

        if (!this.microphone)
            this.microphone = new OdeoMicrophone(this);
        this.microphone.play();

    }

    Odeo.prototype.stopUsingMicrophone = function () {

        if (!this.microphone)
            return;
        this.microphone.stop();

    }

    Odeo.prototype.playSoundCloud = function (url) {

        if (!this.soundCloudPlayer)
            this.soundCloudPlayer = new OdeoSoundCloudPlayer(this.options.soundCloudId, this);
        this.soundCloudPlayer.getSong(url);

    }

    Odeo.prototype.stopSoundCloud = function (url) {

        if (!this.soundCloudPlayer)
            return;
        this.soundCloudPlayer.stop();

    }

    Odeo.prototype.getSpectrumTexture = function () {

        this.spectrumTexture = new THREE.DataTexture(this.frequencyData, 1 * this.frequencyData.length, 1, THREE.LuminanceFormat);
        this.spectrumTexture.minFilter = THREE.NearestFilter;
        this.spectrumTexture.magFilter = THREE.NearestFilter;
        this.spectrumTexture.needsUpdate = true;

        return this.spectrumTexture;

    }

    Odeo.prototype.update = function () {
        this.analyser.getByteFrequencyData(this.frequencyData);
        if (this.spectrumTexture)
            this.spectrumTexture.needsUpdate = true;
    }

    window.Odeo = Odeo;

})();