import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ArcRotateCamera,
  AxesViewer,
  Color3,
  Color4,
  CSG,
  DirectionalLight,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  PointerEventTypes,
  PointLight,
  Scene,
  Texture,
  Vector3,
} from '@babylonjs/core';
import {
  AdvancedDynamicTexture,
  Ellipse,
  Line,
  Rectangle,
  TextBlock,
} from '@babylonjs/gui';
import * as earcut from 'earcut';
import { Level } from '../info-panel/info-panel.component';
import simulationPoints from './data.json';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  @ViewChild('viewerCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  advancedTexture: AdvancedDynamicTexture | undefined;
  rect1: Rectangle | undefined;

  private engine!: Engine;
  private scene!: Scene;
  private camera!: ArcRotateCamera;
  private light!: HemisphericLight;

  private innerWallMaterial?: PBRMaterial;

  private readonly kitchenTextureScale: number = 4;
  private readonly roofTextureScale: number = 2;
  private readonly carpetTextureScale: number = 10;
  private readonly innerWallTextureScale: number = 10;
  private readonly brickTextureScaleU: number = 10;
  private readonly brickTextureScaleV: number = 2;
  pathPoints: Vector3[] = [];
  options: any;
  lines: any;
  clickedPoints: any[] = [];
  showWallData = false;
  initialColor: Color3 = new Color3(0, 0, 1);

  i = 0;
  private roofPlanes: Mesh[] = [];

  constructor() {}

  ngOnInit(): void {
    this.init();
    this.buildHouse();
    this.addAppliances();
    this.render();
  }

  private init(): void {
    // Engine
    this.engine = new Engine(this.canvas?.nativeElement, true);

    // Scene
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.53, 0.8, 0.92, 1); // A nice sky blue

    // Camera
    this.camera = new ArcRotateCamera(
      'MainCamera',
      Math.PI / 2,
      Math.PI / 2,
      10,
      Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.target = new Vector3(1.5, 0, 0);
    this.camera.lowerRadiusLimit = 0.1;
    this.camera.upperRadiusLimit = 20;

    // Lighting
    this.light = new HemisphericLight(
      'hemisphericLight',
      new Vector3(0, 1, 0),
      this.scene
    );
    this.light.intensity = 0.5;

    // Helpers
    // const axes = new AxesViewer(this.scene, 1);
    this.scene.onPointerObservable.add((event) =>
      this.handlePointerEvent(event)
    );

    this.pathPoints = [];

    const myPoints: [] = [];
    this.options = {
      points: myPoints,
      updatable: true,
    };
    this.lines = MeshBuilder.CreateLines('lines', this.options);

    //setInterval(() => this.simulateMovement(), 100);
  }

  runSim() {
    setInterval(() => this.simulateMovement(), 300);
  }

  levelChanged(level: Level): void {
    this.roofPlanes.forEach((mesh: Mesh) => {
      mesh.visibility = level;
    });
  }

  addSolarPanels(): void {
    this.levelChanged(Level.Roof);
    this.createSolarPanels();
  }

  simulateMovement() {
    if (this.i > simulationPoints.length - 1) {
      console.log('stopped');
      return;
    }

    console.log('hello!');
    this.pathPoints.push(
      new Vector3(
        simulationPoints[this.i].x,
        simulationPoints[this.i].y,
        simulationPoints[this.i].z
      )
    );
    const line = MeshBuilder.CreateLines(
      'lines',
      { points: this.pathPoints },
      this.scene
    );
    line.color = Color3.Blue();
    this.i++;
  }

  public handlePointerEvent(event: any) {
    switch (event.type) {
      case PointerEventTypes.POINTERDOWN:
        this.handleClick(event);
        break;
    }
  }

  handleClick(event: any) {
    let data = JSON.parse(JSON.stringify(simulationPoints));
    console.log(data[0].x);
    /*var pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    if (!pickResult) return;

    let point = pickResult?.pickedPoint;
    this.clickedPoints.push({ x: point?.x, y: point?.y, z: point?.z });
    if (this.clickedPoints.length > 100) {
      console.log(this.clickedPoints);
    }*/
  }

  private buildHouse(): void {
    const doorHeight: number = 0.8;

    // Outer walls
    let wall1 = this.buildWall(6, true, [], true);
    wall1.translate(Vector3.Backward(), 2.5);
    wall1.translate(Vector3.Right(), 1.5);

    let wall2 = this.buildWall(6, true);
    wall2.translate(Vector3.Forward(), 2.5);
    wall2.translate(Vector3.Right(), 1.5);
    wall2.rotate(Vector3.Up(), this.toRadians(180));

    let wall3 = this.buildWall(5, true);
    wall3.translate(Vector3.Left(), 1.5);
    wall3.rotate(Vector3.Up(), this.toRadians(90));

    let wall4 = this.buildWall(5, true);
    wall4.translate(Vector3.Right(), 4.5);
    wall4.rotate(Vector3.Up(), this.toRadians(-90));

    let door51 = MeshBuilder.CreateBox(
      'door51',
      { height: doorHeight, width: 0.5, depth: 1 },
      this.scene
    );
    door51.translate(Vector3.Right(), 1.5);

    let door52 = MeshBuilder.CreateBox(
      'door52',
      { height: doorHeight, width: 0.5, depth: 1 },
      this.scene
    );
    door52.translate(Vector3.Left(), 1.5);

    let doors5: MeshInfo[] = [
      {
        mesh: door51,
        height: doorHeight,
      },
      {
        mesh: door52,
        height: doorHeight,
      },
    ];

    let wall5 = this.buildWall(5, false, doors5);
    wall5.translate(Vector3.Right(), 1.5);
    wall5.rotate(Vector3.Up(), this.toRadians(-90));

    let door61 = MeshBuilder.CreateBox(
      'door61',
      { height: doorHeight, width: 0.5, depth: 1 },
      this.scene
    );
    door61.translate(Vector3.Left(), 0.95);

    let doors6: MeshInfo[] = [
      {
        mesh: door61,
        height: doorHeight,
      },
    ];

    let wall6 = this.buildWall(3, false, doors6);
    wall6.translate(Vector3.Backward(), 0.5);
    wall6.translate(Vector3.Right(), 3);

    // Rooms
    this.buildLivingRoom();
    this.buildKitchen();
    this.buildBackRoom();

    // Roof
    this.roofPlanes = this.createRoofPlanes();

    // Lighting
    let light1 = new PointLight(
      'pointlight1',
      new Vector3(0, 1, 0),
      this.scene
    );
    light1.intensity = 2;

    let light2 = new PointLight(
      'pointlight2',
      new Vector3(3, 1, 1.25),
      this.scene
    );
    light2.intensity = 2;

    let light3 = new PointLight(
      'pointlight3',
      new Vector3(3, 1, -1.5),
      this.scene
    );
    light3.intensity = 2;

    let directionalLight = new DirectionalLight(
      'directionLight',
      new Vector3(-0.25, -0.25, -0.25),
      this.scene
    );
  }

  private buildLivingRoom(): void {
    let floor = MeshBuilder.CreatePlane(
      'livingRoomFloor',
      { height: 5, width: 3, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    floor.rotate(Vector3.Left(), this.toRadians(-90));

    let ambientFloor = new Texture(
      'assets/materials/floor/ambientOcclusion.jpg'
    );
    ambientFloor.uScale = this.carpetTextureScale;
    ambientFloor.vScale = this.carpetTextureScale;
    let baseColorFloor = new Texture('assets/materials/floor/baseColor.jpg');
    baseColorFloor.uScale = this.carpetTextureScale;
    baseColorFloor.vScale = this.carpetTextureScale;
    let normalFloor = new Texture('assets/materials/floor/normal.jpg');
    normalFloor.uScale = this.carpetTextureScale;
    normalFloor.vScale = this.carpetTextureScale;
    let roughnessFloor = new Texture('assets/materials/floor/roughness.jpg');
    roughnessFloor.uScale = this.carpetTextureScale;
    roughnessFloor.vScale = this.carpetTextureScale;

    let floorMaterial = new PBRMaterial('livingRoomFloorMaterial', this.scene);
    floorMaterial.ambientTexture = ambientFloor;
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;

    floor.material = floorMaterial;
  }

  private buildKitchen(): void {
    let floor = MeshBuilder.CreatePlane(
      'kitchenFloor',
      { height: 3, width: 3, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    floor.translate(Vector3.Up(), 1);
    floor.translate(Vector3.Right(), 3);

    let baseColorFloor = new Texture('assets/materials/floor/baseColor.jpg');
    baseColorFloor.uScale = this.kitchenTextureScale;
    baseColorFloor.vScale = this.kitchenTextureScale;
    let normalFloor = new Texture('assets/materials/floor/normal.jpg');
    normalFloor.uScale = this.kitchenTextureScale;
    normalFloor.vScale = this.kitchenTextureScale;
    let roughnessFloor = new Texture('assets/materials/floor/roughness.jpg');
    roughnessFloor.uScale = this.kitchenTextureScale;
    roughnessFloor.vScale = this.kitchenTextureScale;

    let floorMaterial = new PBRMaterial('kitchenFloorMaterial', this.scene);
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;

    floor.material = floorMaterial;
  }

  private buildBackRoom(): void {
    let floor = MeshBuilder.CreatePlane(
      'backRoomFloor',
      { height: 2, width: 3, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    floor.translate(Vector3.Down(), 1.5);
    floor.translate(Vector3.Right(), 3);

    let baseColorFloor = new Texture('assets/materials/floor/baseColor.jpg');
    baseColorFloor.uScale = this.carpetTextureScale;
    baseColorFloor.vScale = this.carpetTextureScale;
    let normalFloor = new Texture('assets/materials/floor/normal.jpg');
    normalFloor.uScale = this.carpetTextureScale;
    normalFloor.vScale = this.carpetTextureScale;
    let roughnessFloor = new Texture('assets/materials/floor/roughness.jpg');
    roughnessFloor.uScale = this.carpetTextureScale;
    roughnessFloor.vScale = this.carpetTextureScale;

    let floorMaterial = new PBRMaterial('backRoomFloorMaterial', this.scene);
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;

    floor.material = floorMaterial;
  }

  private buildWall(
    length: number,
    isOuterWall?: boolean,
    holes?: MeshInfo[],
    hasIssue = false
  ): Mesh {
    const height: number = 1.05;

    holes?.forEach((meshInfo: MeshInfo) => {
      meshInfo.mesh.translate(Vector3.Down(), height - meshInfo.height / 2);
    });

    let modifier = 0;

    if (isOuterWall) modifier = 0.05;

    const innerWallShape: Vector3[] = [
      new Vector3(-(length / 2), 0, 0),
      new Vector3(length / 2, 0, 0),
      new Vector3(length / 2, 0, 0.001),
      new Vector3(-(length / 2), 0, 0.001),
    ];

    let innerWall = MeshBuilder.CreatePolygon(
      'innerWall',
      { shape: innerWallShape, depth: height },
      this.scene,
      earcut
    );

    let innerWallCsg = CSG.FromMesh(innerWall);
    holes?.forEach((meshInfo: MeshInfo) => {
      let meshCsg = CSG.FromMesh(meshInfo.mesh);
      innerWallCsg = innerWallCsg.subtract(meshCsg);
    });
    innerWall.dispose();
    innerWall = innerWallCsg.toMesh('innerWall', null, this.scene);

    innerWall.translate(Vector3.Up(), height);
    innerWall.material = this.getInnerWallMaterial();

    const outerWallShape: Vector3[] = [
      new Vector3(-(length / 2) - modifier, 0, 0),
      new Vector3(length / 2 + modifier, 0, 0),
      new Vector3(length / 2 + modifier, 0, 0.001),
      new Vector3(-(length / 2) - modifier, 0, 0.001),
    ];

    let outerWall = MeshBuilder.CreatePolygon(
      'outerWall',
      { shape: outerWallShape, depth: height },
      this.scene,
      earcut
    );

    let outerWallCsg = CSG.FromMesh(outerWall);
    holes?.forEach((meshInfo: MeshInfo) => {
      let meshCsg = CSG.FromMesh(meshInfo.mesh);
      outerWallCsg = outerWallCsg.subtract(meshCsg);
      meshInfo.mesh.dispose();
    });

    outerWall.dispose();
    outerWall = outerWallCsg.toMesh('outerWall', null, this.scene);

    outerWall.translate(Vector3.Backward(), 0.05);
    outerWall.translate(Vector3.Up(), height);
    outerWall.material = this.getInnerWallMaterial();
    outerWall.setParent(innerWall);

    if (isOuterWall) outerWall.material = this.getOuterWallMaterial();

    const topPlateShape: Vector3[] = [
      new Vector3(-(length / 2) - modifier, 0, 0),
      new Vector3(length / 2 + modifier, 0, 0),
      new Vector3(length / 2, 0, 0.05),
      new Vector3(-(length / 2), 0, 0.05),
    ];

    let topPlate = MeshBuilder.CreatePolygon(
      'outerWall',
      { shape: topPlateShape, depth: 0.01 },
      this.scene,
      earcut
    );
    topPlate.translate(Vector3.Up(), height);
    topPlate.translate(Vector3.Backward(), 0.05);
    topPlate.setParent(innerWall);
    topPlate.material = this.getTopPlateMaterial();

    if (this.showWallData && hasIssue) {
      this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

      var rect1 = new Rectangle();
      rect1.width = 0.1;
      rect1.height = '40px';
      rect1.cornerRadius = 20;
      rect1.color = 'black';
      rect1.thickness = 4;
      rect1.background = 'red';
      this.advancedTexture.addControl(rect1);
      rect1.linkWithMesh(outerWall);

      var label = new TextBlock();
      label.text = '10% Damp Detected';
      rect1.addControl(label);
    }

    return innerWall;
  }

  private getInnerWallMaterial(): PBRMaterial {
    if (this.innerWallMaterial) return this.innerWallMaterial;

    let baseColorInnerWall = new Texture(
      'assets/materials/inner_wall/baseColor.jpg'
    );
    baseColorInnerWall.uScale = this.innerWallTextureScale;
    baseColorInnerWall.vScale = this.innerWallTextureScale;
    let normalInnerWall = new Texture('assets/materials/inner_wall/normal.jpg');
    normalInnerWall.uScale = this.innerWallTextureScale;
    normalInnerWall.vScale = this.innerWallTextureScale;
    let roughnessInnerWall = new Texture(
      'assets/materials/inner_wall/roughness.jpg'
    );
    roughnessInnerWall.uScale = this.innerWallTextureScale;
    roughnessInnerWall.vScale = this.innerWallTextureScale;

    this.innerWallMaterial = new PBRMaterial('innerWallMaterial', this.scene);
    this.innerWallMaterial.albedoTexture = baseColorInnerWall;
    this.innerWallMaterial.bumpTexture = normalInnerWall;
    this.innerWallMaterial.metallicTexture = roughnessInnerWall;

    return this.innerWallMaterial;
  }

  private getOuterWallMaterial(): PBRMaterial {
    let ambientBricks = new Texture(
      'assets/materials/bricks/ambientOcclusion.jpg'
    );
    ambientBricks.uScale = this.brickTextureScaleU;
    ambientBricks.vScale = this.brickTextureScaleV;
    let baseColorBricks = new Texture('assets/materials/bricks/baseColor.jpg');
    baseColorBricks.uScale = this.brickTextureScaleU;
    baseColorBricks.vScale = this.brickTextureScaleV;
    let normalBricks = new Texture('assets/materials/bricks/normal.jpg');
    normalBricks.uScale = this.brickTextureScaleU;
    normalBricks.vScale = this.brickTextureScaleV;
    let roughnessBricks = new Texture('assets/materials/bricks/roughness.jpg');
    roughnessBricks.uScale = this.brickTextureScaleU;
    roughnessBricks.vScale = this.brickTextureScaleV;

    let brickMaterial = new PBRMaterial('bricksMaterial', this.scene);
    brickMaterial.ambientTexture = ambientBricks;
    brickMaterial.albedoTexture = baseColorBricks;
    brickMaterial.bumpTexture = normalBricks;
    brickMaterial.metallicTexture = roughnessBricks;

    return brickMaterial;
  }

  private getTopPlateMaterial(): PBRMaterial {
    let baseColorTopPlate = new Texture(
      'assets/materials/top_plate/baseColor.jpg'
    );
    baseColorTopPlate.uScale = this.brickTextureScaleU;
    baseColorTopPlate.vScale = this.brickTextureScaleV;
    let normalTopPlate = new Texture('assets/materials/top_plate/normal.jpg');
    normalTopPlate.uScale = this.brickTextureScaleU;
    normalTopPlate.vScale = this.brickTextureScaleV;
    let roughnessTopPlate = new Texture(
      'assets/materials/top_plate/roughness.jpg'
    );
    roughnessTopPlate.uScale = this.brickTextureScaleU;
    roughnessTopPlate.vScale = this.brickTextureScaleV;

    let topPlateMaterial = new PBRMaterial('topPlateMaterial', this.scene);
    topPlateMaterial.albedoTexture = baseColorTopPlate;
    topPlateMaterial.bumpTexture = normalTopPlate;
    topPlateMaterial.metallicTexture = roughnessTopPlate;

    return topPlateMaterial;
  }

  private addAppliances(): void {
    // TV
    let tv = this.createTv();
    tv.translate(Vector3.Up(), 0.6);
    tv.translate(Vector3.Right(), 1.48);
    tv.rotate(Vector3.Up(), this.toRadians(90));

    // Sockets
    let plugSocket1 = this.createPlugSocket();
    plugSocket1.translate(Vector3.Up(), 0.2);
    plugSocket1.translate(Vector3.Right(), 1.495);
    plugSocket1.rotate(Vector3.Up(), this.toRadians(90));

    let plugSocket2 = this.createPlugSocket();
    plugSocket2.translate(Vector3.Up(), 0.2);
    plugSocket2.translate(Vector3.Left(), 1.495);
    plugSocket2.translate(Vector3.Backward(), 1);
    plugSocket2.rotate(Vector3.Up(), this.toRadians(-90));

    let plugSocket3 = this.createPlugSocket();
    plugSocket3.translate(Vector3.Up(), 0.2);
    plugSocket3.translate(Vector3.Right(), 4.5);
    plugSocket3.translate(Vector3.Backward(), 2);
    plugSocket3.rotate(Vector3.Up(), this.toRadians(-90));

    let plugSocket4 = this.createPlugSocket();
    plugSocket4.translate(Vector3.Up(), 0.5);
    plugSocket4.translate(Vector3.Right(), 4.5);
    plugSocket4.translate(Vector3.Forward(), 2.25);
    plugSocket4.rotate(Vector3.Up(), this.toRadians(-90));

    // Kitchen
    let kitchenCabinets = this.createKitchenCabinets();
    kitchenCabinets.translate(Vector3.Up(), 0.175);
    kitchenCabinets.translate(Vector3.Backward(), 0.25);
    kitchenCabinets.translate(Vector3.Right(), 3.5);

    // Kettle
    let kettle = this.createKettle();
    kettle.translate(Vector3.Up(), 0.37);
    kettle.translate(Vector3.Right(), 4.3);
    kettle.translate(Vector3.Forward(), 2.2);

    // Lamps
    let lamp1 = this.createLamp();
    lamp1.translate(Vector3.Up(), 0.025);
    lamp1.translate(Vector3.Left(), 1.25);
    lamp1.translate(Vector3.Backward(), 1.25);

    let lamp2 = this.createLamp();
    lamp2.translate(Vector3.Up(), 0.025);
    lamp2.translate(Vector3.Right(), 4.25);
    lamp2.translate(Vector3.Backward(), 2.25);
  }

  private createTv(): Mesh {
    let tv = MeshBuilder.CreateBox(
      'TV',
      { height: 0.5, width: 1, depth: 0.03 },
      this.scene
    );
    let tvMaterial = new PBRMaterial('tvMaterial', this.scene);
    tvMaterial.albedoColor = new Color3(0, 0, 0);
    tvMaterial.roughness = 0.0;
    tvMaterial.metallic = 1.0;
    tv.material = tvMaterial;

    if (!this.showWallData) {
      this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

      var rect1 = new Rectangle();
      rect1.width = 0.05;
      rect1.height = '40px';
      rect1.cornerRadius = 20;
      rect1.color = 'Orange';
      rect1.background = 'green';
      this.advancedTexture.addControl(rect1);
      rect1.linkWithMesh(tv);
      rect1.linkOffsetY = -150;

      var label = new TextBlock();
      label.text = 'TV';
      rect1.addControl(label);

      var target = new Ellipse();
      target.width = '20px';
      target.height = '20px';
      target.color = 'Orange';
      target.background = 'green';
      this.advancedTexture.addControl(target);
      target.linkWithMesh(tv);

      var line = new Line();
      line.lineWidth = 2;
      line.color = 'Orange';
      line.y2 = 20;
      line.linkOffsetY = -10;
      this.advancedTexture.addControl(line);
      line.linkWithMesh(tv);
      line.connectedControl = rect1;

      setTimeout(() => {
        setInterval(() => this.simulateUsage(target), 1000);
      }, 10000);
    }

    return tv;
  }

  simulateUsage(rect: Ellipse) {
    if (!rect) return;

    if (
      this.initialColor.b === 1 &&
      this.initialColor.g < 1 &&
      this.initialColor.r < 0.999
    ) {
      this.initialColor.g += 0.1;
    }

    if (this.initialColor.g > 0.999 && this.initialColor.b - 0.1 >= 0) {
      this.initialColor.b -= 0.1;
    }

    if (
      this.initialColor.g > 0.999 &&
      this.initialColor.b < 0.0001 &&
      this.initialColor.r < 0.999
    ) {
      this.initialColor.r += 0.1;
    }

    if (this.initialColor.r > 0.999 && this.initialColor.g - 0.1 > 0) {
      this.initialColor.g -= 0.1;
    }

    console.log(this.initialColor.toString());
    rect.background = this.initialColor.toHexString();
  }

  private createPlugSocket(): Mesh {
    let plugSocket = MeshBuilder.CreateBox(
      'plugSocket',
      { height: 0.05, width: 0.1, depth: 0.001 },
      this.scene
    );
    let plugSocketMaterial = new PBRMaterial('plugSocketMaterial', this.scene);
    plugSocketMaterial.albedoColor = new Color3(1.0, 1.0, 1.0);
    plugSocketMaterial.roughness = 0.25;
    plugSocketMaterial.metallic = 0.9;
    plugSocket.material = plugSocketMaterial;

    if (!this.showWallData) {
      this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

      var rect1 = new Rectangle();
      rect1.width = 0.05;
      rect1.height = '40px';
      rect1.cornerRadius = 20;
      rect1.color = 'Orange';
      rect1.background = 'green';
      this.advancedTexture.addControl(rect1);
      rect1.linkWithMesh(plugSocket);
      rect1.linkOffsetY = -120;

      var label = new TextBlock();
      label.text = 'SOCKET';
      rect1.addControl(label);

      var target = new Ellipse();
      target.width = '20px';
      target.height = '20px';
      target.color = 'Orange';
      target.background = 'green';
      this.advancedTexture.addControl(target);
      target.linkWithMesh(plugSocket);

      var line = new Line();
      line.lineWidth = 2;
      line.color = 'Orange';
      line.y2 = 20;
      line.linkOffsetY = -10;
      this.advancedTexture.addControl(line);
      line.linkWithMesh(plugSocket);
      line.connectedControl = rect1;

      setTimeout(() => {
        setInterval(() => this.simulateUsage(target), 1000);
      }, 10000);
    }

    return plugSocket;
  }

  private createKitchenCabinets(): Mesh {
    let kitchenCabinet = MeshBuilder.CreateBox(
      'kitchenCabinet',
      { height: 0.35, width: 2, depth: 0.5 },
      this.scene
    );
    let kitchenCabinetMaterial = new PBRMaterial(
      'kitchenCabinetMaterial',
      this.scene
    );
    kitchenCabinetMaterial.albedoColor = new Color3(0.3, 0.3, 0.3);
    kitchenCabinetMaterial.roughness = 0.25;
    kitchenCabinetMaterial.metallic = 0.9;
    kitchenCabinet.material = kitchenCabinetMaterial;

    let kitchenCabinet2 = MeshBuilder.CreateBox(
      'kitchenCabinet',
      { height: 0.35, width: 2.5, depth: 0.5 },
      this.scene
    );
    kitchenCabinet2.material = kitchenCabinetMaterial;
    kitchenCabinet2.translate(Vector3.Right(), 0.75);
    kitchenCabinet2.translate(Vector3.Forward(), 1.5);
    kitchenCabinet2.rotate(Vector3.Up(), this.toRadians(-90));

    let kitchenTop = MeshBuilder.CreateBox(
      'kitchenTop',
      { height: 0.02, width: 2, depth: 0.5 },
      this.scene
    );
    kitchenTop.translate(Vector3.Up(), 0.185);
    let kitchenTopMaterial = new PBRMaterial('kitchenTopMaterial', this.scene);
    kitchenTopMaterial.albedoColor = new Color3(0.9, 0.9, 0.9);
    kitchenTopMaterial.roughness = 0.25;
    kitchenTopMaterial.metallic = 0.9;
    kitchenTop.material = kitchenTopMaterial;

    let kitchenTop2 = MeshBuilder.CreateBox(
      'kitchenTop2',
      { height: 0.02, width: 2.5, depth: 0.5 },
      this.scene
    );
    kitchenTop2.material = kitchenTopMaterial;
    kitchenTop2.translate(Vector3.Up(), 0.185);
    kitchenTop2.translate(Vector3.Right(), 0.75);
    kitchenTop2.translate(Vector3.Forward(), 1.5);
    kitchenTop2.rotate(Vector3.Up(), this.toRadians(-90));

    let oven = MeshBuilder.CreateBox(
      'oven',
      { height: 0.3, width: 0.3, depth: 0.01 },
      this.scene
    );
    let ovenMaterial = new PBRMaterial('ovenMaterial', this.scene);
    ovenMaterial.albedoColor = new Color3(0, 0, 0);
    ovenMaterial.roughness = 0.0;
    ovenMaterial.metallic = 1.0;
    oven.material = ovenMaterial;
    oven.translate(Vector3.Right(), 0.5);
    oven.translate(Vector3.Forward(), 1.5);
    oven.rotate(Vector3.Up(), this.toRadians(-90));

    let ovenHandle = MeshBuilder.CreateBox(
      'ovenHandle',
      { height: 0.01, width: 0.3, depth: 0.03 },
      this.scene
    );
    let ovenHandleMaterial = new PBRMaterial('ovenHandleMaterial', this.scene);
    ovenHandleMaterial.albedoColor = new Color3(1.0, 1.0, 1.0);
    ovenHandleMaterial.roughness = 0.3;
    ovenHandleMaterial.metallic = 0.8;
    ovenHandle.material = ovenHandleMaterial;
    ovenHandle.translate(Vector3.Up(), 0.16);
    ovenHandle.translate(Vector3.Right(), 0.5);
    ovenHandle.translate(Vector3.Forward(), 1.5);
    ovenHandle.rotate(Vector3.Up(), this.toRadians(-90));

    let hob = MeshBuilder.CreateBox(
      'hob',
      { height: 0.01, width: 0.35, depth: 0.5 },
      this.scene
    );
    let hobMaterial = new PBRMaterial('hobMaterial', this.scene);
    hobMaterial.albedoColor = new Color3(0.0, 0.0, 0.0);
    hobMaterial.roughness = 0.0;
    hobMaterial.metallic = 1.0;
    hob.material = hobMaterial;
    hob.translate(Vector3.Up(), 0.2);
    hob.translate(Vector3.Right(), 0.75);
    hob.translate(Vector3.Forward(), 1.5);
    hob.rotate(Vector3.Up(), this.toRadians(-90));

    let sink = MeshBuilder.CreateBox(
      'sink',
      { height: 0.01, width: 0.35, depth: 0.5 },
      this.scene
    );
    let sinkMaterial = new PBRMaterial('sinkMaterial', this.scene);
    sinkMaterial.albedoColor = new Color3(0.8, 0.8, 0.8);
    sinkMaterial.roughness = 0.2;
    sinkMaterial.metallic = 0.8;
    sink.material = sinkMaterial;
    sink.translate(Vector3.Up(), 0.2);
    sink.rotate(Vector3.Up(), this.toRadians(-90));

    kitchenCabinet2.setParent(kitchenCabinet);
    kitchenTop.setParent(kitchenCabinet);
    kitchenTop2.setParent(kitchenCabinet);
    oven.setParent(kitchenCabinet);
    ovenHandle.setParent(kitchenCabinet);
    hob.setParent(kitchenCabinet);
    sink.setParent(kitchenCabinet);

    if (!this.showWallData) {
      this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

      var rect1 = new Rectangle();
      rect1.width = 0.05;
      rect1.height = '40px';
      rect1.cornerRadius = 20;
      rect1.color = 'Orange';
      rect1.background = 'green';
      this.advancedTexture.addControl(rect1);
      rect1.linkWithMesh(oven);
      rect1.linkOffsetY = -150;

      var label = new TextBlock();
      label.text = 'OVEN';
      rect1.addControl(label);

      var target = new Ellipse();
      target.width = '20px';
      target.height = '20px';
      target.color = 'Orange';
      target.background = 'green';
      this.advancedTexture.addControl(target);
      target.linkWithMesh(oven);

      var line = new Line();
      line.lineWidth = 2;
      line.color = 'Orange';
      line.y2 = 20;
      line.linkOffsetY = -10;
      this.advancedTexture.addControl(line);
      line.linkWithMesh(oven);
      line.connectedControl = rect1;
    }

    return kitchenCabinet;
  }

  private createLamp(): Mesh {
    let metalMaterial = new PBRMaterial('metalMaterial', this.scene);
    metalMaterial.albedoColor = new Color3(0.8, 0.8, 0.8);
    metalMaterial.roughness = 0.2;
    metalMaterial.metallic = 0.8;

    let base = MeshBuilder.CreateCylinder(
      'base',
      { diameterBottom: 0.2, diameterTop: 0.02, height: 0.05 },
      this.scene
    );
    base.material = metalMaterial;

    let pole = MeshBuilder.CreateCylinder(
      'pole',
      { diameterBottom: 0.02, diameterTop: 0.02, height: 0.5 },
      this.scene
    );
    pole.translate(Vector3.Up(), 0.25);
    pole.material = metalMaterial;

    let lampShade = MeshBuilder.CreateCylinder(
      'lampShade',
      { diameterBottom: 0.2, diameterTop: 0.1, height: 0.1 },
      this.scene
    );
    lampShade.translate(Vector3.Up(), 0.5);
    let lampShadeMaterial = new PBRMaterial('metalMaterial', this.scene);
    lampShadeMaterial.albedoColor = new Color3(0.8, 0.8, 0.8);
    lampShadeMaterial.roughness = 1.0;
    lampShadeMaterial.metallic = 0.0;
    lampShade.material = lampShadeMaterial;

    pole.setParent(base);
    lampShade.setParent(base);

    if (!this.showWallData) {
      this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

      var rect1 = new Rectangle();
      rect1.width = 0.05;
      rect1.height = '40px';
      rect1.cornerRadius = 20;
      rect1.color = 'Orange';
      rect1.background = 'green';
      this.advancedTexture.addControl(rect1);
      rect1.linkWithMesh(lampShade);
      rect1.linkOffsetY = -180;

      var label = new TextBlock();
      label.text = 'LIGHT';
      rect1.addControl(label);

      var target = new Ellipse();
      target.width = '20px';
      target.height = '20px';
      target.color = 'Orange';
      target.background = 'green';
      this.advancedTexture.addControl(target);
      target.linkWithMesh(lampShade);

      var line = new Line();
      line.lineWidth = 2;
      line.color = 'Orange';
      line.y2 = 20;
      line.linkOffsetY = -10;
      this.advancedTexture.addControl(line);
      line.linkWithMesh(lampShade);
      line.connectedControl = rect1;
    }

    return base;
  }

  private createKettle(): Mesh {
    let metalMaterial = new PBRMaterial('metalMaterial', this.scene);
    metalMaterial.albedoColor = new Color3(0.0, 0.0, 0.0);
    metalMaterial.roughness = 0.2;
    metalMaterial.metallic = 0.8;

    let base = MeshBuilder.CreateCylinder(
      'base',
      { diameterBottom: 0.1, diameterTop: 0.1, height: 0.01 },
      this.scene
    );
    base.material = metalMaterial;

    let kettleBottom = MeshBuilder.CreateCylinder(
      'kettleBottom',
      { diameterBottom: 0.1, diameterTop: 0.1, height: 0.1 },
      this.scene
    );
    kettleBottom.translate(Vector3.Up(), 0.06);
    kettleBottom.material = metalMaterial;

    let kettleTop1 = MeshBuilder.CreateCylinder(
      'kettleTop1',
      { diameterBottom: 0.1, diameterTop: 0.08, height: 0.02 },
      this.scene
    );
    kettleTop1.translate(Vector3.Up(), 0.12);
    kettleTop1.material = metalMaterial;

    let kettleTop2 = MeshBuilder.CreateCylinder(
      'kettleTop2',
      { diameterBottom: 0.08, diameterTop: 0.04, height: 0.02 },
      this.scene
    );
    kettleTop2.translate(Vector3.Up(), 0.14);
    kettleTop2.material = metalMaterial;

    let kettleHandle = MeshBuilder.CreateTorus(
      'kettleHandle',
      { diameter: 0.06, thickness: 0.01 },
      this.scene
    );
    kettleHandle.translate(Vector3.Up(), 0.06);
    kettleHandle.translate(Vector3.Forward(), 0.05);
    kettleHandle.rotate(Vector3.Forward(), this.toRadians(-90));
    kettleHandle.material = metalMaterial;

    kettleBottom.setParent(base);
    kettleTop1.setParent(base);
    kettleTop2.setParent(base);
    kettleHandle.setParent(base);

    return base;
  }

  private createRoofPlanes(): Mesh[] {
    const shape: Vector3[] = [
      new Vector3(-1.6, 0, 0),
      new Vector3(4.6, 0, 0),
      new Vector3(4.6, 0, 2.8),
      new Vector3(-1.6, 0, 2.8),
    ];

    let baseColorRoof = new Texture('assets/materials/roofing/baseColor.jpg');
    baseColorRoof.uScale = this.roofTextureScale;
    baseColorRoof.vScale = this.roofTextureScale;
    let normalRoof = new Texture('assets/materials/roofing/normal.jpg');
    normalRoof.uScale = this.roofTextureScale;
    normalRoof.vScale = this.roofTextureScale;
    let roughnessRoof = new Texture('assets/materials/roofing/roughness.jpg');
    roughnessRoof.uScale = this.roofTextureScale;
    roughnessRoof.vScale = this.roofTextureScale;

    let roofMaterial = new PBRMaterial('roofMaterial', this.scene);
    roofMaterial.albedoTexture = baseColorRoof;
    roofMaterial.bumpTexture = normalRoof;
    roofMaterial.metallicTexture = roughnessRoof;

    let roofPlane = MeshBuilder.ExtrudePolygon(
      'RoofPlane',
      { shape: shape, depth: 0.01, updatable: true },
      this.scene,
      earcut
    );
    roofPlane.material = roofMaterial;
    let roofPlane2 = roofPlane.clone();

    roofPlane.translate(Vector3.Up(), 2);
    roofPlane.rotate(Vector3.Right(), this.toRadians(20));

    roofPlane2.translate(Vector3.Right(), 3);
    roofPlane2.translate(Vector3.Up(), 2);
    roofPlane2.rotate(Vector3.Up(), this.toRadians(180));
    roofPlane2.rotate(Vector3.Right(), this.toRadians(20));
    roofPlane2.setParent(roofPlane);

    roofPlane.visibility = 0;
    roofPlane2.visibility = 0;

    return [roofPlane, roofPlane2];
  }

  private createSolarPanels(): void {
    const shape: Vector3[] = [
      new Vector3(-1.0, 0, 0),
      new Vector3(3.0, 0, 0),
      new Vector3(3.0, 0, 1.8),
      new Vector3(-1.0, 0, 1.8),
    ];

    let ambientOcclusionSolarPanel = new Texture(
      'assets/materials/solar_panels/ambientOcclusion.jpg'
    );
    ambientOcclusionSolarPanel.uScale = this.roofTextureScale;
    ambientOcclusionSolarPanel.vScale = this.roofTextureScale;
    let baseColorSolarPanel = new Texture(
      'assets/materials/solar_panels/baseColor.jpg'
    );
    baseColorSolarPanel.uScale = this.roofTextureScale;
    baseColorSolarPanel.vScale = this.roofTextureScale;
    let normalSolarPanel = new Texture(
      'assets/materials/solar_panels/normal.jpg'
    );
    normalSolarPanel.uScale = this.roofTextureScale;
    normalSolarPanel.vScale = this.roofTextureScale;
    let roughnessSolarPanel = new Texture(
      'assets/materials/solar_panels/roughness.jpg'
    );
    roughnessSolarPanel.uScale = this.roofTextureScale;
    roughnessSolarPanel.vScale = this.roofTextureScale;

    let solarPanelMaterial = new PBRMaterial('roofMaterial', this.scene);
    solarPanelMaterial.ambientTexture = ambientOcclusionSolarPanel;
    solarPanelMaterial.albedoTexture = baseColorSolarPanel;
    solarPanelMaterial.bumpTexture = normalSolarPanel;
    solarPanelMaterial.metallicTexture = roughnessSolarPanel;

    let solarPanel = MeshBuilder.ExtrudePolygon(
      'Solar panel',
      { shape: shape, depth: 0.05, updatable: true },
      this.scene,
      earcut
    );
    solarPanel.material = solarPanelMaterial;
    let solarPanel2 = solarPanel.clone();

    solarPanel.translate(Vector3.Forward(), 0.5);
    solarPanel.translate(Vector3.Right(), 0.5);
    solarPanel.translate(Vector3.Up(), 1.85);
    solarPanel.rotate(Vector3.Right(), this.toRadians(20));

    solarPanel2.translate(Vector3.Backward(), 0.5);
    solarPanel2.translate(Vector3.Left(), 0.5);
    solarPanel2.translate(Vector3.Right(), 3);
    solarPanel2.translate(Vector3.Up(), 1.85);
    solarPanel2.rotate(Vector3.Up(), this.toRadians(180));
    solarPanel2.rotate(Vector3.Right(), this.toRadians(20));
    solarPanel2.setParent(solarPanel);

    this.roofPlanes = this.roofPlanes.concat(solarPanel);
    this.roofPlanes = this.roofPlanes.concat(solarPanel2);
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

export interface MeshInfo {
  mesh: Mesh;
  height: number;
}
