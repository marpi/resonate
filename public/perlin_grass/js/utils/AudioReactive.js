(function () {
    
    // based on Odeo by @theSpite https://github.com/spite/codevember-2016/blob/master/js/Odeo.js

    var AudioContext = window.AudioContext || window.webkitAudioContext;

    function AudioReactiveMediaPlayer(audio) {

        this.element = document.createElement('audio');
        this.element.controls = 'controls';
        this.element.style.position = "absolute";
        this.element.style.bottom = "0";
        this.element.style.width = "300px";
        this.element.style.left = window.innerWidth / 2 - 300 / 2 + "px";
        document.body.appendChild(this.element);
        audio.element = this.element
        this.audio = audio;

        window.addEventListener("resize", onResize)
    }

    function onResize() {
        if (this.audio.element)
            this.audio.element.style.left = window.innerWidth / 2 - 300 / 2 + "px";
    }

    AudioReactiveMediaPlayer.prototype.play = function (src) {

        if (typeof src === 'string') {
            this.element.src = src;
            if (this.element.canPlayType('audio/mpeg;')) {
                //this.element.type = 'audio/mpeg';
                this.element.src = src+'.mp3';
            } else {
                //this.element.type = 'audio/ogg';
                this.element.src = src+'.ogg';
            }
            this.element.play();
            this.audioSource = this.audio.context.createMediaElementSource(this.element);
        } else {
            this.audioSource = this.audio.context.createMediaElementSource(src);
        }
        this.audioSource.connect(this.audio.analyser);
        this.audioSource.connect(this.audio.context.destination);

    }

    function AudioReactiveMicrophone(audio) {

        this.microphone = null;
        this.audio = audio;

    }

    AudioReactiveMicrophone.prototype.play = function () {

        if (navigator.getUserMedia) {

            navigator.getUserMedia({audio: true}, function (stream) {

                this.microphone = this.audio.context.createMediaStreamSource(stream);
                this.microphone.connect(this.audio.analyser);

            }.bind(this),
                    function () {

                    });

        } else if (navigator.mediaDevices) {

            navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {

                this.microphone = this.audio.context.createMediaStreamSource(stream);
                this.microphone.connect(this.audio.analyser);

            }.bind(this)).catch(function (err) {
            });
        }

    }

    AudioReactiveMicrophone.prototype.stop = function () {

        this.microphone.disconnect(this.audio.analyser);

    }

    function AudioReactive(opts) {

        this.options = opts || {};

        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.options.fftSize || 256;
        this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);

        this.microphone = null;
        this.media = null;

    }

    AudioReactive.prototype.playMedia = function (src) {

        if (!this.media)
            this.media = new AudioReactiveMediaPlayer(this);
        this.media.play(src);

    }

    AudioReactive.prototype.useMicrophone = function () {

        if (!this.microphone)
            this.microphone = new AudioReactiveMicrophone(this);
        this.microphone.play();

    }

    AudioReactive.prototype.stopUsingMicrophone = function () {

        if (!this.microphone)
            return;
        this.microphone.stop();

    }

    AudioReactive.prototype.update = function () {
        this.analyser.getByteFrequencyData(this.frequencies);
    }

    window.AudioReactive = AudioReactive;

})();