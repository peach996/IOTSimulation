import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArcRotateCamera, AxesViewer, Color3, Color4, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';

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

  constructor() { 
  }

  ngOnInit(): void {
    this.init();
    this.buildHouse();
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

    // Lighting
    this.light = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), this.scene);

    // Helpers
    const axes = new AxesViewer(this.scene, 1);
  }

  private buildHouse(): void {
    this.buildLivingRoom();
    this.buildKitchen();
    this.buildBackRoom();
  }

  private buildLivingRoom(): void {
    let floor = MeshBuilder.CreatePlane("livingRoomFloor", { height: 5, width: 3, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    let floorMaterial = new StandardMaterial("livingRoomFloorMaterial", this.scene);
    floorMaterial.diffuseColor = new Color3(0.8, 0, 0);
    floor.material = floorMaterial;
  }

  private buildKitchen(): void {
    let floor = MeshBuilder.CreatePlane("kitchenFloor", { height: 3, width: 3, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    floor.translate(Vector3.Up(), 1);
    floor.translate(Vector3.Right(), 3);
    let floorMaterial = new StandardMaterial("kitchenFloorMaterial", this.scene);
    floorMaterial.diffuseColor = new Color3(0, 0.8, 0);
    floor.material = floorMaterial;
  }

  private buildBackRoom(): void {
    let floor = MeshBuilder.CreatePlane("backRoomFloor", { height: 2, width: 3, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
    floor.rotate(Vector3.Left(), this.toRadians(-90));
    floor.translate(Vector3.Down(), 1.5);
    floor.translate(Vector3.Right(), 3);
    let floorMaterial = new StandardMaterial("backRoomFloorMaterial", this.scene);
    floorMaterial.diffuseColor = new Color3(0, 0, 0.8);
    floor.material = floorMaterial;
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
