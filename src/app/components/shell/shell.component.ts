import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArcRotateCamera, AxesViewer, Color3, Color4, Engine, HemisphericLight, Mesh, MeshBuilder, PBRMaterial, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
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

  constructor() { 
  }

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
    this.camera = new ArcRotateCamera("MainCamera",  Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.target = new Vector3(1.5, 0, 0);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 20;

    // Lighting
    this.light = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), this.scene);

    // Helpers
    const axes = new AxesViewer(this.scene, 1);
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
    let floor = MeshBuilder.CreatePlane("livingRoomFloor", { height: 5, width: 3, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    floor.rotate(Vector3.Left(), this.toRadians(-90));

    let ambientFloor = new Texture("assets/materials/carpet_blue/ambientOcclusion.jpg");
    ambientFloor.uScale = this.carpetTextureScale;
    ambientFloor.vScale = this.carpetTextureScale;
    let baseColorFloor = new Texture("assets/materials/carpet_blue/baseColor.jpg");
    baseColorFloor.uScale = this.carpetTextureScale;
    baseColorFloor.vScale = this.carpetTextureScale;
    let normalFloor = new Texture("assets/materials/carpet_blue/normal.jpg");
    normalFloor.uScale = this.carpetTextureScale;
    normalFloor.vScale = this.carpetTextureScale;
    let roughnessFloor = new Texture("assets/materials/carpet_blue/roughness.jpg");
    roughnessFloor.uScale = this.carpetTextureScale;
    roughnessFloor.vScale = this.carpetTextureScale;

    let floorMaterial = new PBRMaterial("livingRoomFloorMaterial", this.scene);
    floorMaterial.ambientTexture = ambientFloor;
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;

    floor.material = floorMaterial;
  }

  private buildKitchen(): void {
    let floor = MeshBuilder.CreatePlane("kitchenFloor", { height: 3, width: 3, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    floor.translate(Vector3.Up(), 1);
    floor.translate(Vector3.Right(), 3);

    let ambientFloor = new Texture("assets/materials/wood_floor/ambientOcclusion.jpg");
    ambientFloor.uScale = this.kitchenTextureScale;
    ambientFloor.vScale = this.kitchenTextureScale;
    let baseColorFloor = new Texture("assets/materials/wood_floor/baseColor.jpg");
    baseColorFloor.uScale = this.kitchenTextureScale;
    baseColorFloor.vScale = this.kitchenTextureScale;
    let normalFloor = new Texture("assets/materials/wood_floor/normal.jpg");
    normalFloor.uScale = this.kitchenTextureScale;
    normalFloor.vScale = this.kitchenTextureScale;
    let roughnessFloor = new Texture("assets/materials/wood_floor/roughness.jpg");
    roughnessFloor.uScale = this.kitchenTextureScale;
    roughnessFloor.vScale = this.kitchenTextureScale;

    let floorMaterial = new PBRMaterial("kitchenFloorMaterial", this.scene);
    floorMaterial.ambientTexture = ambientFloor;
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;
    
    floor.material = floorMaterial;
  }

  private buildBackRoom(): void {
    let floor = MeshBuilder.CreatePlane("backRoomFloor", { height: 2, width: 3, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    floor.translate(Vector3.Down(), 1.5);
    floor.translate(Vector3.Right(), 3);

    let baseColorFloor = new Texture("assets/materials/carpet_white/baseColor.jpg");
    baseColorFloor.uScale = this.carpetTextureScale;
    baseColorFloor.vScale = this.carpetTextureScale;
    let normalFloor = new Texture("assets/materials/carpet_white/normal.jpg");
    normalFloor.uScale = this.carpetTextureScale;
    normalFloor.vScale = this.carpetTextureScale;
    let roughnessFloor = new Texture("assets/materials/carpet_white/roughness.jpg");
    roughnessFloor.uScale = this.carpetTextureScale;
    roughnessFloor.vScale = this.carpetTextureScale;

    let floorMaterial = new PBRMaterial("backRoomFloorMaterial", this.scene);
    floorMaterial.albedoTexture = baseColorFloor;
    floorMaterial.bumpTexture = normalFloor;
    floorMaterial.metallicTexture = roughnessFloor;

    floor.material = floorMaterial;
  }

  private buildWall(length: number, outerMaterial?: PBRMaterial): Mesh {
    const height: number = 1.05;

    let innerWall = MeshBuilder.CreatePlane("innerWall", { height: height, width: length, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    innerWall.translate(Vector3.Up(), height / 2)

    innerWall.material = this.getInnerWallMaterial();

    let outerWall = MeshBuilder.CreatePlane("outerWall", { height: height, width: length, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    outerWall.translate(Vector3.Backward(), 0.05)
    outerWall.translate(Vector3.Up(), height / 2)
    outerWall.setParent(innerWall);    

    if (!outerMaterial)
      outerWall.material = this.getOuterWallMaterial();

    let topPlate = MeshBuilder.CreatePlane("topPlate", { height: 0.05, width: length, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    topPlate.translate(Vector3.Up(), height)
    topPlate.translate(Vector3.Backward(), 0.025)
    topPlate.rotate(Vector3.Left(), this.toRadians(-90));
    topPlate.setParent(innerWall);
    topPlate.material = this.getTopPlateMaterial();

    return innerWall;
  }

  private getInnerWallMaterial(): PBRMaterial {
    if (this.innerWallMaterial)
      return this.innerWallMaterial;

    let baseColorInnerWall = new Texture("assets/materials/inner_wall/baseColor.jpg");
    baseColorInnerWall.uScale = this.innerWallTextureScale;
    baseColorInnerWall.vScale = this.innerWallTextureScale;
    let normalInnerWall = new Texture("assets/materials/inner_wall/normal.jpg");
    normalInnerWall.uScale = this.innerWallTextureScale;
    normalInnerWall.vScale = this.innerWallTextureScale;
    let roughnessInnerWall = new Texture("assets/materials/inner_wall/roughness.jpg");
    roughnessInnerWall.uScale = this.innerWallTextureScale;
    roughnessInnerWall.vScale = this.innerWallTextureScale;

    this.innerWallMaterial = new PBRMaterial("innerWallMaterial", this.scene);
    this.innerWallMaterial.albedoTexture = baseColorInnerWall;
    this.innerWallMaterial.bumpTexture = normalInnerWall;
    this.innerWallMaterial.metallicTexture = roughnessInnerWall;

    return this.innerWallMaterial;
  }

  private getOuterWallMaterial(): PBRMaterial {
    let ambientBricks = new Texture("assets/materials/bricks/ambientOcclusion.jpg");
    ambientBricks.uScale = this.brickTextureScaleU;
    ambientBricks.vScale = this.brickTextureScaleV;
    let baseColorBricks = new Texture("assets/materials/bricks/baseColor.jpg");
    baseColorBricks.uScale = this.brickTextureScaleU;
    baseColorBricks.vScale = this.brickTextureScaleV;
    let normalBricks = new Texture("assets/materials/bricks/normal.jpg");
    normalBricks.uScale = this.brickTextureScaleU;
    normalBricks.vScale = this.brickTextureScaleV;
    let roughnessBricks = new Texture("assets/materials/bricks/roughness.jpg");
    roughnessBricks.uScale = this.brickTextureScaleU;
    roughnessBricks.vScale = this.brickTextureScaleV;

    let brickMaterial = new PBRMaterial("bricksMaterial", this.scene);
    brickMaterial.ambientTexture = ambientBricks;
    brickMaterial.albedoTexture = baseColorBricks;
    brickMaterial.bumpTexture = normalBricks;
    brickMaterial.metallicTexture = roughnessBricks;

    return brickMaterial;
  }

  private getTopPlateMaterial(): PBRMaterial {
    let baseColorTopPlate = new Texture("assets/materials/top_plate/baseColor.jpg");
    baseColorTopPlate.uScale = this.brickTextureScaleU;
    baseColorTopPlate.vScale = this.brickTextureScaleV;
    let normalTopPlate = new Texture("assets/materials/top_plate/normal.jpg");
    normalTopPlate.uScale = this.brickTextureScaleU;
    normalTopPlate.vScale = this.brickTextureScaleV;
    let roughnessTopPlate = new Texture("assets/materials/top_plate/roughness.jpg");
    roughnessTopPlate.uScale = this.brickTextureScaleU;
    roughnessTopPlate.vScale = this.brickTextureScaleV;

    let topPlateMaterial = new PBRMaterial("topPlateMaterial", this.scene);
    topPlateMaterial.albedoTexture = baseColorTopPlate;
    topPlateMaterial.bumpTexture = normalTopPlate;
    topPlateMaterial.metallicTexture = roughnessTopPlate;

    return topPlateMaterial;
  }

  addAppliances(): void {
    // TV
    let tv = MeshBuilder.CreateBox("TV", { height: 0.5, width: 1, depth: 0.03 }, this.scene);
    let tvMaterial = new PBRMaterial("tvMaterial", this.scene);
    tvMaterial.albedoColor = new Color3(0, 0, 0);
    tvMaterial.roughness = 0.0;
    tvMaterial.metallic = 1.0;
    tv.material = tvMaterial;
    tv.translate(Vector3.Up(), 0.6);
    tv.translate(Vector3.Right(), 1.48);
    tv.rotate(Vector3.Up(), this.toRadians(90));
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
