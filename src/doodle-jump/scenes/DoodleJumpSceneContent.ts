import { vec3 } from "gl-matrix";
import CameraRenderer from "../../engine/components/renderers/CameraRenderer";
import GameObject from "../../engine/gameobjects/GameObject";
import ISceneContent from "../../engine/scenes/ISceneContent";
import ImageLoader from "../../engine/webgl/textures/ImageLoader";
import TextureInfo from "../../engine/webgl/textures/TextureInfo";
import MeshRenderer from "../../engine/components/renderers/PremadeRenderer";
import ModelReaderFactory from "../../engine/webgl/factories/ModelReaderFactory";
import MeshType from "../../engine/webgl/shapes/MeshType";
import TextRenderer from "../../engine/components/renderers/TextRenderer";
import TextWriter from "../scores/TextWriter";
import ScoreManager from "../ScoreManager";
import BoxCollider from "../../engine/components/physics/BoxCollider";
import Rigidbody from "../../engine/components/physics/Rigidbody";

import Player from "../player/Player";
import Mesh from "../../engine/webgl/shapes/Mesh";
import MeshFactory from "../../engine/webgl/factories/MeshFactory";
import IGameSceneCollection from "../../engine/scenes/IGameSceneCollection";

abstract class DoodleJumpSceneContent implements ISceneContent{

    public sceneCollection: IGameSceneCollection;
    
    // Loaders
    protected imageLoader: ImageLoader;
    protected quad: Mesh;
    protected vectorArtTextureInfo: TextureInfo;


    // Assets base url
    protected ASSETS_BASE_URL = 'assets/images/doodle';
    protected ATLAS_URL = `${this.ASSETS_BASE_URL}/atlas`;
    protected ATLAS2_URL = `${this.ASSETS_BASE_URL}/atlas2`;
    protected ATLAS3_URL = `${this.ASSETS_BASE_URL}/atlas3`;
    protected AUDIO_URL = `${this.ASSETS_BASE_URL}/audio`;
    protected PLAYER_URL = `${this.ASSETS_BASE_URL}/player`;


    // Platform images
    protected PLATFORM0_URL = `${this.ATLAS_URL}/platform0.png`;
    protected PLATFORM1_URL = `${this.ATLAS_URL}/platform1.png`;
    protected PLATFORM2_URL = `${this.ATLAS_URL}/platform2.png`;
    protected PLATFORM_SHEET_02_URL = `${this.ATLAS_URL}/platformSheet_02.png`;
    protected PLATFORM_SHEET_03_URL = `${this.ATLAS_URL}/platformSheet_03.png`;
    protected PLATFORM_SHEET_04_URL = `${this.ATLAS_URL}/platformSheet_04.png`;
    protected PLATFORM3_URL = `${this.ATLAS_URL}/platform3.png`;

    // Background images
    protected BACKGROUND_URL = `${this.ATLAS2_URL}/background.png`;
    protected TOP_URL = `${this.ATLAS_URL}/top.png`;
    

    // Player images
    protected PLAYER_TILE_URL = `${this.PLAYER_URL}/tile000.png`;


    constructor(sceneCollection : IGameSceneCollection){
        this.sceneCollection = sceneCollection;

        let vectorArtTextureInfo = new TextureInfo(true, WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.CLAMP_TO_EDGE, WebGLRenderingContext.CLAMP_TO_EDGE,
            WebGLRenderingContext.LINEAR, WebGLRenderingContext.LINEAR);
        this.vectorArtTextureInfo = vectorArtTextureInfo;

        // Create factory
        let objectFactory = new ModelReaderFactory();
        let shapeFactory = new MeshFactory();
        
        // Create quad
        let quad = shapeFactory.createMesh(MeshType.Quad);
        this.quad = quad;
        
        
        // Load images
        let imageLoader = new ImageLoader();
        this.imageLoader = imageLoader;
    }

    public abstract download(): Promise<any>[] ;
    
    public abstract create(): GameObject[] ;
    

    protected downloadPlayerImages(): Promise<any>[]{
        let promises: Promise<any>[] = [];
        promises.push(this.imageLoader.loadImageFromUrls(this.PLAYER_TILE_URL));
        return promises;
    }

    protected downloadBackgroundImage(): Promise<any>[]{
        let promises: Promise<any>[] = [];
        promises.push(this.imageLoader.loadImageFromUrls(this.BACKGROUND_URL));
        return promises;
    }

    protected downloadScorePanelImage(): Promise<any>[]{
        let promises: Promise<any>[] = [];
        promises.push(this.imageLoader.loadImageFromUrls(this.TOP_URL));
        return promises;
    }

    protected createCamera(): GameObject{
        // Add Camera
        let camera = new GameObject('Camera');

        vec3.set(camera.transform.position, 0, 0, 55);
        vec3.set(camera.transform.rotation, 0, 0, 0);
        vec3.set(camera.transform.scale, 1, 1, 1);
        
        camera.addComponent(new CameraRenderer());

        return camera;
    }

    protected createBackground(): GameObject{

        // Add Background
        let paperBackground = new GameObject('Background 1');
        
        vec3.set(paperBackground.transform.position, 0, 40, -65);
        vec3.set(paperBackground.transform.rotation, 0, 0, 0);
        vec3.set(paperBackground.transform.scale, 30, 80, 1);
        
        let paperBackgroundImageElements = this.imageLoader.getImageElements(this.BACKGROUND_URL);
        paperBackground.addComponent(new MeshRenderer( this.quad, paperBackgroundImageElements, this.vectorArtTextureInfo));

        return paperBackground;
    }

    protected createScorePanel(): GameObject{
        // Add UI
        let scoreText = new GameObject('Score Text');

        vec3.set(scoreText.transform.position, 0, 29, -50);
        vec3.set(scoreText.transform.scale, 30, 5, 1);
        let topImageElements = this.imageLoader.getImageElements(this.TOP_URL);
        scoreText.addComponent(new MeshRenderer(this.quad, topImageElements, this.vectorArtTextureInfo));
        
        let textRenderer = new TextRenderer('Score: 0', 50, 40, 'black', '30px Arial');
        scoreText.addComponent(textRenderer);
        scoreText.addComponent(new TextWriter(textRenderer, () => {
            return ScoreManager.getInstance().getScore().toString();
        }))

        let fpstextRenderer = new TextRenderer('FPS: 0', 350, 40, 'black', '30px Arial');
        scoreText.addComponent(fpstextRenderer);
    
        let lastUpdateTime = Date.now();
        let frameCount = 0;
    
        scoreText.addComponent(new TextWriter(fpstextRenderer, () => {
            let currentTime = Date.now();
            let deltaTime = currentTime - lastUpdateTime;
    
            if (deltaTime >= 1000) {
                lastUpdateTime = currentTime;
                let fps = frameCount;
                frameCount = 0;
                return 'FPS: ' + fps;
            }
    
            frameCount++;
            return fpstextRenderer.getText();
        }));


        return scoreText;
    }


    protected createPlayer(): GameObject{
        
        // Add Player
        let playerGameObject = new GameObject("Player");

        vec3.set(playerGameObject.transform.position, 0, -20, 1);
        vec3.set(playerGameObject.transform.rotation, 0, 0, 0);
        vec3.set(playerGameObject.transform.scale, 4, 4, 1);
        playerGameObject.addComponent(new BoxCollider(false, 0, -0.5, 1, 0.25));
        playerGameObject.addComponent(new Rigidbody(1.1, 110))

        // Add Player Parts
        
        let playerHead = new GameObject("Player Head");
        playerHead.transform.setParent(playerGameObject.transform);
        
        let playerBack = new GameObject("Player Back");
        playerBack.transform.setParent(playerGameObject.transform);

        playerGameObject.addComponent(new Player(playerHead.transform, playerBack.transform));
        
        let playerImageElements = this.imageLoader.getImageElements(this.PLAYER_TILE_URL);
        playerHead.addComponent(new MeshRenderer(this.quad, playerImageElements, this.vectorArtTextureInfo));
        
        return playerGameObject;
    }

}

export default DoodleJumpSceneContent;