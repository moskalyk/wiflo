
import React, { Component } from "react";


import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

var     r = 450,

				mouseY = 0,

				windowHalfY = window.innerHeight / 2,

				camera, scene, renderer;

		// 	init();
		// 	animate();
			


		// 	function init() {

		// 		camera = new THREE.PerspectiveCamera( 80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000 );
		// 		camera.position.z = 1000;

		// 		scene = new THREE.Scene();

		// 		var i, line, material, p,
		// 			parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ], [ 1, 0xffaa00, 0.5 ], [ 1.25, 0x000833, 0.8 ],
		// 					       [ 3.0, 0xaaaaaa, 0.75 ], [ 3.5, 0xffffff, 0.5 ], [ 4.5, 0xffffff, 0.25 ], [ 5.5, 0xffffff, 0.125 ]];

		// 		var geometry = createGeometry();

		// 		for ( i = 0; i < parameters.length; ++ i ) {

		// 			p = parameters[ i ];

		// 			material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ] } );

		// 			line = new THREE.LineSegments( geometry, material );
		// 			line.scale.x = line.scale.y = line.scale.z = p[ 0 ];
		// 			line.userData.originalScale = p[ 0 ];
		// 			line.rotation.y = Math.random() * Math.PI;
		// 			line.updateMatrix();
		// 			scene.add( line );

		// 		}

		// 		renderer = new THREE.WebGLRenderer( { antialias: true } );
		// 		renderer.setPixelRatio( window.devicePixelRatio );
		// 		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		// 		document.body.appendChild( renderer.domElement );

		// 		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		// 		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		// 		document.addEventListener( 'touchmove', onDocumentTouchMove, false );

		// 		//

		// 		window.addEventListener( 'resize', onWindowResize, false );

		// 		// test geometry swapability

		// 		setInterval( function () {

		// 			var geometry = createGeometry();

		// 			scene.traverse( function ( object ) {

		// 				if ( object.isLine ) {

		// 					object.geometry.dispose();
		// 					object.geometry = geometry;

		// 				}

		// 			} );

		// 		}, 1000 );

		// 	}

			function createGeometry(position = 0) {

				var geometry = new THREE.BufferGeometry();
				var vertices = [];
				// console.log(geometry)
				// geometry.position.x = 10
				// geometry.position.y = 20
				// geometry.position.z = 50

				var vertex = new THREE.Vector3();

				for ( var i = 0; i < 1200; i ++ ) {

					vertex.x = Math.random() * 2 - 1
					vertex.y = Math.random() * 2 - 1
					vertex.z = Math.random() * 2 - 1;
					vertex.normalize();
					vertex.multiplyScalar( r );
					

					vertices.push( vertex.x, vertex.y, vertex.z );

					vertex.multiplyScalar( Math.random() * 0.09 + 1 );

					vertices.push( vertex.x, vertex.y, vertex.z );

				}

				geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

				return geometry;

			}

		// 	function onWindowResize() {

		// 		windowHalfY = window.innerHeight / 2;

		// 		camera.aspect = window.innerWidth / window.innerHeight;
		// 		camera.updateProjectionMatrix();

		// 		renderer.setSize( window.innerWidth, window.innerHeight );

		// 	}

		// 	function onDocumentMouseMove( event ) {

		// 		mouseY = event.clientY - windowHalfY;

		// 	}

		// 	function onDocumentTouchStart( event ) {

		// 		if ( event.touches.length > 1 ) {

		// 			event.preventDefault();

		// 			mouseY = event.touches[ 0 ].pageY - windowHalfY;

		// 		}

		// 	}

		// 	function onDocumentTouchMove( event ) {

		// 		if ( event.touches.length == 1 ) {

		// 			event.preventDefault();

		// 			mouseY = event.touches[ 0 ].pageY - windowHalfY;

		// 		}

		// 	}

			//

		// 	function animate() {

		// 		requestAnimationFrame( animate );

		// 		render();

		// 	}

		// 	function render() {

		// 		camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
		// 		camera.lookAt( scene.position );

		// 		renderer.render( scene, camera );

		// 		var time = Date.now() * 0.0001;

		// 		for ( var i = 0; i < scene.children.length; i ++ ) {

		// 			var object = scene.children[ i ];

		// 			if ( object.isLine ) {

		// 				object.rotation.y = time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );

		// 				if ( i < 5 ) {

		// 					var scale = object.userData.originalScale * ( i / 5 + 1 ) * ( 1 + 0.5 * Math.sin( 7 * time ) );

		// 					object.scale.x = object.scale.y = object.scale.z = scale;

		// 				}

		// 			}

		// 		}

		// 	}
			
			
class Aura extends Component {

    componentDidMount() {
        this.sceneSetup();
        // this.addCustomSceneObjects();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
        this.forceUpdate()
        
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        // window.cancelAnimationFrame(this.requestID);
        // this.controls.dispose();
    }

    // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
    // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    sceneSetup = () => {
        // // get container dimensions and use them for scene sizing
        // const width = this.mount.clientWidth;
        // const height = this.mount.clientHeight;

        // this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color( 'white' );
        // this.camera = new THREE.PerspectiveCamera(
        //     75, // fov = field of view
        //     width / height, // aspect ratio
        //     0.1, // near plane
        //     1000 // far plane
        // );
        // this.camera.position.z = 9; // is used here to set some distance from a cube that is located at z = 0
        // // OrbitControls allow a camera to orbit around the object
        // // https://threejs.org/docs/#examples/controls/OrbitControls
        // this.controls = new OrbitControls( this.camera, this.mount );
        // this.renderer = new THREE.WebGLRenderer();
        // // this.renderer.setClearColorHex( 0x000000, 1 );
        // this.renderer.setSize( width, height );
        // this.mount.appendChild( this.renderer.domElement ); // mount using React ref
        
        this.camera = new THREE.PerspectiveCamera( 80, this.props.WIDTH / this.props.HEIGHT, 1, 3000 );
				this.camera.position.z = 1000;

				this.scene = new THREE.Scene();
  
        
    //     // aura #1
				// var i, line, material, p,
				// 	parameters = [[ 0.2, 0xff7700, 1 ]];
        
    //     var move = new THREE.Vector3( 100, 100, 100 );
        
				// var geometry = createGeometry(move);

				// for ( i = 0; i < parameters.length; ++ i ) {

				// 	p = parameters[ i ];

				// 	material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ] } );

				// 	line = new THREE.LineSegments( geometry, material );
				// 	line.scale.x = line.scale.y = line.scale.z = p[ 0 ];
				// 	line.userData.originalScale = p[ 0 ];
				// 	line.rotation.y = Math.random() * Math.PI;
				// 	line.updateMatrix();
					
					
				// // 	line.position(move)
				// 	this.scene.add( line );

				// }
				
				// // // aura #2
				
				// var i, line, material, p,
				// 	parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ], [ 1, 0xffaa00, 0.5 ], [ 1.25, 0x000833, 0.8 ]];
        var i, line, material, p, parameters = this.props.essence;
        
        
				var geometry = createGeometry();

				for ( i = 0; i < parameters.length; ++ i ) {

					p = parameters[ i ];

					material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ] } );

					line = new THREE.LineSegments( geometry, material );
					line.scale.x = line.scale.y = line.scale.z = p[ 0 ];
					line.userData.originalScale = p[ 0 ];
					line.rotation.y = Math.random() * Math.PI;
					line.updateMatrix();
					
					this.scene.add( line );

				}
				
				this.scene.background = new THREE.Color( 'white' );

				this.renderer = new THREE.WebGLRenderer( { antialias: true } );
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( this.props.WIDTH, this.props.HEIGHT );
				
				// TODO
				// document.body.appendChild( renderer.domElement );

				// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				// document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				// window.addEventListener( 'resize', onWindowResize, false );

				// test geometry swapability
				
				var self = this

				setInterval( function () {

					var geometry = createGeometry();

					self.scene.traverse( function ( object ) {

						if ( object.isLine ) {

							object.geometry.dispose();
							object.geometry = geometry;

						}

					} );

				}, 1000 );
				
				this.mount.appendChild( this.renderer.domElement ); // mount using React ref
    };

    // Here should come custom code.
    // Code below is taken from Three.js BoxGeometry example
    // https://threejs.org/docs/#api/en/geometries/BoxGeometry
    addCustomSceneObjects = () => {
        // const geometry = new THREE.BoxGeometry(2, 2, 2);
        
        // const material = new THREE.MeshPhongMaterial( {
        //     color: 0x156289,
        //     emissive: 0x072534,
        //     side: THREE.DoubleSide,
        //     flatShading: true
        // } );
        // this.cube = new THREE.Mesh( geometry, material );
        
        var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 'grey', wireframe: true} );
        var sphere = new THREE.Mesh( geometry, material );
        this.sphere = sphere
        this.scene.add( this.sphere );
        const lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        this.scene.add( lights[ 0 ] );
        this.scene.add( lights[ 1 ] );
        this.scene.add( lights[ 2 ] );
        
        
    };

    startAnimationLoop = () => {
      
      
        this.camera.position.y += ( - mouseY + 200 - this.camera.position.y ) * .05;
				this.camera.lookAt( this.scene.position );

				this.renderer.render( this.scene, this.camera );

				var time = Date.now() * 0.0001;

				for ( var i = 0; i < this.scene.children.length; i ++ ) {

					var object = this.scene.children[ i ];

					if ( object.isLine ) {

						object.rotation.y = time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );

						if ( i < 5 ) {

							var scale = object.userData.originalScale * ( i / 5 + 1 ) * ( 1 + 0.5 * Math.sin( 7 * time ) );

							object.scale.x = object.scale.y = object.scale.z = scale;

						}

					}

				}
				
			requestAnimationFrame( this.startAnimationLoop );
    };

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize( width, height );
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}

			
			
export default Aura;