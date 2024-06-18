import WebGLManager from "../../webgl/WebGLManager";
import Shape from "../../webgl/shapes/Shape";
import ImageElements from "../../webgl/textures/ImageElements";
import TextureInfo from "../../webgl/textures/TextureInfo";
import Component from "../Component";
import WebglRenderer from "./Renderer";


class PrimativeRenderer extends WebglRenderer {



    public constructor(webgl : WebGLManager, shape: Shape, imageElements : ImageElements[], textureInfo : TextureInfo) {
        super(webgl);
    
        this.initializeShape(shape);

        this.initializeTexture(imageElements, textureInfo);


    }

    public clone(): Component {
        // Add your implementation here
        return new PrimativeRenderer(this.webgl, this.shape, this.imageElements, this.textureInfo);
    }

    public render(time: number, deltaTime : number) {
        if (this.shape === undefined) {
            return;
        }
        let gl = this.webgl.getGL();

        // Get the location of the transformation matrix uniform
        let modelMatrixUniformLocation = gl.getUniformLocation(this.webgl.getProgram(), 'mWorld');

        gl.uniformMatrix4fv(modelMatrixUniformLocation, false, this.transform.getWorldMatrix());

        // Unbind any previously bound texture
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Texture
        if (this.webglTextures) {
            let modelMatrixUniformLocation = gl.getUniformLocation(this.webgl.getProgram(), 'mTexScale');

            gl.uniform2fv(modelMatrixUniformLocation, this.transform.getXYScale());

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.webglTextures[this.renderingTextureIndex]);
            
        }


        // Set the transformation matrix
        this.shape.draw();
        

        // Unbind the texture
        if (this.webglTextures) {
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }
  
}

export default PrimativeRenderer;