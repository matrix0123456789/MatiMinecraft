varying vec3 pointPosition;
void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    pointPosition = position.xyz;
}
