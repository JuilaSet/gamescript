/* 
 *  在地面上爬行的AI
 **/
class CrawlAI extends AI{
    constructor($option={}){
        super($option);
        this._crawlController = $option.crawlController || console.error('未指定控制器'); // crawlController对象
        this._aimUnit = $option.aimUnit;    // 一般是position属性
        this._timer = $option.timer || console.error('未指定计时对象');
        this._speed = $option.speed || 130;
        this._jumpActionMinSpeed = $option.jumpActionMinSpeed || 120;
        this._distance = $option.distance || 20;
        this._jumpT = $option.jumpRate || 125;
        this._jumpHeight = $option.jumpHeight || 90;
        this._wandering = $option.wandering==undefined?$option.wandering:true;// []][
        
        // private
        this._enableJump = true;
        this._enableDL = true;
    }
    get controller(){
        return this._crawlController;
    }

    set aimUnit($aimUnit){
        this._aimUnit = $aimUnit;
    }

    get aimUnit(){
        return this._aimUnit;
    }

    set jumpRate($jr){
        this._jumpT = $jr;
    }

    get jumpRate(){
        return this._jumpT;
    }

    setOnNear($func, $dis){
        if($dis){
            this._distance = $dis;
        }
        this.onNear = $func;
    }

    onNear(){
        this.defaultOnNear();
    }

    defaultOnNear(){
        this._crawlController.accLeft(0);
        this._crawlController.accRight(0);
    }

    setOnFar($func){
        this.onFar = $func;
    }

    onFar(){
        this.defaultOnFar();
    }

    defaultOnFar(){
        if(this._aimUnit.position.x < this._crawlController.position.x){
            this._crawlController.accLeft(this._speed);
            this._crawlController.accRight(0);
        }else{
            this._crawlController.accLeft(0);
            this._crawlController.accRight(this._speed);
        }
        if( Math.abs(this._aimUnit.position.x - this._crawlController.position.x) < this._distance &&
            this._aimUnit.position.y < this._crawlController.position.y - this._jumpHeight){
            if(this._enableDL){
                this._crawlController.jump(this._jumpHeight);
                this._enableDL = false;
                this._timer.callLater(()=>{
                    this._enableDL = true;
                }, Math.floor(this._jumpT));
            }
        }else if(Math.abs(this._crawlController.velocityX) < this._jumpActionMinSpeed){
            if(this._enableJump){
                this._crawlController.jump(this._jumpHeight);
                this._enableJump = false;
                this._timer.callLater(()=>{
                    this._enableJump = true;
                }, Math.floor(this._jumpT / 2));
            }
        }
    }

    // 行动 @Override
    action(){
        if(this._aimUnit){
            if(this._aimUnit.position.clone().sub(this._crawlController.position).length() < this._distance){
                this.onNear();
            }else{
                this. onFar();
            }
        }else{
            console.warn('无目的ai');
        }
    }

    // 
    update(){
        this.action();
    }
}