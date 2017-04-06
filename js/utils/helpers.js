function setOrientationControls(e) {
    if (!e.alpha) {
        return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);

    if (renderer.domElement) {
        renderer.domElement.addEventListener('click', function () {

            if (this.requestFullscreen) {
                this.requestFullscreen();
            } else if (this.msRequestFullscreen) {
                this.msRequestFullscreen();
            } else if (this.mozRequestFullScreen) {
                this.mozRequestFullScreen();
            } else if (this.webkitRequestFullscreen) {
                this.webkitRequestFullscreen();
            }

        });

        renderer = new THREE.StereoEffect(renderer);
        renderer.setSize(window.innerWidth, window.innerHeight);

        mobile = true;

    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function getCubeMap(i) {
    var cubeMap = new THREE.Texture([]);
    cubeMap.format = THREE.RGBFormat;
    cubeMap.flipY = false;

    var envMaps = [
        {file: "sunset.jpg", size: 512},
        {file: "workshop_cube.jpg", size: 1024},
        {file: "Above_The_Sea.jpg", size: 1024},
        {file: "bluecloud.jpg", size: 1024},
        {file: "fog.jpg", size: 512},
        {file: "frozen.jpg", size: 512},
        {file: "op.jpg", size: 1024},
        {file: "shinyblue.jpg", size: 1024},
        {file: "skyboxsun25degtest.jpg", size: 1024},
        {file: "stormydays_large.jpg", size: 1024},
        {file: "violentdays_large.jpg", size: 1024},
        {file: "darkness.jpg", size: 1024},
    ];

    var loader = new THREE.ImageLoader();
    var pre = "assets/textures/";
    var file = pre + envMaps[i].file;
    var size = envMaps[i].size;
    loader.load(file, function (image) {
        var getSide = function (x, y) {

            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;

        };

        cubeMap.image[ 0 ] = getSide(2, 1); // px
        cubeMap.image[ 1 ] = getSide(0, 1); // nx
        cubeMap.image[ 2 ] = getSide(1, 0); // py
        cubeMap.image[ 3 ] = getSide(1, 2); // ny
        cubeMap.image[ 4 ] = getSide(1, 1); // pz
        cubeMap.image[ 5 ] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;

    });

    return cubeMap;
}

/*
 * 
 
 var geom = new THREE.Geometry()
 for (var i = 0; i < container.children.length; i++) {
 container.children[i].updateMatrix();
 geom.merge(container.children[i].geometry, container.children[i].matrix);
 }
 container = new THREE.Mesh(geom, mat);
 
 * 
 */

/*
 * 
 
 var cubeShader = THREE.ShaderLib['cube'];
 cubeShader.uniforms['tCube'].value = getCubeMap(10);
 
 var skyBoxMaterial = new THREE.ShaderMaterial({
 fragmentShader: cubeShader.fragmentShader,
 vertexShader: cubeShader.vertexShader,
 uniforms: cubeShader.uniforms,
 depthWrite: false,
 side: THREE.BackSide
 });
 
 var skyBox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100),skyBoxMaterial);
 
 scene.add(skyBox);
 
 *  
 */

/*
 * 
 
 var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
 hemiLight.color.setHSL( 0.6, 1, 0.6 );
 hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
 hemiLight.position.set( 0, 0, 0 );
 scene.add( hemiLight );
 
 * 
 */

/*
 * 
 
                var ambientLight = new THREE.AmbientLight(0x999999);
                scene.add(ambientLight);
 
 *  
 */

/*
 * 
var texture = new THREE.TextureLoader().load("textures/image2.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        
 *  
 */