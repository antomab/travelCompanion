var TCDEMO = TCDEMO || {};
TCDEMO.AUDIO = {
    audioEndedEvent: 'audioController::audioStopped'
};

function AudioController () {
    var audioElement = $('#audio')[0];

    function getSrc(currentSrc, baseURI) {
        return currentSrc.replace(baseURI, '');
    }
    function setupEvents () {
        // announce when audio has finished
        audioElement.addEventListener('ended', function(event){
            $.event.trigger({
                type: TCDEMO.AUDIO.audioEndedEvent,
                audioSrc: getSrc(event.currentTarget.currentSrc, event.currentTarget.baseURI)
            });
        });
    };       

    function setAudioSrc (src) {
        audioElement.setAttribute('src', src);
    }

    function playAudioPromise () {
        var playPromise = audioElement.play();

        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
        if (playPromise !== undefined) {
          playPromise.then(function() {
            // Automatic playback started!
          }).catch(function(error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
          });
        }
    };

    function playAudio (src, withPause) {
        if (typeof(withPause) === 'undefined') withPause = false;

        if (src) {
            setAudioSrc(src);
        } 

        if (withPause) {
            // add a slight pause before each audio so it's not rushed
            // setTimeout(function () { audioElement.play() }, 2000);
            setTimeout(playAudioPromise, 2000);
        } else {
            //audioElement.play();
            playAudioPromise();
        }
    };

    function playAudioAtTime (src, time, withPause) {
        audioElement.currentTime = time;
        playAudio(src, withPause);
    }

    function pauseAudio () {
        audioElement.pause();
    };

    function stopAudio () {
        //audioElement.stop();
        audioElement.pause();
        audioElement.currentTime = 0;
    };

    function toggleAudio () {        
        if (audioElement.paused) {
            audioElement.play();
        } else {
            pauseAudio();
        }
    };

    function getCurrentPlaying() {
        return {
            audioSrc: getSrc(audioElement.currentSrc, audioElement.baseURI),
            currentTime: audioElement.currentTime
        }
    }

    return {
        setup: setupEvents,
        setAudioSource: setAudioSrc,
        play: playAudio,
        playAt: playAudioAtTime,
        pause: pauseAudio,
        stop: stopAudio,
        toggle: toggleAudio,
        getCurrent: getCurrentPlaying
    }
};
