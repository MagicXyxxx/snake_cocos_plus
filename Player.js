/*
	改动Player.js
*/

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        //jumpHeight: 0,
        // 主角跳跃持续时间
        //jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 跳跃音效资源
        //jumpAudio: {
        //    default: null,
        //    url: cc.AudioClip
        //},
    },

/*
    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
*/
    setInputControl: function () {
        var self = this;
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // set a flag when key pressed
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
						self.accup = false;
                        self.accdown = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
						self.accup = false;
                        self.accdown = false;
                        break;
					case cc.KEY.w:
                        self.accup = true;
                        self.accdown = false;
						self.accLeft = false;
                        self.accRight = false;
                        break;
					case cc.KEY.s:
                        self.accup = false;
                        self.accdown = true;
						self.accLeft = false;
                        self.accRight = false;
                        break;
                }
            },
            // unset a flag when key released
/*            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }*/
        }, self.node);
    },

    // use this for initialization
    onLoad: function () {
        // 初始化跳跃动作
        //this.jumpAction = this.setJumpAction();
        //this.node.runAction(this.jumpAction);

        // 加速度方向开关
		this.accup = false;
		this.accdown = false;
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
		this.ySpeed = 0;
		
        // 初始化键盘输入监听
        this.setInputControl();
    },

    // called every frame
    update: function (dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= 200;// * dt;
			this.ySpeed = 0;
        } else if (this.accRight) {
            this.xSpeed += 200;// * dt;
			this.ySpeed = 0;
        }
		if (this.accup) {//++
            this.ySpeed += 200;// * dt;
			this.xSpeed = 0;
        } else if (this.accdown) {//--
            this.ySpeed -= 200;// * dt;
			this.xSpeed = 0;
        }
        // 限制主角的速度不能超过最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        if ( Math.abs(this.ySpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.ySpeed = this.maxMoveSpeed * this.ySpeed / Math.abs(this.ySpeed);
        }

		
		
        // 根据当前速度更新主角的位置
		this.node.y += this.ySpeed * dt;
        this.node.x += this.xSpeed * dt;
    },
});
