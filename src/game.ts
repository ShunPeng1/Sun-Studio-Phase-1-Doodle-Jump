import CanvasManager from "./engine/canvas/CanvasManager";
import WebGLManager from "./engine/webgl/WebGLManager";
import SceneManager from "./engine/scenes/SceneManager";
import PhysicsManager from "./engine/physics/PhysicManager";
import Scene from "./engine/scenes/Scene";
import MainGameSceneContent from "./doodle-jump/scenes/MainGameSceneContent";
import GameOverSceneContent from "./doodle-jump/scenes/GameOverSceneContent";
import InputManager from "./engine/inputs/InputManager";
import MenuSceneContent from "./doodle-jump/scenes/MenuSceneContent";

class Game {
    // Time variables
    private lastTime : number = 0;
    private deltaTime : number = 0;
    private fixedDeltaTime : number = 1/60;
    private fixedLastTime : number = 0;

    // Managers
    private canvasManager: CanvasManager;
    private webGLManager: WebGLManager;
    private sceneManager: SceneManager;
    private physicsManager: PhysicsManager;
    private inputManager: InputManager;


    constructor() {
        // Create canvas  
        this.canvasManager = CanvasManager.createInstance(600, 800);
        
        // Create Managers

        this.webGLManager = WebGLManager.getInstance();
        this.sceneManager = SceneManager.getInstance();
        this.physicsManager = PhysicsManager.getInstance();
        this.inputManager = InputManager.getInstance();

        this.initialize();
        
    }

    public async initialize() {
        // Initialize game scene
        try {
            await this.initializeGameScene();
            // existing code...
        } catch (error) {
            console.error('Error initializing game scene:', error);
        }

    }
   
    private async initializeGameScene() {
        // TOOO: Add your scene here

        this.sceneManager.addScene(new Scene('menu', new MenuSceneContent()));
        this.sceneManager.addScene(new Scene('main', new MainGameSceneContent()));
        this.sceneManager.addScene(new Scene('gameover', new GameOverSceneContent()));
        // wait for all images to load

        this.sceneManager.setNextScene(this.sceneManager.getSceneByName('menu')!);

        await this.sceneManager.downloadScenesContent();

        this.startGameLoop();
    }

    private startGameLoop() {
        // Start the game loop
        this.lastTime = performance.now()/1000;
        this.fixedLastTime = this.lastTime;
        requestAnimationFrame(this.gameLoop);
    }


    private gameLoop = () : void => {
        this.sceneManager.loadNextScene();

        let time = performance.now()/1000;
        
        let deltaFixedTime = time - this.fixedLastTime;
        while (this.fixedDeltaTime <= deltaFixedTime) {
            this.fixedLastTime += this.fixedDeltaTime;
            this.fixedUpdate(this.fixedLastTime, this.fixedDeltaTime);
            deltaFixedTime -= this.fixedDeltaTime;
        }

        
        this.deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.update(time, this.deltaTime);
        this.render(time, this.deltaTime);
        
        requestAnimationFrame(this.gameLoop);
    }

    private fixedUpdate(fixedLastTime: number, fixedDeltaTime : number) : void {
        // Update game objects

        let currentSceneGameObjects = this.sceneManager.getCurrentScene()?.getGameObjects();
        
        if (currentSceneGameObjects) {
            currentSceneGameObjects.forEach(gameObject => {
                gameObject.fixedUpdate(fixedLastTime, fixedDeltaTime);
            });
        }

        this.physicsManager.checkCollisions();

        return;
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
        
        this.canvasManager.clearRect();
        this.webGLManager.clearScreen();

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
