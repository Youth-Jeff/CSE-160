class Cube{
    constructor(){
        this.type="cube";
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.cubeVerts32 = new Float32Array([
            0,0,0,   1,1,0,    1,0,0
            ,
            0,0,0,   0,1,0,    1,1,0
            ,
            0,1,0,   0,1,1,    1,1,1
            ,
            0,1,0,   1,1,1,    1,1,0
            ,
            0,0,0,   0,0,1,    1,0,1
            ,
            0,0,0,   1,0,1,    1,0,0
            ,
            0,0,0,   0,0,1,    0,1,1
            ,
            0,0,0,   0,1,1,    0,1,0
            ,
            1,0,0,   1,1,0,    1,1,1
            ,
            1,0,0,   1,1,1,    1,0,1
            ,
            0,0,1,   1,0,1,    1,1,1
            ,
            0,0,1,   1,1,1,    0,1,1
        ]);
        this.cubeVerts= [
            0,0,0,   1,1,0,    1,0,0
            ,
            0,0,0,   0,1,0,    1,1,0
            ,
            0,1,0,   0,1,1,    1,1,1
            ,
            0,1,0,   1,1,1,    1,1,0
            ,
            0,0,0,   0,0,1,    1,0,1
            ,
            0,0,0,   1,0,1,    1,0,0
            ,
            0,0,0,   0,0,1,    0,1,1
            ,
            0,0,0,   0,1,1,    0,1,0
            ,
            1,0,0,   1,1,0,    1,1,1
            ,
            1,0,0,   1,1,1,    1,0,1
            ,
            0,0,1,   1,0,1,    1,1,1
            ,
            0,0,1,   1,1,1,    0,1,1
        ];
        this.cubeUVs32= new Float32Array([
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0
        ]);

        this.cubeUVs= [
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0
        ];
    }
    
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // Front of cube
        drawTriangle3DUV( [0,0,0,   1,1,0,    1,0,0], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0,   0,1,0,    1,1,0], [0,0, 0,1, 1,1] );

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top
        drawTriangle3DUV( [0,1,0,   0,1,1,    1,1,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,1,0,   1,1,1,    1,1,0], [0,0, 1,1, 1,0] );
        // Bottom
        drawTriangle3DUV( [0,0,0,   0,0,1,    1,0,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,0,   1,0,1,    1,0,0], [0,0, 1,1, 1,0] );
        // Left
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3DUV( [0,0,0,   0,0,1,    0,1,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,0,   0,1,1,    0,1,0], [0,0, 1,1, 1,0] );
        // Right
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        drawTriangle3DUV( [1,0,0,   1,1,0,    1,1,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [1,0,0,   1,1,1,    1,0,1], [0,0, 1,1, 1,0] );
        // Back
        drawTriangle3DUV( [0,0,1,   1,0,1,    1,1,1], [0,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,1,   1,1,1,    0,1,1], [0,0, 1,1, 1,0] );
    }

    renderfast() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        var allverts = [];
        var allUVs = [];
        // Front of cube
        allverts=allverts.concat([0,0,0,   1,1,0,    1,0,0]);
        allUVs=allUVs.concat([0,0, 1,1, 1,0]);
        allverts=allverts.concat([0,0,0,   0,1,0,    1,1,0]);
        allUVs=allUVs.concat([0,0, 0,1, 1,1]);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top
        allverts=allverts.concat([0,1,0,   0,1,1,    1,1,1]);
        allUVs=allUVs.concat([0,0, 0,1, 1,1]);
        allverts=allverts.concat([0,1,0,   1,1,1,    1,1,0]);
        allUVs=allUVs.concat([0,0, 1,1, 1,0]);
        // Bottom
        allverts=allverts.concat([0,0,0,   0,0,1,    1,0,1]);
        allUVs=allUVs.concat([0,0, 0,1, 1,1]);
        allverts=allverts.concat([0,0,0,   1,0,1,    1,0,0]);
        allUVs=allUVs.concat([0,0, 1,1, 1,0]);
        // Left
        allverts=allverts.concat([0,0,0,   0,0,1,    0,1,1]);
        allUVs=allUVs.concat([0,0, 0,1, 1,1]);
        allverts=allverts.concat([0,0,0,   0,1,1,    0,1,0]);
        allUVs=allUVs.concat([0,0, 1,1, 1,0]);
        // Right
        allverts=allverts.concat([1,0,0,   1,1,0,    1,1,1]);
        allUVs=allUVs.concat([0,0, 0,1, 1,1]);
        allverts=allverts.concat([1,0,0,   1,1,1,    1,0,1]);
        allUVs=allUVs.concat([0,0, 1,1, 1,0]);
        // Back
        allverts=allverts.concat([0,0,1,   1,0,1,    1,1,1]);
        allUVs=allUVs.concat([0,0, 0,1, 1,1]);
        allverts=allverts.concat([0,0,1,   1,1,1,    0,1,1]);
        allUVs=allUVs.concat([0,0, 1,1, 1,0]);
        drawTriangle3DUV(allverts, allUVs);
    }

    renderfaster() {
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (g_vertexBuffer == null) {
            initTriangle3D();
        }

        gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW);

        if(g_textureBuffer == null) {
            initTextures3D();
        }
        
        gl.bufferData(gl.ARRAY_BUFFER, this.cubeUVs32, gl.DYNAMIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
        
    }
}