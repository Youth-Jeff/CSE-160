class TrianglePrism{
    constructor(){
        this.type="cube";
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        
    }
    
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        // Front
        drawTriangle3D( [0.0,0.0,0.0, 0.5,1.0,0.5, 1.0,0.0,0.0] );
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        // Sides
        drawTriangle3D( [0.0,0.0,0.0, 0.5,1.0,0.5, 0.5,0,1] );
        drawTriangle3D( [1.0,0.0,0.0, 0.5,0.0,1.0, 0.5,1.0,0.5] );
        
        // Pass the color of a point to u_FragColor variable
        //Bottom
        drawTriangle3D( [0.0,0.0,0.0, 0.5,0.0,1.0, 1.0,0.0,0.0] );

    }
}