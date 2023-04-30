import * as THREE from 'three';

import { OutlineEffect } from 'OutlineEffect';
import { MMDLoader } from 'MMDLoader';
import { MMDAnimationHelper } from 'MMDAnimationHelper';
import{vowelConversion} from"./vowelConversion.js"


let renderer;
let scene;
let camera;
let clock;
let effect;
let ikHelper;
let physicsHelper;
let animationHelper;

let is_winkAnimation=false;
let is_eyelidElevation=false;
let is_mouthAnimation=false;
let mouth_morphTargetsNum;
let mesh;
let vowelMassage="";

let lastFrameTime = 0;

Ammo().then(function (AmmoLib) {
  Ammo = AmmoLib;
  initialSetting();
  MMDLoadSetting();
});


function initialSetting(){
  clock = new THREE.Clock();

  const canvas = document.getElementById("myCanvas");
  renderer = new THREE.WebGLRenderer({ canvas , antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  console.log(renderer)
  //renderer.setClearColor(0xcccccc, 0);
  scene = new THREE.Scene();
  effect = new OutlineEffect( renderer );
  
  animationHelper= new MMDAnimationHelper( {
    afterglow: 2.0
  } );

  let screenWidth;
  let screenHeight;
  
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  const screenAspect = screenWidth / screenHeight;
  camera = new THREE.PerspectiveCamera(45, screenAspect);
  
  camera.position.set(0,7.3,3);

  //let controls = new OrbitControls( camera, renderer.domElement );


  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 20, 15); // 光源の位置を設定
  light.castShadow = true;

  light.shadow.normalBias = 0.008;
  
  scene.add( light.target );
  scene.add(light);
  
  scene.add( new THREE.AmbientLight( 0xffffff, 0.6 ) );
  const lighthelper = new THREE.DirectionalLightHelper(light, 3);
  scene.add(lighthelper); // PointLightHelperをシーンに追加


}



function MMDLoadSetting(){
  const mmdLoader = new MMDLoader();
  mmdLoader.load(
    "static/MMD/avator1.pmx",
    function (mmd) {
       mesh = mmd;
       mesh.scale.copy( new THREE.Vector3( 1, 1, 1 ).multiplyScalar( 0.4 ) );
      console.log(mmd)
      for ( let i = 0; i < mesh.material.length; i ++ ) {
        mesh.material[ i ].emissive.multiplyScalar( 0.01 );
        mesh.material[ i ].userData.outlineParameters.thickness = 0.003;
      }
      animationHelper.add( mesh, {
        animation: mmd.animation,
        physics: true
      } );
      // 表情を適用する
          //if(mesh.geometry.morphTargets) {
            //mesh.morphTargetInfluences[97] = 1;
          //}
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(0,0,0);
      scene.add( mesh )
  
  
      ikHelper = animationHelper.objects.get( mesh ).ikSolver.createHelper();
      ikHelper.visible = false;
      scene.add( ikHelper );
  
      physicsHelper = animationHelper.objects.get( mesh ).physics.createHelper();
      physicsHelper.visible = false;
      scene.add( physicsHelper );
      setFlagWinkRandomime();
    }
  );
  animate();
}

function mmdWinkAnimation(){
  if(is_eyelidElevation==false){
    mesh.morphTargetInfluences[51]+=0.2;
    if(mesh.morphTargetInfluences[51]>=1){
      is_eyelidElevation=true;
    }
  }
  else {
    mesh.morphTargetInfluences[51]-=0.2;
    if(mesh.morphTargetInfluences[51]<=0){
      is_eyelidElevation=false;
      is_winkAnimation=false;
    }
  }
}

export function mmdMouthSetting(replyMassage){
  if(is_mouthAnimation==false){
    lastFrameTime=performance.now();
  }
  is_mouthAnimation=true;

  if(mesh == undefined){
    return;
  }

  if(mouth_morphTargetsNum){
      mesh.morphTargetInfluences[mouth_morphTargetsNum]=0;
  }

  if(vowelMassage.length==0){
    vowelMassage=vowelConversion(replyMassage);
  }

  mmdMouthShapeSelection(vowelMassage[0]);
  vowelMassage=vowelMassage.slice(1);

}

function mmdMouthShapeSelection(vowelChar){
  switch(vowelChar){
    case "あ":
      mouth_morphTargetsNum=133;
      break;
    case "い":
      mouth_morphTargetsNum=97;
      break;  
    case "う":
      mouth_morphTargetsNum=100;
      break;
    case "え":
      mouth_morphTargetsNum=103;
      break;
    case "お":
      mouth_morphTargetsNum=106;
      break;
    default:
      mouth_morphTargetsNum=133;
  }
}

function mmdMouthAnimation(elapsed){
  if(elapsed<=100){
    if(mesh.morphTargetInfluences[mouth_morphTargetsNum]>=1.0){
      return;
    }
    mesh.morphTargetInfluences[mouth_morphTargetsNum]+=0.2;
  }
  else if(elapsed>100 && elapsed<140){
    if(mesh.morphTargetInfluences[mouth_morphTargetsNum]<=0){
      return;
    }
    mesh.morphTargetInfluences[mouth_morphTargetsNum]-=0.2;
  }
  else if(elapsed>=140){
    is_mouthAnimation=false;
  }
}


function setFlagWinkRandomime() {
  const minInterval = 1000; 
  const maxInterval = 8000; 
  const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval);

  setTimeout(function() {
    if(is_winkAnimation==false){
      is_winkAnimation=true;
    }
    setFlagWinkRandomime();
  }, randomInterval);
}

const animate = function () {

  if(is_mouthAnimation==true){
    const elapsed =  performance.now() - lastFrameTime;
    if(mouth_morphTargetsNum){
      mmdMouthAnimation(elapsed);
    }
  }
  else if(vowelMassage.length>0){
    //口の開け方変化
    mmdMouthSetting(vowelMassage);
  }
  else if(mouth_morphTargetsNum&& vowelMassage.length==0){
      mesh.morphTargetInfluences[mouth_morphTargetsNum]=0;
  }

  animationHelper.update( clock.getDelta() );
  effect.render( scene, camera );
  if(mesh&&is_winkAnimation==true){
    mmdWinkAnimation();
  }
  requestAnimationFrame(animate);
};
