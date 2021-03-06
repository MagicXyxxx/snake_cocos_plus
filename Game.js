/*
	改动Game.js
	能移动，吃掉食物后不能增加节点
*/

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
		/*
		spRoker: {
            default: null,
            url: cc.Texture2D
        },
		
		spRokerCenter: {
            default: null,
            url: cc.Texture2D
        }
		*/
		spRoker: {
            default: null,
            type: cc.Sprite
        },
		
		spRokerCenter: {
            default: null,
            type: cc.Sprite
        }
		//*/
		
//		spRoker: cc.Sprite,
//      spRokerCenter: cc.Sprite
    },

    // use this for initialization
    onLoad: function () {
//		console.log("onLoad ...");
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化计分
        this.score = 0;
		
		this.spRoker.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

		
    },

    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Star').game = this;
        // 重置计时器
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
//        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        
		var maxY = this.groundY+this.node.height/2;
		var randY = cc.randomMinus1To1() * maxY;
		
		// 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    // called every frame
    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
		console.log("update ...");
    },

    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function () {
        //this.player.stopAllActions(); //停止 player 节点的跳跃动作
		//if (this.IsLoad === false)
		{
			cc.director.loadScene('game');
			//this.IsLoad = true;
		}
        
    },
	
	onTouchStart: function(event) {
		var touchPos = event.getLocation();
        var pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        var dir = this.getDirection(pos);
        console.log("start ...", dir);
        this.updateRokerCenterPos(pos);

		//console.log("start ...");
    },

    onTouchMove: function(event) {
		var touchPos = event.getLocation();
        var pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        var dir = this.getDirection(pos);
        console.log("move ...", dir);
        this.updateRokerCenterPos(pos);

		
		//console.log("move ...");
    },

    onTouchEnd: function(event) {
        console.log("end ...");
		this.updateRokerCenterPos(cc.v2(0, 0));

    },

    onTouchCancel: function(event) {
        console.log("cancel ...");
		this.updateRokerCenterPos(cc.v2(0, 0));
    },
	///*
	updateRokerCenterPos: function(pos) {
        this.spRokerCenter.node.setPosition(pos);
    },
	
	getDirection: function(pos) {
        var x = pos.x;
        var y = pos.y;
        if (x <= y && x > -y) {
            return cc.v2(0, 1);// 上
        } else if (x >= y && x < -y) {
            return cc.v2(0, -1);// 下
        } else if (x <= y && x < -y) {
            return cc.v2(-1, 0);// 左
        } else {
            return cc.v2(1, 0);// 右
        }
    }//*/

});
