import Canvas from "./webgl/Canvas";
import WebGLManager from "./webgl/WebGLManager";
import SceneManager from "./scenes/SceneManager";
import Scene from "./scenes/Scene";
import GameObject from "./scenes/GameObject";
import MeshRenderer from "./components/MeshRenderer";

class Game {
    private canvas: HTMLCanvasElement | null ;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private lastTime : number = 0;
    private deltaTime : number = 0;


    
    constructor() {
        // Create canvas  
        let canvas = new Canvas('game', 800, 600);
        this.canvas = canvas.createCanvas();
        
        // Create Managers
        this.webGLManager = new WebGLManager(this.canvas);
        this.sceneManager = new SceneManager();

        // Initialize game scene
        this.initializeGameScene();

        
        this.startGameLoop();
    }
   
    private initializeGameScene() {
        // TOOO: Add your implementation here
        let mainScene = new Scene('main');

        let testGameObject = new GameObject('Test Object');
        testGameObject.addComponent(new MeshRenderer(this.webGLManager, 'assets/models/chicken/chicken.json', 'assets/models/chicken/chicken.png',
            true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.NEAREST, WebGLRenderingContext.NEAREST
        ));
        mainScene.addGameObject(testGameObject);

        this.sceneManager.addScene(mainScene);
        
    }

    private startGameLoop() {
        // Load the main scene
        this.sceneManager.loadSceneByName('main');

        window.addEventListener('keydown', (event) => {
            this.processInput(event.key);
        });

        // Start the game loop
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }


    private gameLoop = () : void => {
        let time = performance.now();
        this.deltaTime = time - this.lastTime;
        

        this.update(time, this.deltaTime);
        this.render(time, this.deltaTime);
        
        requestAnimationFrame(this.gameLoop);
    }

    private processInput(key: string) {
        // Get input
        
        console.log(key);
        
    }

    private update(time: number, deltaTime : number) : void {
        // Update game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.update(time, deltaTime);
            });
        }

        return;
    }

    private render(time: number, deltaTime : number) : void {
        // Clear the screen
        this.webGLManager.clearScreen();

        this.webGLManager.render(time, deltaTime);

        // Render game objects
        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.render(time, deltaTime);
            });
        }

        return;
        
    }

}

new Game()
