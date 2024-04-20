varying vec3 pointPosition;
const float PI = 3.14159265359;

//#83afff
const vec4 color1=vec4(0.5137254901960784,0.6862745098039216,1.0,1.0);
//#acd2ff
const vec4 color2=vec4(0.6745098039215687,0.8235294117647058,1.0,1.0);
//#054c7f
const vec4 color3=vec4(0.0196078431372549,0.2980392156862745,0.4980392156862745,1.0);
vec4 lerp(vec4 a, vec4 b, float t) {
    return a + (b - a) * t;
}
float lerp_undo(float a, float b, float t) {
    return (t - a) / (b - a);
}
void main(){
float a = sqrt(pointPosition.x*pointPosition.x + pointPosition.y*pointPosition.y);
float angle=atan(a, pointPosition.z);

if(angle<PI*0.5){
gl_FragColor = lerp(color1, color2, lerp_undo(0.0, PI*0.5, angle));
}else if(angle<PI*0.55){
gl_FragColor = lerp(color2, color3, lerp_undo(PI*0.5, PI*0.55, angle));
     }else{
gl_FragColor = color3;
}
}
