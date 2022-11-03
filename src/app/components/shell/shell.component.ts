import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArcRotateCamera, Color4, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';

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

    MeshBuilder.CreateBox("box", { size: 10 }, this.scene);

    this.render();    
  }

  private init(): void {
    // Engine
    this.engine = new Engine(this.canvas?.nativeElement, true);
    
    // Scene
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.53, 0.8, 0.92, 1); // A nice sky blue

    // Camera
    this.camera = new ArcRotateCamera("MainCamera",  Math.PI / 2, Math.PI / 2, 30, Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas, true);

    // Lighting
    this.light = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), this.scene);
  }

  private render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

}
