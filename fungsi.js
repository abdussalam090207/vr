document.addEventListener('DOMContentLoaded', function () {
    const leftVideo = document.getElementById('left-video');
    const rightVideo = document.getElementById('right-video');
    const switchCameraBtn = document.getElementById('switch-camera');
    const toggleFullscreenBtn = document.getElementById('toggle-fullscreen');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const retryBtn = document.getElementById('retry');

    let currentStream = null;
    let usingFrontCamera = true;

    // Fungsi untuk menghentikan stream kamera
    function stopMediaTracks(stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // Fungsi untuk mendapatkan stream kamera
    async function getCameraStream(frontCamera = true) {
        // Hentikan stream yang sedang berjalan
        if (currentStream) {
            stopMediaTracks(currentStream);
        }

        const constraints = {
            video: {
                facingMode: frontCamera ? 'user' : 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            currentStream = stream;

            // Set stream ke kedua elemen video
            leftVideo.srcObject = stream;
            rightVideo.srcObject = stream;

            // Sembunyikan loading, tampilkan video
            loadingElement.classList.add('hidden');
            errorElement.classList.add('hidden');

            return stream;
        } catch (error) {
            console.error('Error mengakses kamera:', error);
            loadingElement.classList.add('hidden');
            errorElement.classList.remove('hidden');
            return null;
        }
    }

    // Fungsi untuk mengganti kamera
    async function switchCamera() {
        usingFrontCamera = !usingFrontCamera;
        await getCameraStream(usingFrontCamera);
    }

    // Fungsi untuk toggle fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Event listeners
    switchCameraBtn.addEventListener('click', switchCamera);
    toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
    retryBtn.addEventListener('click', () => {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        getCameraStream(usingFrontCamera);
    });

    // Event listener untuk orientasi layar
    window.addEventListener('orientationchange', function () {
        // Beri waktu untuk orientasi berubah sebelum menyesuaikan
        setTimeout(() => {
            // Di sini kita bisa menambahkan logika untuk menyesuaikan tampilan
            // berdasarkan orientasi jika diperlukan
        }, 300);
    });

    // Mulai dengan kamera depan
    getCameraStream(true);
});