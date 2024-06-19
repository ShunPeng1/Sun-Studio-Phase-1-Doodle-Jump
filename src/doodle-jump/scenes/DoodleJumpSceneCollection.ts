import IGameSceneCollection from "../../engine/scenes/IGameSceneCollection";
import Scene from "../../engine/scenes/Scene";
import GameOverSceneContent from "./GameOverSceneContent";
import MainGameSceneContent from "./MainGameSceneContent";
import MenuSceneContent from "./MenuSceneContent";

class DoodleJumpSceneCollection implements IGameSceneCollection{
    private mainScene: Scene;
    private menuScene: Scene;
    private gameOverScene: Scene;

    public static MAIN_SCENE_NAME: string = 'main';
    public static MENU_SCENE_NAME: string = 'menu';
    public static GAME_OVER_SCENE_NAME: string = 'gameover';


    constructor(){
        this.menuScene = new Scene(DoodleJumpSceneCollection.MENU_SCENE_NAME, new MenuSceneContent(this));
        this.mainScene = new Scene(DoodleJumpSceneCollection.MAIN_SCENE_NAME, new MainGameSceneContent(this));
        this.gameOverScene = new Scene(DoodleJumpSceneCollection.GAME_OVER_SCENE_NAME, new GameOverSceneContent(this));
    }

    createScenes(): Scene[] {
        return [this.mainScene, this.menuScene, this.gameOverScene];
    }
    setStartScene(): Scene {
        return this.mainScene;
    }
}

export default DoodleJumpSceneCollection;