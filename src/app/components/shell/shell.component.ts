import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ArcRotateCamera,
  AxesViewer,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  PointerEventTypes,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  @ViewChild('viewerCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  private engine!: Engine;
  private scene!: Scene;
  private camera!: ArcRotateCamera;
  private light!: HemisphericLight;

  private innerWallMaterial?: PBRMaterial;

  private readonly kitchenTextureScale: number = 4;
  private readonly carpetTextureScale: number = 10;
  private readonly innerWallTextureScale: number = 10;
  private readonly brickTextureScaleU: number = 10;
  private readonly brickTextureScaleV: number = 2;
  pathPoints: Vector3[] = [];
  options: any;
  lines: any;
  clickedPoints: any[] = [];
  simulationPoints = [
    {
      x: 1.1081389562165245,
      y: 0.3332574261046566,
      z: 2.549999952316284,
    },
    {
      x: 3.8218054788848312,
      y: 0,
      z: 1.0451231917151944,
    },
    {
      x: 3.6020096409200786,
      y: 1.7763568394002505e-15,
      z: 1.2614799603661897,
    },
    {
      x: 3.339246660347023,
      y: 1.7763568394002505e-15,
      z: 1.4625217880699255,
    },
    {
      x: 2.975377881998682,
      y: 0,
      z: 1.443166990944091,
    },
    {
      x: 2.5091092960978525,
      y: 0,
      z: 1.516900850551497,
    },
    {
      x: 2.1539260195277086,
      y: 0,
      z: 1.5094897588295018,
    },
    {
      x: 1.5000000000000004,
      y: 0.9761887416766921,
      z: 1.431601851010667,
    },
    {
      x: 1.20502696544355,
      y: 1.7763568394002505e-15,
      z: 1.536009703964044,
    },
    {
      x: 0.8073075768742008,
      y: 0,
      z: 1.529725116098816,
    },
    {
      x: 0.23177577725553578,
      y: -1.7763568394002505e-15,
      z: 1.5096726731994035,
    },
    {
      x: -0.40572251938507414,
      y: 1.7763568394002505e-15,
      z: 1.4707285057156463,
    },
    {
      x: -0.7153278383973689,
      y: 0,
      z: 1.1280125915349866,
    },
    {
      x: -0.8298216091946229,
      y: 1.7763568394002505e-15,
      z: 0.03486287033518046,
    },
    {
      x: -0.8708032114035296,
      y: 0,
      z: -0.8043664440332879,
    },
    {
      x: -0.8013426402444799,
      y: 0,
      z: -1.3483989552367186,
    },
    {
      x: -0.3997671238741914,
      y: 3.552713678800501e-15,
      z: -1.574046846776611,
    },
    {
      x: 0.444910332106321,
      y: 1.7763568394002505e-15,
      z: -1.6525788966730457,
    },
    {
      x: 0.6595756512986893,
      y: 0,
      z: -0.9037998498828992,
    },
    {
      x: 0.8283067231660282,
      y: -1.7763568394002505e-15,
      z: -0.27042155108040455,
    },
    {
      x: 0.7344444761040555,
      y: 0,
      z: 0.2964700958019775,
    },
    {
      x: 0.48733877313115825,
      y: 1.7763568394002505e-15,
      z: 0.4194704614459952,
    },
    {
      x: 0.08762111732548317,
      y: 0,
      z: 0.43995786105444856,
    },
    {
      x: -0.4347152360707819,
      y: -1.7763568394002505e-15,
      z: 0.27909338434984976,
    },
    {
      x: -0.5273424190033902,
      y: 0,
      z: -0.3303791602177091,
    },
    {
      x: -0.40131142253937047,
      y: -1.7763568394002505e-15,
      z: -0.5571478949657227,
    },
    {
      x: -0.010075021973727227,
      y: 0,
      z: -1.0126446503194342,
    },
    {
      x: 0.7105557714436257,
      y: 0,
      z: -1.3625686476842154,
    },
    {
      x: 1.1971959733105875,
      y: 0,
      z: -1.5166382696222007,
    },
    {
      x: 1.4970986202434202,
      y: 0,
      z: -1.5127672009417552,
    },
    {
      x: 2.261993971117123,
      y: 0,
      z: -1.4468593061145933,
    },
    {
      x: 2.3764621614538575,
      y: 0,
      z: -1.4144124291761808,
    },
    {
      x: 3.5754245396655913,
      y: 1.7763568394002505e-15,
      z: -1.2755326927023154,
    },
    {
      x: 3.8660704912749635,
      y: 0,
      z: -1.3917984512191275,
    },
    {
      x: 4.048334019207601,
      y: 0,
      z: -1.607396651064037,
    },
    {
      x: 3.755736141766582,
      y: -1.7763568394002505e-15,
      z: -1.4527194985414524,
    },
    {
      x: 3.881899137020586,
      y: -1.7763568394002505e-15,
      z: -1.77552915910534,
    },
    {
      x: 3.436814420426435,
      y: 0,
      z: -2.0326732114435306,
    },
    {
      x: 2.8876104733408723,
      y: -1.7763568394002505e-15,
      z: -2.07123375458451,
    },
    {
      x: 2.365247186075323,
      y: 0,
      z: -2.0785414015222083,
    },
    {
      x: 1.8012225194417193,
      y: 0,
      z: -2.098452605665882,
    },
    {
      x: 1.0893564905036839,
      y: 0,
      z: -2.148633954904981,
    },
    {
      x: 1.0893564905036839,
      y: 0,
      z: -2.148633954904981,
    },
    {
      x: 0.08306674639616962,
      y: 1.7763568394002505e-15,
      z: -2.071104273503051,
    },
    {
      x: -0.14258941660491553,
      y: 0,
      z: -2.028530285591066,
    },
    {
      x: -0.33641922970464067,
      y: 0,
      z: -2.0559418140254175,
    },
    {
      x: -0.5756160012292519,
      y: 0,
      z: -2.0536965029321124,
    },
    {
      x: -0.9827997956125682,
      y: 3.552713678800501e-15,
      z: -2.0640280335898575,
    },
    {
      x: -1.084618218715819,
      y: 0,
      z: -2.056796141585648,
    },
    {
      x: -1.2477215166367186,
      y: -1.7763568394002505e-15,
      z: -0.5944280370023307,
    },
    {
      x: -1.1691908829496205,
      y: -1.7763568394002505e-15,
      z: 0.44901228961069783,
    },
    {
      x: -1.19412466003303,
      y: 1.7763568394002505e-15,
      z: 0.5715210065432619,
    },
    {
      x: -1.3608006849575538,
      y: 0,
      z: 1.02256481117839,
    },
    {
      x: -1.4016792146102293,
      y: -1.7763568394002505e-15,
      z: 1.8823420630563275,
    },
    {
      x: -0.9782139453458434,
      y: -1.7763568394002505e-15,
      z: 2.3217175288473486,
    },
    {
      x: -0.023523293849848415,
      y: 0,
      z: 2.4116082477038066,
    },
    {
      x: 0.3850262379537299,
      y: -1.7763568394002505e-15,
      z: 2.3833183056287917,
    },
    {
      x: 0.7581315220794235,
      y: 1.7763568394002505e-15,
      z: 2.268805985853689,
    },
    {
      x: 0.8011605383326756,
      y: 0,
      z: 1.7345190254632137,
    },
    {
      x: 0.8659086077255916,
      y: 1.7763568394002505e-15,
      z: 1.54029108616905,
    },
    {
      x: 0.37960622661616295,
      y: 0,
      z: 1.031110427397697,
    },
    {
      x: 0.03003223580758818,
      y: 0,
      z: 0.8460031443988509,
    },
    {
      x: -0.1460448718600622,
      y: 1.7763568394002505e-15,
      z: 0.5324620120094756,
    },
    {
      x: -0.17640062525157463,
      y: 0,
      z: 0.35399718365584093,
    },
    {
      x: 1.4331921921243507,
      y: 1.7763568394002505e-15,
      z: 0.7593592227128361,
    },
    {
      x: 2.015013539865357,
      y: 0,
      z: 0.8837548628087603,
    },
    {
      x: 2.570360311805606,
      y: -1.7763568394002505e-15,
      z: 1.1049080326606768,
    },
    {
      x: 2.8034032164164824,
      y: 0,
      z: 1.1035930453599714,
    },
    {
      x: 3.5457207385069682,
      y: 0,
      z: 1.1784335563150994,
    },
    {
      x: 3.8485187715363685,
      y: 0,
      z: 1.1660571869423793,
    },
    {
      x: 3.8485187715363685,
      y: 0,
      z: 1.1660571869423793,
    },
    {
      x: 3.8177589233179887,
      y: 0,
      z: 2.087705537173008,
    },
    {
      x: 3.760291715514377,
      y: 1.7763568394002505e-15,
      z: 1.898704457163479,
    },
    {
      x: 3.783496367982015,
      y: 0,
      z: 1.6200693327751088,
    },
    {
      x: 3.8238339999660003,
      y: 0,
      z: 0.7274779526912419,
    },
    {
      x: 3.818830379235084,
      y: -1.7763568394002505e-15,
      z: 0.5712499150198049,
    },
    {
      x: 3.8159134525240868,
      y: -1.7763568394002505e-15,
      z: 0.5569756224624012,
    },
    {
      x: 3.912101173686313,
      y: 1.7763568394002505e-15,
      z: -0.2326336869040872,
    },
    {
      x: 3.950500271131692,
      y: -1.7763568394002505e-15,
      z: 0.06833005607133685,
    },
    {
      x: 3.488620248062288,
      y: 0,
      z: 0.11689882284393553,
    },
    {
      x: 3.1398260455374514,
      y: 0,
      z: 0.1329101907496539,
    },
    {
      x: 2.937110469975655,
      y: 0,
      z: 0.1031443511428365,
    },
    {
      x: 2.5752014972946453,
      y: 0,
      z: 0.0955559232289582,
    },
    {
      x: 2.3776992701745416,
      y: 1.7763568394002505e-15,
      z: 0.9564080893119072,
    },
    {
      x: 1.5000000000000002,
      y: 0.9698660672908872,
      z: 1.1173277865379125,
    },
    {
      x: 1.5000000000000002,
      y: 0.6492123870167923,
      z: 1.14442066248805,
    },
    {
      x: 0.0693876587480049,
      y: -1.7763568394002505e-15,
      z: 1.2732310033491177,
    },
    {
      x: -0.6350285187347946,
      y: 0,
      z: 0.9784928876408201,
    },
    {
      x: -0.9730489624588121,
      y: 0,
      z: 0.24006214242454219,
    },
    {
      x: -0.8101650991234874,
      y: -1.7763568394002505e-15,
      z: -0.6767121661240066,
    },
    {
      x: -0.7342710235564649,
      y: 0,
      z: -1.0736835358510446,
    },
    {
      x: -0.5526762452848086,
      y: 0,
      z: -1.346444427594457,
    },
    {
      x: -0.03467787933223471,
      y: 1.7763568394002505e-15,
      z: -1.3769087356293572,
    },
    {
      x: 0.8037288956126633,
      y: 0,
      z: -1.3611902818531343,
    },
    {
      x: 1.0213195579269927,
      y: 0,
      z: -1.4235007644417612,
    },
    {
      x: 1.5,
      y: 0.8303430772508591,
      z: -1.2310607621080858,
    },
    {
      x: 2.586345523495903,
      y: 0,
      z: -1.522867127060366,
    },
    {
      x: 2.7570397027262894,
      y: 0,
      z: -1.530596828293381,
    },
    {
      x: 3.7504752980271787,
      y: 1.7763568394002505e-15,
      z: -1.2015066639429668,
    },
    {
      x: 3.812053383320653,
      y: 1.7763568394002505e-15,
      z: -1.4035024446363735,
    },
    {
      x: 3.9428665087549035,
      y: 1.7763568394002505e-15,
      z: -1.7630457068353218,
    },
    {
      x: 3.229670822816029,
      y: 0,
      z: -1.8194722167430637,
    },
  ];

  i = 0;

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

    // Helpers
    const axes = new AxesViewer(this.scene, 1);
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
    setInterval(() => this.simulateMovement(), 100);
  }

  simulateMovement() {
    if (this.i > this.simulationPoints.length - 1) {
      console.log('stopped');
      return;
    }

    console.log('hello!');
    this.pathPoints.push(
      new Vector3(
        this.simulationPoints[this.i].x,
        this.simulationPoints[this.i].y,
        this.simulationPoints[this.i].z
      )
    );
    MeshBuilder.CreateLines('lines', { points: this.pathPoints }, this.scene);
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
    let data = JSON.parse(JSON.stringify(this.simulationPoints));
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
    // Outer walls
    let wall1 = this.buildWall(6);
    wall1.translate(Vector3.Backward(), 2.5);
    wall1.translate(Vector3.Right(), 1.5);

    let wall2 = this.buildWall(6);
    wall2.translate(Vector3.Forward(), 2.5);
    wall2.translate(Vector3.Right(), 1.5);
    wall2.rotate(Vector3.Up(), this.toRadians(180));

    let wall3 = this.buildWall(5);
    wall3.translate(Vector3.Left(), 1.5);
    wall3.rotate(Vector3.Up(), this.toRadians(90));

    let wall4 = this.buildWall(5);
    wall4.translate(Vector3.Right(), 4.5);
    wall4.rotate(Vector3.Up(), this.toRadians(-90));

    let wall5 = this.buildWall(5, this.getInnerWallMaterial());
    wall5.translate(Vector3.Right(), 1.5);
    wall5.rotate(Vector3.Up(), this.toRadians(-90));

    let wall6 = this.buildWall(3, this.getInnerWallMaterial());
    wall6.translate(Vector3.Backward(), 0.5);
    wall6.translate(Vector3.Right(), 3);

    // Rooms
    this.buildLivingRoom();
    this.buildKitchen();
    this.buildBackRoom();
  }

  private buildLivingRoom(): void {
    let floor = MeshBuilder.CreatePlane(
      'livingRoomFloor',
      { height: 5, width: 3, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    floor.rotate(Vector3.Left(), this.toRadians(-90));

    let ambientFloor = new Texture(
      'assets/materials/carpet_blue/ambientOcclusion.jpg'
    );
    ambientFloor.uScale = this.carpetTextureScale;
    ambientFloor.vScale = this.carpetTextureScale;
    let baseColorFloor = new Texture(
      'assets/materials/carpet_blue/baseColor.jpg'
    );
    baseColorFloor.uScale = this.carpetTextureScale;
    baseColorFloor.vScale = this.carpetTextureScale;
    let normalFloor = new Texture('assets/materials/carpet_blue/normal.jpg');
    normalFloor.uScale = this.carpetTextureScale;
    normalFloor.vScale = this.carpetTextureScale;
    let roughnessFloor = new Texture(
      'assets/materials/carpet_blue/roughness.jpg'
    );
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

    let ambientFloor = new Texture(
      'assets/materials/wood_floor/ambientOcclusion.jpg'
    );
    ambientFloor.uScale = this.kitchenTextureScale;
    ambientFloor.vScale = this.kitchenTextureScale;
    let baseColorFloor = new Texture(
      'assets/materials/wood_floor/baseColor.jpg'
    );
    baseColorFloor.uScale = this.kitchenTextureScale;
    baseColorFloor.vScale = this.kitchenTextureScale;
    let normalFloor = new Texture('assets/materials/wood_floor/normal.jpg');
    normalFloor.uScale = this.kitchenTextureScale;
    normalFloor.vScale = this.kitchenTextureScale;
    let roughnessFloor = new Texture(
      'assets/materials/wood_floor/roughness.jpg'
    );
    roughnessFloor.uScale = this.kitchenTextureScale;
    roughnessFloor.vScale = this.kitchenTextureScale;

    let floorMaterial = new PBRMaterial('kitchenFloorMaterial', this.scene);
    floorMaterial.ambientTexture = ambientFloor;
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

    let baseColorFloor = new Texture(
      'assets/materials/carpet_white/baseColor.jpg'
    );
    baseColorFloor.uScale = this.carpetTextureScale;
    baseColorFloor.vScale = this.carpetTextureScale;
    let normalFloor = new Texture('assets/materials/carpet_white/normal.jpg');
    normalFloor.uScale = this.carpetTextureScale;
    normalFloor.vScale = this.carpetTextureScale;
    let roughnessFloor = new Texture(
      'assets/materials/carpet_white/roughness.jpg'
    );
    roughnessFloor.uScale = this.carpetTextureScale;
    roughnessFloor.vScale = this.carpetTextureScale;

    let floorMaterial = new PBRMaterial('backRoomFloorMaterial', this.scene);
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;

    floor.material = floorMaterial;
  }

  private buildWall(length: number, outerMaterial?: PBRMaterial): Mesh {
    const height: number = 1.05;

    let innerWall = MeshBuilder.CreatePlane(
      'innerWall',
      { height: height, width: length, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    innerWall.translate(Vector3.Up(), height / 2);

    innerWall.material = this.getInnerWallMaterial();

    let outerWall = MeshBuilder.CreatePlane(
      'outerWall',
      { height: height, width: length, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    outerWall.translate(Vector3.Backward(), 0.05);
    outerWall.translate(Vector3.Up(), height / 2);
    outerWall.setParent(innerWall);

    if (!outerMaterial) outerWall.material = this.getOuterWallMaterial();

    let topPlate = MeshBuilder.CreatePlane(
      'topPlate',
      { height: 0.05, width: length, sideOrientation: Mesh.DOUBLESIDE },
      this.scene
    );
    topPlate.translate(Vector3.Up(), height);
    topPlate.translate(Vector3.Backward(), 0.025);
    topPlate.rotate(Vector3.Left(), this.toRadians(-90));
    topPlate.setParent(innerWall);
    topPlate.material = this.getTopPlateMaterial();

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

    return tv;
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

    return kitchenCabinet;
  }

  private createLamp(): Mesh {
    let metalMaterial = new PBRMaterial("metalMaterial", this.scene);
    metalMaterial.albedoColor = new Color3(0.8, 0.8, 0.8);
    metalMaterial.roughness = 0.2;
    metalMaterial.metallic = 0.8;

    let base = MeshBuilder.CreateCylinder("base", { diameterBottom: 0.2, diameterTop: 0.02, height: 0.05}, this.scene);
    base.material = metalMaterial;

    let pole = MeshBuilder.CreateCylinder("pole", { diameterBottom: 0.02, diameterTop: 0.02, height: 0.5}, this.scene);
    pole.translate(Vector3.Up(), 0.25);
    pole.material = metalMaterial;

    let lampShade = MeshBuilder.CreateCylinder("lampShade", { diameterBottom: 0.2, diameterTop: 0.1, height: 0.1}, this.scene);
    lampShade.translate(Vector3.Up(), 0.5);
    let lampShadeMaterial = new PBRMaterial("metalMaterial", this.scene);
    lampShadeMaterial.albedoColor = new Color3(0.8, 0.8, 0.8);
    lampShadeMaterial.roughness = 1.0;
    lampShadeMaterial.metallic = 0.0;
    lampShade.material = lampShadeMaterial;

    pole.setParent(base);
    lampShade.setParent(base);

    return base;
  }

  private createKettle(): Mesh {
    let metalMaterial = new PBRMaterial("metalMaterial", this.scene);
    metalMaterial.albedoColor = new Color3(0.0, 0.0, 0.0);
    metalMaterial.roughness = 0.2;
    metalMaterial.metallic = 0.8;

    let base = MeshBuilder.CreateCylinder("base", { diameterBottom: 0.1, diameterTop: 0.1, height: 0.01}, this.scene);
    base.material = metalMaterial;

    let kettleBottom = MeshBuilder.CreateCylinder("kettleBottom", { diameterBottom: 0.1, diameterTop: 0.1, height: 0.1}, this.scene);
    kettleBottom.translate(Vector3.Up(), 0.06);
    kettleBottom.material = metalMaterial;

    let kettleTop1 = MeshBuilder.CreateCylinder("kettleTop1", { diameterBottom: 0.1, diameterTop: 0.08, height: 0.02}, this.scene);
    kettleTop1.translate(Vector3.Up(), 0.12);
    kettleTop1.material = metalMaterial;

    let kettleTop2 = MeshBuilder.CreateCylinder("kettleTop2", { diameterBottom: 0.08, diameterTop: 0.04, height: 0.02}, this.scene);
    kettleTop2.translate(Vector3.Up(), 0.14);
    kettleTop2.material = metalMaterial;

    let kettleHandle = MeshBuilder.CreateTorus("kettleHandle", { diameter: 0.06, thickness: 0.01 }, this.scene);
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

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
