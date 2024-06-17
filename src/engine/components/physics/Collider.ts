import { EventEmitter } from 'events';

import Component from "../Component";
import PhysicManager from '../../physics/PhysicManager';
import Transform from '../Transform';

let idCounter = 0;

class Collider extends Component{
    public isTrigger : boolean = false;
    public onCollisionEvent: EventEmitter = new EventEmitter();
    public id: number;
    public isEnable: boolean = true;

    private COLLISION_ENTER = "Collision Enter";
    private COLLISION_STAY = "Collision Stay";
    private COLLISION_EXIT = "Collision Exit";
    
    constructor(isTrigger: boolean){
        super();
        this.id = idCounter++;
        this.isTrigger = isTrigger;
    }
    
    
    public awake(): void {
        PhysicManager.getInstance().addCollider(this);
    }
    

    public subcribeToCollisionEnter(callback: (other: Collider) => void) {
        this.onCollisionEvent.addListener(this.COLLISION_ENTER, callback);
    }

    public subcribeToCollisionStay(callback: (other: Collider) => void) {
        this.onCollisionEvent.addListener(this.COLLISION_STAY, callback);
    }

    public subcribeToCollisionExit(callback: (other: Collider) => void) {
        this.onCollisionEvent.addListener(this.COLLISION_EXIT,callback);
    }

    public unsubcribeToCollisionEnter(callback: (other: Collider) => void) {
        this.onCollisionEvent.removeListener(this.COLLISION_ENTER, callback);
    }

    public unsubcribeToCollisionStay(callback: (other: Collider) => void) {
        this.onCollisionEvent.removeListener(this.COLLISION_STAY, callback);
    }

    public unsubcribeToCollisionExit(callback: (other: Collider) => void) {
        this.onCollisionEvent.removeListener(this.COLLISION_EXIT, callback);
    }

    public invokeCollisionEnter(other: Collider) {
        this.onCollisionEvent.emit(this.COLLISION_ENTER, other);
    }

    public invokeCollisionStay(other: Collider) {
        this.onCollisionEvent.emit(this.COLLISION_STAY, other);
    }

    public invokeCollisionExit(other: Collider) {
        this.onCollisionEvent.emit(this.COLLISION_EXIT, other);
    }
    

    public collidesWith(other: Collider) : boolean {
        if (this.isEnable) {
            return false;
        }
        return false;
    }
    

    public clone(): Component {
        // Add your implementation here
        return new Collider(this.isTrigger);
    }

    public destroy(): void {
        PhysicManager.getInstance().removeCollider(this);
    }

}

export default Collider;