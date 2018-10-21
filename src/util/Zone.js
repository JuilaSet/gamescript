class Zone{
    constructor($option={}){
        this.position = $option.position || new Vector2d(0, 0);
        this.width = $option.width || 0;
        this.height = $option.height || 0;
    }

    check($position){
        let p = this.position;
        if(this.width == Infinity && p.x == -Infinity && $position.y > p.y && $position.y < this.height + p.y){
            return true;
        }else if(this.height == Infinity && p.y == -Infinity && $position.x > p.x && $position.x < this.width + p.x){
            return true;
        }else if(isNaN(this.height + p.y) || isNaN(this.height + p.y)){
            console.warn("zone calc meet NaN", this.width + p.x, this.height + p.y);
            return false;
        }else if(   $position.x > p.x && 
                    $position.y > p.y && 
                    $position.x < this.width + p.x && 
                    $position.y < this.height + p.y ){
            return true;
        }
        else{
            return false;
        }
    }
}
Zone.INFINITY_ZONE = new Zone({
    position: {x: -Infinity, y: -Infinity},
    width: Infinity,
    height: Infinity
});
Zone.INFINITY_ZONE.check = ()=>{
    return true;
}