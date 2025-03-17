import * as THREE from "three";
// make sure types work with the patched GLTF loader
import {
  GLTFLoader as TrueGLTFLoader,
  type GLTF,
} from "three/addons/loaders/GLTFLoader.js";
// very hacky but it works to fix the shader bug...
import { GLTFLoader } from "./3d/Custom_GLTFLoader";
import CameraControls from "camera-controls";
import Mii from "../external/mii-js/mii";
import {
  MiiFavoriteColorLookupTable,
  MiiFavoriteColorVec3Table,
  MiiSwitchSkinColorSRGB,
  MiiSwitchSkinColorLinear,
  SwitchMiiColorTableLinear,
  SwitchMiiColorTableSRGB,
} from "../constants/ColorTables";
import {
  cMaterialName,
  cPantsColorGold,
  cPantsColorGoldLinear,
  cPantsColorGray,
  cPantsColorGrayLinear,
  cPantsColorRed,
  cPantsColorRedLinear,
  MiiFavoriteFFLColorLookupTable,
} from "./3d/shader/fflShaderConst";
import { RenderPart } from "./MiiEditor";
import { Config } from "../config";
import { getSoundManager } from "./audio/SoundManager";
import { SparkleParticle } from "./3d/effect/SparkleParticle";
import { multiplyTexture } from "./3d/canvas/multiplyTexture";
import { HatType, HatTypeList } from "../constants/Extensions";
import localforage from "localforage";
import { traverseAddShader, traverseMesh } from "./3d/shader/ShaderUtils";
import { getSetting } from "../util/SettingsHelper";
import { ShaderType } from "../constants/BodyShaderTypes";
import { getHeadModel } from "../util/MiiRendering";

export enum CameraPosition {
  MiiHead,
  MiiFullBody,
}
export enum SetupType {
  Normal,
  Screenshot,
}

export class Mii3DScene {
  #camera: THREE.PerspectiveCamera;
  #controls: CameraControls;
  #textureLoader: THREE.TextureLoader;
  #gltfLoader!: TrueGLTFLoader;
  #scene: THREE.Scene;
  #renderer: THREE.WebGLRenderer;
  #parent: HTMLElement;
  mii: Mii;
  ready: boolean;
  headReady: boolean;
  mixer!: THREE.AnimationMixer;
  animators: Map<string, (n: number, f: number) => any>;
  animations: Map<string, THREE.AnimationClip>;
  setupType: SetupType;
  #initCallback?: (renderer: THREE.WebGLRenderer) => any;
  type: "m" | "f";
  cameraPan!: boolean;
  shaderOverride: boolean;
  bodyModel!: string;
  handColor!: [number, number, number];
  shaderType!: ShaderType;
  simpleShaderLegacyColors!: boolean;

  constructor(
    mii: Mii,
    parent: HTMLElement,
    setupType: SetupType = SetupType.Normal,
    initCallback?: (renderer: THREE.WebGLRenderer) => any,
    // shaderOverride uses MeshStandardMaterial
    shaderOverride: boolean = false
  ) {
    this.animations = new Map();
    this.animators = new Map();
    this.anim = new Map();
    this.#parent = parent;
    this.#scene = new THREE.Scene();
    this.#camera = new THREE.PerspectiveCamera(
      45,
      parent.offsetWidth / parent.offsetHeight,
      0.1,
      1000
    );
    this.ready = false;
    this.headReady = false;
    if (initCallback) this.#initCallback = initCallback;
    this.shaderOverride = shaderOverride;

    if (setupType === SetupType.Screenshot) {
      this.#renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } else {
      this.#renderer = new THREE.WebGLRenderer({ antialias: true });
    }
    this.getRendererElement().classList.add("scene");
    this.setupType = setupType;

    getSetting("bodyModel").then((type) => {
      this.bodyModel = type;
    });

    getSetting("shaderType").then((type) => {
      this.shaderType = type;
      getSetting("simpleShaderLegacyColors").then((val) => {
        this.simpleShaderLegacyColors = val;
      });
      // glTF Loader hack only for FFL shader to force srgb-linear textures.
      if (
        type === "lightDisabled" ||
        type.startsWith("wiiu") ||
        type === "switch"
      ) {
        this.#gltfLoader = new GLTFLoader() as TrueGLTFLoader;
      } else {
        this.#gltfLoader = new TrueGLTFLoader();
      }

      if (type === "none") {
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const environmentMap = cubeTextureLoader.load([
          "./cube_map.png", // px.png
          "./cube_map.png", // nx.png
          "./cube_map.png", // py.png
          "./cube_map.png", // ny.png
          "./cube_map.png", // pz.png
          "./cube_map.png", // nz.png
        ]);
        this.#scene.environment = environmentMap;
        this.#scene.environmentIntensity = 1.25;

        const directionalLight = new THREE.DirectionalLight(0xebfeff, Math.PI);
        directionalLight.position.set(1, 0.1, 1);
        // directionalLight.visible = false;
        this.#scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x666666, Math.PI / 16);
        // ambientLight.visible = false;
        this.#scene.add(ambientLight);
      } else if (type !== "lightDisabled") {
        this.#scene.environmentIntensity = 0;
      }

      // hack to make the camera focus correctly
      this.focusCamera(CameraPosition.MiiHead, true);
    });

    this.#renderer.setSize(512, 512);
    // this.#renderer.setPixelRatio(window.devicePixelRatio * 0.1);

    CameraControls.install({ THREE });

    this.#controls = new CameraControls(
      this.#camera,
      this.#renderer.domElement
    );
    if (setupType === SetupType.Normal) {
      const camSetup = async () => {
        const canPan = await localforage.getItem("settings_cameraPan");

        if (canPan !== true) {
          console.log("canPan is not false:", canPan);
          this.#controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
          this.#controls.mouseButtons.right = CameraControls.ACTION.NONE;
          this.#controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
          this.#controls.touches.one = CameraControls.ACTION.TOUCH_ROTATE;
          this.#controls.touches.two = CameraControls.ACTION.TOUCH_DOLLY;
          this.#controls.touches.three = CameraControls.ACTION.NONE;
          this.#controls.minDistance = 8;
          this.#controls.maxDistance = 35;
          // this.#controls.minDistance = 60;
          // this.#controls.maxDistance = 100;
          this.#controls.minAzimuthAngle = -Math.PI;
          this.#controls.maxAzimuthAngle = Math.PI;
          this.cameraPan = true;
        } else {
          this.#camera.fov = 15;
          this.#camera.updateProjectionMatrix();
          this.#controls.mouseButtons.left = CameraControls.ACTION.NONE;
          this.#controls.mouseButtons.right = CameraControls.ACTION.NONE;
          this.#controls.mouseButtons.wheel = CameraControls.ACTION.NONE;
          this.#controls.touches.one = CameraControls.ACTION.NONE;
          this.#controls.touches.two = CameraControls.ACTION.NONE;
          this.#controls.touches.three = CameraControls.ACTION.NONE;
          this.#controls.minDistance = 60;
          this.#controls.maxDistance = 140;
          this.#controls.minAzimuthAngle = -Math.PI;
          this.#controls.maxAzimuthAngle = Math.PI;
          this.#controls.dollyTo(100);
          this.cameraPan = false;
        }
      };
      camSetup();
    }

    if (setupType === SetupType.Screenshot) {
      // this.#controls.moveTo(0, 1.5, 0);
      this.#controls.dollyTo(40);
      this.#camera.fov = 30;

      // prevent too much zoom lol
      this.#controls.minDistance = 8;
      this.#controls.maxDistance = 300;
    } else {
      setTimeout(() => {
        this.focusCamera(CameraPosition.MiiHead, true);
      }, 200);
    }

    this.animators.set("cameraControls", (time, delta) => {
      this.#controls.update(delta);
    });

    this.#textureLoader = new THREE.TextureLoader();

    this.mii = mii;

    this.type = this.mii.gender === 0 ? "m" : "f";

    const clock = new THREE.Clock();

    const animate = (time: number) => {
      const delta = clock.getDelta();

      this.#renderer.render(this.#scene, this.#camera);
      this.animators.forEach((f) => f(time, delta));
    };

    this.#renderer.setClearAlpha(0);
    this.#renderer.setAnimationLoop(animate);

    this.#camera.aspect = this.#parent.offsetWidth / this.#parent.offsetHeight;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(this.#parent.offsetWidth, this.#parent.offsetHeight);
  }
  currentPosition!: CameraPosition;
  focusCamera(
    part: CameraPosition,
    force: boolean = false,
    transition: boolean = true,
    onlyReturn: boolean = false
  ) {
    this.#controls.smoothTime = 0.2;

    // don't re-position the camera if it is already in the correct location
    if (this.currentPosition === part && force === false) return;

    this.currentPosition = part;

    const pos = new THREE.Vector3();
    let body = this.#scene.getObjectByName(this.type)!,
      head = this.#scene.getObjectByName("MiiHead");
    // if (body !== undefined) {
    //   head = body.getObjectByName("head")! as THREE.Bone;
    // }

    if (part === CameraPosition.MiiFullBody) {
      if (body !== undefined && head !== undefined) {
        const box = new THREE.Box3().setFromObject(body);
        const box2 = new THREE.Box3().setFromObject(head);
        pos.y = box2.max.y / 2;
      }
      if (onlyReturn === false) {
        this.#controls.moveTo(pos.x, pos.y, pos.z, transition);
        this.#controls.rotateTo(0, Math.PI / 2, transition);
        this.#controls.dollyTo(40, transition);
        if (this.cameraPan === false) {
          this.#controls.dollyTo(120, transition);
        }
      }
      return pos;
    } else if (part === CameraPosition.MiiHead) {
      if (body !== undefined) {
        const box = new THREE.Box3().setFromObject(body);
        pos.y = box.max.y - box.min.y;
      }
      if (onlyReturn === false) {
        this.#controls.moveTo(pos.x, pos.y + 2, pos.z, transition);
        this.#controls.rotateTo(0, Math.PI / 2, transition);
        this.#controls.dollyTo(25, transition);
        if (this.cameraPan === false) {
          this.#controls.dollyTo(100, transition);
        }
      }
      return pos;
    }
  }
  playEndingAnimation() {
    this.focusCamera(CameraPosition.MiiFullBody, true);
    let heads = this.#scene.getObjectsByProperty("name", "MiiHead");
    for (const head of heads) {
      this.traverseAddFaceMaterial(
        head as THREE.Mesh,
        `&data=${encodeURIComponent(
          this.mii.encodeStudio().toString("hex")
        )}&expression=1&width=512`
      );
    }
    const type = this.mii.gender == 0 ? "m" : "f";
    this.animators.delete(`animation-${type}`);
    this.swapAnimation("Finish");
    getSoundManager().playSound("finish");
  }
  resize(
    width: number = this.#parent.offsetWidth,
    height: number = this.#parent.offsetHeight
  ) {
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }
  async init() {
    if (this.ready) return;
    this.ready = false;
    this.getRendererElement().style.opacity = "0";
    await this.#addBody();
    this.swapAnimation("Wait", true);
    //await this.updateMiiHead();
    // ^^ will happen on first render()
    this.ready = true;
    if (this.setupType === SetupType.Screenshot) {
      this.#initCallback && this.#initCallback(this.#renderer);
    } else {
      // weird hacky fix to correct the camera position at startup
      setTimeout(() => {
        this.focusCamera(CameraPosition.MiiHead, true, false);
      }, 500);
    }
  }
  getRendererElement() {
    return this.#renderer.domElement;
  }
  anim!: Map<"m" | "f", THREE.AnimationAction>;
  currentAnim!: string;
  initAnimation(mesh: THREE.Object3D, id: string) {
    console.debug("playAnimation() called:", mesh, id);

    // weird hack to prevent random crash
    if (this.mixer === undefined)
      this.mixer = new THREE.AnimationMixer(this.#scene.getObjectByName("m")!);

    this.animators.set(id, (_time, delta) => {
      try {
        this.mixer.update(delta);
      } catch (e) {
        console.warn(e);
      }
    });
  }
  swapAnimation(newAnim: string, force: boolean = false) {
    if (newAnim === this.currentAnim) return;
    console.debug("swapAnimation() called:", newAnim);
    if (force !== true) {
      for (const [_, anim] of this.anim) {
        anim.fadeOut(0.2);
      }
    } else {
      for (const [_, anim] of this.anim) {
        anim.fadeOut(0).reset().stop();
      }
    }
    this.currentAnim = newAnim;
    let x: ("m" | "f")[] = ["m", "f"];
    for (const key of x) {
      this.anim.set(
        key,
        this.mixer.clipAction(
          this.animations.get(`${key}-${newAnim}`)!,
          this.#scene.getObjectByName(key)
        )
      );
      this.anim
        .get(key)!
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1);

      // hack to prevent anim from being sped up
      if (newAnim === "Wait") {
        setTimeout(() => {
          this.anim.get(key)!.timeScale = 0.5;
        }, 33.33);
      }
      if (newAnim === "Finish") {
        setTimeout(() => {
          this.anim.get(key)!.timeScale = 0.8;
        }, 33.33);
      }

      if (force === false) {
        this.anim.get(key)!.fadeIn(0.2).play();
      } else {
        this.anim.get(key)!.play();
      }

      this.anim.get(key)!.timeScale = 1;
    }
  }
  async #addBody() {
    console.log("addBody()");
    const setupMiiBody = async (path: string, type: "m" | "f") => {
      const glb = await this.#gltfLoader.loadAsync(path);

      const clips = glb.animations;

      this.mixer = new THREE.AnimationMixer(glb.scene.getObjectByName(type)!);
      for (const anim of clips) {
        this.animations.set(`${type}-${anim.name}`, anim);
      }

      glb.scene.name = `${type}-body-root`;

      // RAF WAS HERE
      this.#scene.add(glb.scene);

      // attempt to solve weird animations not working issue
      this.initAnimation(glb.scene.getObjectByName(type)!, `animation-${type}`);

      // Add materials to body and legs
      const gBodyMesh = glb.scene.getObjectByName(
        `body_${type}`
      )! as THREE.Mesh;
      gBodyMesh.geometry.userData = {
        cullMode: 1,
        modulateColor: MiiFavoriteFFLColorLookupTable[this.mii.favoriteColor],
        modulateMode: 0,
        modulateType: cMaterialName.FFL_MODULATE_TYPE_SHAPE_BODY,
      };
      if (this.shaderOverride)
        // Override material with a MeshStandardMaterial
        gBodyMesh.material = new THREE.MeshStandardMaterial({
          roughness: 1,
          metalness: 1,
          color: MiiFavoriteColorLookupTable[this.mii.favoriteColor],
        });
      // adds shader material
      else traverseMesh(gBodyMesh, this.mii);

      const gHandsMesh = glb.scene.getObjectByName(
        `hands_${type}`
      )! as THREE.Mesh;
      gHandsMesh.geometry.userData = {
        cullMode: 1,
        modulateColor: MiiFavoriteFFLColorLookupTable[this.mii.favoriteColor],
        modulateMode: 0,
        modulateType: cMaterialName.FFL_MODULATE_TYPE_SHAPE_BODY,
      };
      if (this.shaderOverride)
        gHandsMesh.material = new THREE.MeshStandardMaterial({
          roughness: 1,
          metalness: 1,
          color: MiiFavoriteColorLookupTable[this.mii.favoriteColor],
        });
      // adds shader material
      else traverseMesh(gHandsMesh, this.mii);

      const gLegsMesh = glb.scene.getObjectByName(
        `legs_${type}`
      )! as THREE.Mesh;
      gLegsMesh.geometry.userData = {
        cullMode: 1,
        modulateColor: cPantsColorGray,
        modulateMode: 0,
        modulateType: cMaterialName.FFL_MODULATE_TYPE_SHAPE_PANTS,
      };
      if (this.shaderOverride)
        gLegsMesh.material = new THREE.MeshStandardMaterial({
          metalness: 1,
          roughness: 1,
          color: new THREE.Color(
            this.getPantsColor()[0],
            this.getPantsColor()[1],
            this.getPantsColor()[2]
          ),
        });
      // adds shader material
      else traverseMesh(gLegsMesh, this.mii);

      if (this.#scene.getObjectByName("m"))
        this.#scene.getObjectByName("m")!.visible = false;
      if (this.#scene.getObjectByName("f"))
        this.#scene.getObjectByName("f")!.visible = false;

      glb.scene.rotation.set(0, 0, 0);
      console.log(`setupBody("${path}", "${type}")`);
    };

    const bodyModel = (await getSetting("bodyModel")) as string;

    const loaders = [
      setupMiiBody(`./assets/models/miiBodyM_${bodyModel}.glb`, "m"),
      setupMiiBody(`./assets/models/miiBodyF_${bodyModel}.glb`, "f"),
    ];

    await Promise.all(loaders);

    console.log("READY");
  }
  getPantsColor() {
    const useLinearColors =
      this.shaderType === ShaderType.Simple &&
      this.simpleShaderLegacyColors === false
        ? true
        : false;

    if (this.mii.normalMii === false) {
      return useLinearColors ? cPantsColorGoldLinear : cPantsColorGold;
    }
    if (this.mii.favorite) {
      return useLinearColors ? cPantsColorRedLinear : cPantsColorRed;
    }
    return useLinearColors ? cPantsColorGrayLinear : cPantsColorGray;
  }
  async updateBody() {
    if (!this.ready) return;

    this.type = this.mii.gender === 0 ? "m" : "f";

    const bodyM = this.#scene.getObjectByName("m-body-root");
    const bodyF = this.#scene.getObjectByName("f-body-root");
    if (!bodyM) return;
    if (!bodyF) return;

    const build = this.mii.build;
    const height = this.mii.height;

    // Ported from FFL-Testing
    let scaleFactors = { x: 0, y: 0, z: 0 };
    // Note that 1.0 scale roughly
    // translates to 82 build/83 height.

    switch (Config.mii.scalingMode) {
      case "scaleLimit": // Limits scale to hide pants.
        // NOTE: even in wii u mii maker this still shows a few
        // pixels of the pants, but here without proper body scaling
        // this won't actually let you get away w/o pants
        let heightFactor = height / 128.0;
        scaleFactors.y = heightFactor * 0.55 + 0.6;
        scaleFactors.x = heightFactor * 0.3 + 0.6;
        scaleFactors.x =
          (heightFactor * 0.6 + 0.8 - scaleFactors.x) * (build / 128.0) +
          scaleFactors.x;
        break;
      case "scaleLimitClampY": // Same as above but clamps Y.
        heightFactor = height / 128.0;
        scaleFactors.y = heightFactor * 0.55 + 0.6;
        scaleFactors.x = heightFactor * 0.3 + 0.6;
        scaleFactors.x =
          (heightFactor * 0.6 + 0.8 - scaleFactors.x) * (build / 128.0) +
          scaleFactors.x;
        // Limit Y scale.
        scaleFactors.y = Math.min(scaleFactors.y, 1.0);
        break;
      case "scaleApply": // Scale seen on Wii U/Switch.
        // 0.47 / 128.0 = 0.003671875
        scaleFactors.x =
          (build * (height * 0.003671875 + 0.4)) / 128.0 +
          // 0.23 / 128.0 = 0.001796875
          height * 0.001796875 +
          0.4;
        // 0.77 / 128.0 = 0.006015625
        scaleFactors.y = height * 0.006015625 + 0.5;
        break;
    }

    scaleFactors.z = scaleFactors.x;

    // @ts-expect-error debug
    window.scaleFactors = scaleFactors;

    const traverseBones = (object: THREE.Object3D) => {
      object.scale.set(scaleFactors.x, scaleFactors.y, scaleFactors.z);

      // this.#scene
      //   .getObjectByName("MiiHead")!
      //   .scale.set(
      //     0.12 / scaleFactors.x,
      //     0.12 / scaleFactors.y,
      //     0.12 / scaleFactors.z
      //   );
      // object.traverse((o: THREE.Object3D) => {
      //   if ((o as THREE.Bone).isBone) {
      //     // attempt at porting some bone scaling code.. disabled for now
      //     const bone = o as THREE.Bone;
      //     if (bone.name === "head") return;
      //     let boneScale = { x: 1, y: 1, z: 1 };
      //     switch (bone.name) {
      //       case "skl_root":
      //         break;
      //       case "chest":
      //       case "hip":
      //       case "foot_l1":
      //       case "foot_l2":
      //       case "foot_r1":
      //       case "foot_r2":
      //         boneScale.x = scaleFactors.x;
      //         boneScale.y = scaleFactors.y;
      //         boneScale.z = scaleFactors.z;
      //         break;
      //       case "arm_l1":
      //       case "arm_l2":
      //       case "arm_r1":
      //       case "arm_lr2":
      //         boneScale.x = scaleFactors.y;
      //         boneScale.y = scaleFactors.x;
      //         boneScale.z = scaleFactors.z;
      //         break;
      //       case "wrist_l":
      //       case "wrist_r":
      //       case "ankle_l":
      //       case "ankle_r":
      //         boneScale.x = scaleFactors.x;
      //         boneScale.y = scaleFactors.x;
      //         boneScale.z = scaleFactors.x;
      //         break;
      //       default:
      //         break;
      //       // case "chest":
      //       // case "chest_2":
      //       // case "hip":
      //       // case "foot_l1":
      //       // case "foot_l2":
      //       // case "foot_r1":
      //       // case "foot_r2":
      //       //   boneScale.x = scaleFactors.x;
      //       //   boneScale.y = scaleFactors.y;
      //       //   boneScale.z = scaleFactors.z;
      //       //   break;
      //       // case "arm_l1":
      //       // case "arm_l2":
      //       // case "elbow_l":
      //       // case "arm_r1":
      //       // case "arm_r2":
      //       // case "elbow_r":
      //       //   boneScale.x = scaleFactors.y;
      //       //   boneScale.y = scaleFactors.x;
      //       //   boneScale.z = scaleFactors.z;
      //       //   break;
      //       // case "wrist_l":
      //       // case "shoulder_l":
      //       // case "wrist_r":
      //       // case "shoulder_r":
      //       // case "ankle_l":
      //       // case "knee_l":
      //       // case "ankle_r":
      //       // case "knee_r":
      //       //   boneScale.x = scaleFactors.x;
      //       //   boneScale.y = scaleFactors.x;
      //       //   boneScale.z = scaleFactors.x;
      //       //   break;
      //       // case "head":
      //       //   boneScale.x = scaleFactors.x;
      //       //   boneScale.y = Math.min(scaleFactors.y, 1.0);
      //       //   boneScale.z = scaleFactors.z;
      //       //   break;
      //     }
      //     bone.scale.set(boneScale.x, boneScale.y, boneScale.z);
      //   }
      // });
    };

    const shaderSetting = await getSetting("shaderType");
    const bodyModel = await getSetting("bodyModel");

    const makeHeadBoneUpdate = (body: THREE.Object3D) => {
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      return () => {
        let headBone = body.getObjectByName("head") as THREE.Bone;
        if (headBone === undefined)
          headBone = body.getObjectByName("Head") as THREE.Bone;

        if (!headBone) return;
        headBone.updateMatrixWorld(true);

        // Extract the position and rotation from the matrix
        const position = new THREE.Vector3();

        headBone.matrixWorld.decompose(position, quaternion, scale);
        if (this.#scene.getObjectByName("MiiHead")!) {
          // Set the head model's position and rotation
          this.#scene.getObjectByName("MiiHead")!.position.copy(position);
          this.#scene
            .getObjectByName("MiiHead")!
            .setRotationFromQuaternion(quaternion);
          if (bodyModel === "miitomo") {
            // hacky
            this.#scene.getObjectByName("MiiHead")!.rotation.z -= Math.PI / 2;
          }
        }
      };
    };

    const assignMaterial = async (
      bodyN: THREE.Object3D<THREE.Object3DEventMap>,
      type: string
    ) => {
      const isWiiUShader =
        (shaderSetting.startsWith("wiiu") ||
          shaderSetting === "lightDisabled") &&
        this.shaderOverride === false;
      const colorHands = await getSetting("bodyModelHands");

      const nBody = bodyN
        .getObjectByName(type)!
        .getObjectByName("body_" + type)! as THREE.Mesh;
      if (isWiiUShader)
        (nBody.material as THREE.ShaderMaterial).uniforms.u_const1.value =
          new THREE.Vector4(
            ...MiiFavoriteFFLColorLookupTable[this.mii.favoriteColor]
          );
      const nLegs = bodyN
        .getObjectByName(type)!
        .getObjectByName("legs_" + type)! as THREE.Mesh;
      if (isWiiUShader)
        (nLegs.material as THREE.ShaderMaterial).uniforms.u_const1.value =
          new THREE.Vector4(...this.getPantsColor());

      if (shaderSetting === "none" || this.shaderOverride) {
        if (this.simpleShaderLegacyColors === false) {
          const lookupTable = MiiFavoriteColorLookupTable;
          (nBody.material as THREE.MeshBasicMaterial).color.set(
            lookupTable[this.mii.favoriteColor]
          );
        } else {
          const lookupTable = MiiFavoriteColorVec3Table;
          (nBody.material as THREE.MeshBasicMaterial).color.set(
            lookupTable[this.mii.favoriteColor][0],
            lookupTable[this.mii.favoriteColor][1],
            lookupTable[this.mii.favoriteColor][2]
          );
        }

        (nLegs.material as THREE.MeshBasicMaterial).color.set(
          this.getPantsColor()[0],
          this.getPantsColor()[1],
          this.getPantsColor()[2]
        );
      }

      const nHands = bodyN
        .getObjectByName(type)!
        .getObjectByName("hands_" + type)! as THREE.Mesh;

      if (colorHands === true) {
        let desiredColor: [number, number, number] = [1, 0, 0];

        // previous revision of hand color guessing, keeping it here because it may be used later..?
        // let head = this.#scene.getObjectByName("MiiHead");
        // if (head) {
        //   // attempt to get current skin color...
        //   if (isWiiUShader) {
        //     this.mii.skinColor
        //     MiiSwitchSkinColorList
        //     // desiredColor = (
        //     //   (head.children[0] as THREE.Mesh).material as THREE.ShaderMaterial
        //     // ).uniforms.u_const1.value;
        //   } else {
        //     const color = (
        //       (head.children[0] as THREE.Mesh)
        //         .material as THREE.MeshBasicMaterial
        //     ).color;
        //     desiredColor = [color.r, color.g, color.b, 1];
        //   }
        // } else {
        //   console.log("OOOPS");
        // }

        // little bit hacky lol because "simple" shader depends on linear instead of sRGB colors.
        if (this.mii.extFacePaintColor !== 0) {
          if (shaderSetting === "none") {
            desiredColor =
              SwitchMiiColorTableLinear[this.mii.extFacePaintColor - 1];
          } else {
            desiredColor =
              SwitchMiiColorTableSRGB[this.mii.extFacePaintColor - 1];
          }
        } else {
          if (shaderSetting === "none") {
            desiredColor = MiiSwitchSkinColorLinear[this.mii.skinColor];
          } else {
            desiredColor = MiiSwitchSkinColorSRGB[this.mii.skinColor];
          }
        }

        // console.log(
        //   `Desired Color: %c${JSON.stringify(desiredColor)}`,
        //   `rgb(${desiredColor[0] * 255}, ${desiredColor[1] * 255}, ${
        //     desiredColor[2] * 255
        //   })`
        // );

        if (isWiiUShader) {
          (nHands.material as THREE.ShaderMaterial).uniforms.u_const1.value =
            new THREE.Vector4(...desiredColor, 1);
        } else if (shaderSetting === "none" || this.shaderOverride) {
          (nHands.material as THREE.MeshBasicMaterial).color.set(
            desiredColor[0],
            desiredColor[1],
            desiredColor[2]
          );
        }

        this.handColor = desiredColor;
      } else {
        nHands.material = nBody.material;
      }
    };

    switch (this.mii.gender) {
      // m
      case 0:
        bodyM.getObjectByName("m")!.visible = true;
        bodyF.getObjectByName("f")!.visible = false;

        // Attach head to head bone of body (not physically this time)
        this.animators.set("head_bone", makeHeadBoneUpdate(bodyM));

        // Scale each bone except for body
        traverseBones(bodyM);

        assignMaterial(bodyM, "m");
        break;
      // f
      case 1:
        bodyM.getObjectByName("m")!.visible = false;
        bodyF.getObjectByName("f")!.visible = true;

        // Attach head to head bone of body (not physically this time)
        this.animators.set("head_bone", makeHeadBoneUpdate(bodyF));

        // Scale each bone except for body
        traverseBones(bodyF);

        assignMaterial(bodyF, "f");
        break;
    }
  }
  debugGetScene() {
    return this.#scene;
  }
  fadeIn() {
    if (this.setupType === SetupType.Normal) {
      this.getRendererElement().style.opacity = "0";
      setTimeout(() => {
        this.getRendererElement().style.opacity = "1";
      }, 500);
    } else {
      // Screenshot mode only
      this.getRendererElement().style.opacity = "1";
    }
  }
  async updateMiiHead(renderPart: RenderPart = RenderPart.Head) {
    if (!this.ready) {
      console.log("first time loading head");
    }
    let head = this.#scene.getObjectsByProperty("name", "MiiHead");

    switch (renderPart) {
      case RenderPart.Head:
        if (head.length > 0) {
          head.forEach((h) => {
            // Dispose of old head materials
            h.traverse((c) => {
              let child = c as THREE.Mesh;
              if (child.isMesh) {
                child.geometry.dispose();
                const mat = child.material as THREE.MeshBasicMaterial;
                if (mat.map) mat.map.dispose();
                mat.dispose();
              }
            });
          });
        }
        try {
          // CUSTOM APP-SPECIFIC DATA
          let favoriteColor: number = this.mii.favoriteColor;
          // console.log("fav color:", favoriteColor);

          const tmpMii = new Mii(this.mii.encode());
          if (this.mii.extHatColor !== 0) {
            tmpMii.favoriteColor = this.mii.extHatColor - 1;
          }
          let params: Record<string, string> = {};
          if (this.mii.extHatType !== 0) {
            // Custom hat model types
            switch (HatTypeList[this.mii.extHatType]) {
              case HatType.HAT:
                params["modelType"] = "hat";
                break;
              case HatType.FACE_ONLY:
                params["modelType"] = "face_only";
                break;
              case HatType.BALD:
                // BALD HAIR!!!
                tmpMii.hairType = 30;
                break;
            }
          }
          params["verifyCharInfo"] = "0";
          let GLB: GLTF;
          if (Config.renderer.useRendererServer) {
            GLB = await this.#gltfLoader.loadAsync(
              tmpMii.studioUrl({
                ext: "glb",
                texResolution: "512",
                miiName: this.mii.miiName,
                creatorName: this.mii.creatorName,
                miic: encodeURIComponent(this.mii.encode().toString("base64")),
                ...params,
              } as unknown as any)
            );
          } else {
            GLB = await getHeadModel(tmpMii);
          }
          //@ts-expect-error
          window.GLB = GLB;
          this.mii.favoriteColor = favoriteColor;

          GLB.scene.name = "MiiHead";
          // head is no longer attached to head bone physically, no more need to offset rotation
          // GLB.scene.rotation.set(-Math.PI / 2, 0, 0);
          GLB.scene.scale.set(0.12, 0.12, 0.12);

          try {
            if (this.mii.extHatType !== 0) {
              let hatModel = await this.#gltfLoader.loadAsync(
                `./assets/models/hat_${this.mii.extHatType}.glb`
              );

              hatModel.scene.name = "HatScene";
              hatModel.scene.renderOrder = -1;
              let i = 0;
              if (GLB.asset.extras.partsTransform.hatTranslate) {
                const [x, y, z] = GLB.asset.extras.partsTransform.hatTranslate;
                console.log(GLB.asset.extras.partsTransform.hatTranslate);
                const vec = new THREE.Vector3(x, y, z);
                hatModel.scene.position.add(vec);
                //@ts-expect-error
                window.hatModel = hatModel;
              }
              let shaderSetting = await getSetting("shaderType");
              hatModel.scene.traverse((o: any) => {
                // "HatRoot" would be the name of the parent object to the hat if it is an armature
                if (o.name === "HatScene" || o.name === "HatRoot") return;

                if ((o as THREE.Mesh).isMesh) {
                  let m = o as THREE.Mesh;
                  const mat = m.material as THREE.MeshStandardMaterial;

                  let tableToPullFrom = MiiFavoriteColorVec3Table;
                  if (shaderSetting === "none") {
                    // bug: inaccurate colors
                    tableToPullFrom = MiiFavoriteColorVec3Table;

                    if (this.simpleShaderLegacyColors === true) {
                      tableToPullFrom = MiiFavoriteColorVec3Table;
                    }
                  }
                  const tex = multiplyTexture(
                    mat.map!,
                    tableToPullFrom[
                      this.mii.extHatColor !== 0
                        ? this.mii.extHatColor - 1
                        : this.mii.favoriteColor
                    ]
                  );
                  // VERY HACKY SET HAT TEXTURE
                  // setTimeout(() => {
                  // (
                  //   m.material as THREE.ShaderMaterial
                  // ).uniforms.s_texture.value = tex;
                  // }, 16.66);
                  m.material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: tex,
                  });
                  m.material.needsUpdate = true;
                  m.geometry.userData = {
                    // ignore: 1,
                    cullMode: 0,
                    modulateColor:
                      MiiFavoriteColorVec3Table[
                        this.mii.extHatColor !== 0
                          ? this.mii.extHatColor - 1
                          : this.mii.favoriteColor
                      ],
                    modulateMode: 5, //5,
                    modulateType: 5, //5,
                  };

                  i++;
                }
              });

              GLB.scene.add(hatModel.scene);
            }
          } catch (e) {
            console.error(
              "Hat type resulted in an error, but we're not going to let that stop the head from rendering!",
              e
            );
          }

          // enable shader on head
          this.#scene.remove(...head);
          // hack to force remove head anyways
          this.#scene.getObjectsByProperty("name", "MiiHead").forEach((obj) => {
            obj.parent!.remove(obj);
          });
          traverseAddShader(GLB.scene, this.mii);
          console.debug("Traversing shader now");

          const body = this.#scene.getObjectByName(this.type)!;

          let headBone = body.getObjectByName("head") as THREE.Bone;
          if (headBone === undefined)
            headBone = body.getObjectByName("Head") as THREE.Bone;

          if (!headBone) return;
          headBone.updateMatrixWorld(true);

          // Extract the position and rotation from the matrix
          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3();

          headBone.matrixWorld.decompose(position, quaternion, scale);
          if (GLB.scene) {
            // Set the head model's position and rotation
            GLB.scene.position.copy(position);
            GLB.scene.setRotationFromQuaternion(quaternion);
            console.debug("Positioning head to body");
            // GLB.scene.rotation.x -= Math.PI / 2;
          }

          const bodyModelType = this.bodyModel;
          this.#scene.add(GLB.scene);
          console.debug("Adding head to scene");

          // Hacky fix for head being snapped in the wrong direction for 1 frame
          if (bodyModelType === "miitomo") {
            GLB.scene.rotation.z -= Math.PI / 2;
          }

          // setTimeout(() => {
          //   debugger;
          // }, 10);
        } catch (e) {
          console.error(e);
        }
        break;
      case RenderPart.Face:
        if (head.length > 0) {
          head.forEach((h) => {
            this.traverseAddFaceMaterial(
              h as THREE.Mesh,
              `&data=${encodeURIComponent(
                this.mii.encodeStudio().toString("hex")
              )}&width=512`
            );
          });
        }
        break;
    }

    if (this.headReady === false) this.fadeIn();
    this.headReady = true;
    await this.updateBody();
  }

  particles!: SparkleParticle[];
  // particleTimeout!: Timer;
  sparkle() {
    if (!this.particles) this.particles = [];
    // remove all previous sparkles lol
    // this.animators
    //   .keys()
    //   .filter((p) => p.startsWith("particle_"))
    //   .forEach((key) => this.animators.delete(key));

    const loader = new THREE.TextureLoader();
    loader.load("./assets/images/star.png", (texture) => {
      const pos = new THREE.Vector3();
      const box = new THREE.Box3();
      this.#scene.getObjectByName("MiiHead")!.getWorldPosition(pos);
      box.setFromObject(this.#scene.getObjectByName("MiiHead")!);
      let particle = new SparkleParticle(
        this.#scene,
        new THREE.Vector3(0, pos.y + box.min.y / 2, 2),
        texture
      );
      this.particles.push(particle);
      this.animators.set("particle_" + performance.now(), (_t, delta) =>
        particle.update(delta)
      );
      setTimeout(() => {
        this.particles.forEach((p, i) => {
          p.dispose();
        });
        this.particles = [];
        Array.from(this.animators.keys())
          .filter((p) => p.startsWith("particle_"))
          .forEach((key) => {
            this.animators.delete(key);
          });
      }, 1000);
    });
  }
  getHead() {
    return this.#scene.getObjectByName("MiiHead");
  }
  traverseAddFaceMaterial(node: THREE.Mesh, urlParams: string) {
    // Dispose of old head materials
    node.traverse((c) => {
      let child = c as THREE.Mesh;
      if (child.isMesh) {
        if (child.geometry.userData) {
          const data = child.geometry.userData as {
            cullMode: number;
            modulateColor: number[];
            modulateMode: number;
            modulateType: number;
          };
          if (data.modulateMode) {
            if (data.modulateType === 6) {
              // found face!!
              (async () => {
                const mat = child.material as THREE.MeshBasicMaterial;
                const oldMat = mat;

                const tex = await this.#textureLoader.loadAsync(
                  Config.renderer.renderFaceURL + urlParams
                );

                if (tex) {
                  // Simple shader mask color space fix
                  if ((await getSetting("shaderType")) === ShaderType.Simple) {
                    tex.colorSpace = "srgb";
                  }
                  tex.flipY = false;
                  // Initialize the texture on the GPU to prevent lag frames
                  this.#renderer.initTexture(tex);

                  child.material = new THREE.MeshStandardMaterial({
                    map: tex,
                    emissiveIntensity: 1,
                    transparent: true,
                    metalness: 1,
                    toneMapped: true,
                    alphaTest: 0.5,
                  });

                  // Now... Replace it with shader material
                  traverseMesh(child, this.mii);

                  oldMat.dispose();
                }
              })();
            }
          }
        }
      }
    });
  }

  // screenshot mode helper utils
  // also used for debugging
  getCamera() {
    return this.#camera;
  }
  getControls() {
    return this.#controls;
  }
  getScene() {
    return this.#scene;
  }
  getRenderer() {
    return this.#renderer;
  }

  shutdown() {
    Array.from(this.animators.keys()).forEach((k) => {
      this.animators.delete(k);
    });
  }
}
