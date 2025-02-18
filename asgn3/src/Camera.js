class Camera{
    constructor(){
        this.type = "camera";
        this.speed = 1;
        this.fov = 60.0;
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up= new Vector3([0,1,0]);
        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],       // eye
            this.at.elements[0], this.at.elements[1], this.at.elements[2],          // at
            this.up.elements[0], this.up.elements[1], this.up.elements[2]           // up
        );
        this.projMat = new Matrix4();
        this.projMat.setPerspective(
            this.fov,                       // Field of View
            canvas.width/canvas.height,     // Aspect Ratio
            0.1,                            // Near Clipping Plane
            1000                            // Far Clipping Plane
        );
    }
    
    moveForward(){
        // Compute forward vector f = at - eye
        let f = new Vector3([0,0,0]);
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);

        // Add forward vector to both eye and center: eye += f; at += f;
        this.eye.add(f);
        this.at.add(f);
        this.updateViewMat();
    }

    moveBackwards() {
        // Compute backward vector b = eye - at
        let b = new Vector3([0,0,0]);
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(this.speed);

        // Add forward vector to both eye and center: eye += b; at += b;
        this.eye.add(b);
        this.at.add(b);
        this.updateViewMat();
    }

    moveLeft() {
        // Compute forward vector f = at - eye
        let f = new Vector3([0,0,0]);
        f.set(this.at);
        f.sub(this.eye);

        // Compute side vector s = up x f (cross product between up and forward vectors)
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(this.speed);

        // Add side vector to both eye and center: eye += s; at += s;
        this.eye.add(s);
        this.at.add(s);
        this.updateViewMat();
    }

    moveRight() {
        // Compute forward vector f = at - eye
        let f = new Vector3([0,0,0]);
        f.set(this.at);
        f.sub(this.eye);

        // Compute side vector s = f x up (cross product between up and forward vectors)
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);

        // Add side vector to both eye and center: eye += s; at += s;
        this.eye.add(s);
        this.at.add(s);
        this.updateViewMat();
    }

    panLeft() {
        // Compute the forward vector f = at - eye
        let f = new Vector3([0,0,0]);
        f.set(this.at);
        f.sub(this.eye);

        // Rotate vector f by alpha (decide a value) degrees around the up vector
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rotationMatrix.multiplyVector3(f);

        // Update "at" vector to be at = eye + f_prime
        this.at.set(this.eye);
        this.at.add(f_prime);
        this.updateViewMat();
    }

    panRight() {
        // Compute the forward vector f = at - eye
        let f = new Vector3([0,0,0]);
        f.set(this.at);
        f.sub(this.eye);

        // Rotate vector f by -alpha (decide a value) degrees around the up vector
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rotationMatrix.multiplyVector3(f);

        // Update "at" vector to be at = eye + f_prime
        this.at.set(this.eye);
        this.at.add(f_prime);
        this.updateViewMat();
    }

    updateViewMat() {
        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],       // eye
            this.at.elements[0], this.at.elements[1], this.at.elements[2],          // at
            this.up.elements[0], this.up.elements[1], this.up.elements[2]           // up
        );
    }
}