"auto";

const profile = require('profile1920.js');
const carrerCars = profile.carrer.cars;
const levelName = profile.mp.levelName;
const status = profile.mp.status;
const carPick = profile.mp.carPick;

const robot = require('robot.js');
const DEVICE = require('device.js');

var startTime = new Date().getTime();
var timer = new Date().getTime();

var lastLevel = 0;
var lastLevel2 = 5;
var lastCar   = 0;

DEVICE.checkPermission();

module.exports = {
    // 生涯
    carrer: {
        /**
         * 非循环部分
         */
        beforeRun() {
            var carrerFlag = false;
            // 判断是否从主页开始
            while (!carrerFlag) {
                switch(carrerCheckState()) {
                    // 是主页
                    case 1 : {
                        // toast(1)
                        // 点击生涯
                        robot.click(profile.carrer.carrerBlock.x, profile.carrer.carrerBlock.y);
                        sleep(1000);
                        robot.click(profile.carrer.carrerBlock.x, profile.carrer.carrerBlock.y);
                        sleep(3000);
                    
                        // 点击位置
                        robot.click(profile.carrer.careerPercent.x, profile.carrer.careerPercent.y);
                        sleep(2000);
                        // 选择关卡
                        robot.click(profile.carrer.euro.x, profile.carrer.euro.y);
                        sleep(1000);
                        carrerFlag = true;
                        break;
                    }
                    // 是Euro界面
                    case 3 : {
                        // toast(3)
                        carrerFlag = true;
                        break;
                    }
                    // 是结算界面
                    case 5 : {
                        // toast(5)
                        robot.back();
                        sleep(4000);
                        break;
                    }
                    // 否则模拟按下一次返回键
                    default : {
                        // toast("default")
                        robot.back();
                        sleep(8000);
                        break;
                    }
                }
            }
            // toastLog("The beforeRun() ends.");
        },

        /**
         * 选择关卡
         * @param {Number} counter_carrer 已完成的生涯比赛次数
         */
        chooseMode() {
            
            sleep(1000);
            profile.carrer.swipeScreen();

            // toastLog("请在此处截图,截图时不要滑动屏幕");
            // exit();
            sleep(1000);
            // 选择第12关
            robot.click(profile.carrer.block12.x, profile.carrer.block12.y);
            sleep(2000);

            // 继续
            robot.click(profile.carrer.goldenPoint.x, profile.carrer.goldenPoint.y);
            // toastLog("The chooseMode() ends.");
            sleep(2000);
        },

        /**
         * 选车
         */
        chooseCar() {
            for (let i = 0; i < carrerCars.length; i++) {
                let n = carrerCars[i];
                // toastLog(n);
                var carPoint = {
                    x: profile.carrer.firstCar.x + profile.carrer.distance.x * parseInt((n - 1) / 2),
                    y: profile.carrer.firstCar.y + profile.carrer.distance.y * ((n - 1) % 2)
                }
                // toastLog(carPoint.x + "," + carPoint.y);
                var img = captureScreen();
                var carcheckState = images.pixel(img, carPoint.x, carPoint.y);
                // toastLog(colors.toString(carcheckState));

                if (colors.equals(carcheckState, "#ffc3fb12")) {
                    robot.click(carPoint.x - profile.carrer.distance.x / 2, carPoint.y - profile.carrer.distance.y / 2);
                    break;
                }
            }
            sleep(4000);
            // 开始
            robot.click(profile.carrer.goldenPoint.x, profile.carrer.goldenPoint.y);
            // toastLog("The chooseCar() ends.");
            sleep(6000);    
        },

        /**
         * 完成每局比赛之后的结算
         * @param {Number} counter_carrer 已完成的生涯比赛次数 
         */
        run(counter_carrer) {
            
            // 检查是否已经到达结算界面
            while (true) {
                if (carrerCheckState() == 5) {
                    break;
                }
                // 若未跑完,则点击氮气
                else {
                    robot.click(profile.carrer.width * 4 / 5, profile.carrer.height / 2);
                    sleep(1000);
                    // toastLog("isNext ?= " + checkState());
                }
            }
            toastLog(++counter_carrer + "场比赛已完成");
        }
    },

    // 多人
    mp: {
        /**
         * 非循环部分
         */
        beforeRun() {
            var Flag = false;
            // 判断是否是否已经到达开始界面
            while (!Flag){
                var mpStatus = mpCheckState();
                if (mpStatus != -1) {
                    timer = new Date().getTime();
                }
                else {
                    var now = new Date().getTime();
                    if ((now - timer) > 300000) {
                        toastLog("blocked!restart!");
                        timer = new Date().getTime();
                        restart();
                    }
                }

                switch(mpStatus){
                    case 0: {
                        toast('home');
                        if (true) {
                            robot.click(profile.mp.homeup.x, profile.mp.homeup.y);
                        } else {
                            robot.click(profile.mp.homedown.x, profile.mp.homedown.y);
                        }
                        sleep(2000);
                        break;
                    }
                    // error
             	    case -2: {
			    toastLog('error');
	              	    robot.back();
	                    sleep(1000);                           
                 	    break;            
                    } 
                    case 2: {
                        robot.click(profile.mp.multiplayer.x, profile.mp.multiplayer.y);
                        sleep(1000);
                        break;
                        }                    // 游戏主界面
                    case 1: {
                        // 点击多人按钮
                        toast('index');
                        robot.click(profile.mp.multiplayer.x, profile.mp.multiplayer.y);
                        sleep(4000);
                        break;
                    }
                    // 多人开始界面
                    case 3: {
                        toast('start');
                        Flag = true;
                        break;
                    }
                    // 结算界面
                    case 5: {
                        toast('result');
                        robot.back();
                        sleep(3950);
                        break;
                    }
                    // 打满了 5 / 10 / 20 个奖杯
                    case 7: {
                        toast('claim');
                       // log('claim');
                        robot.click(profile.mp.claim.x, profile.mp.claim.y);
                        sleep(2000);
                        break;
                    }
                    // 否则暂时停止运行
                    default: {
                        toast('default');
                        robot.back();
                        sleep(5950);
                    }
                        
                }
                sleep(100);
            }
        },

        /**
         * 选车
         */
        chooseCar() {
            robot.click(profile.mp.start.x, profile.mp.start.y);
            sleep(4000);
            var FOUND = false;
            /*if (lastLevel != -1) {
                if (hasFuel(levelName[lastLevel])){
                    FOUND = true;
                }
            }*/

            // TODO  先验证上一次使用的车是否有油

            // 依次选车
            for (let i = 0; i < 5 && !FOUND; i++){
                if (status[i]){
                    if (hasFuel(levelName[i])){
                        FOUND = true;
                        lastLevel = levelName[i];
                    }
                }
            }
            
            if (FOUND) {
                //toastLog("lastCar = " + lastCar + "lastLevel = " + lastLevel );
                // 找到有油的车
                sleep(4000);
                robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                toastLog('Loading')
                return true;
            }
            else {
                lastCar = undefined;
                lastLevel = undefined;      
                toastLog("\n全部车辆无油。\n");
                return false;
            }
        },

        /**
         * 完成每局比赛之后的结算
         * @param {number} counter_mp 已完成的多人比赛次数 
         */
        run(counter_mp) {
            var left = 0;
            var runTime = new Date().getTime();
            
            // 检查是否已经到达结算界面
            while (true) {
                var nowTime = new Date().getTime();
                if ((nowTime - runTime) > 600000) {
                    toastLog("blocked!restart!");
                    restart();
                }
                
                if (mpCheckState() != -1) {
                    break;
                }
                // 若未跑完仍可点击氮气
                else {
                    robot.click(profile.mp.width * 4 / 5, profile.mp.height / 2);
                    if (left == 5){
                        left = 0;
                        robot.click(profile.mp.width * 3 / 10, profile.mp.height / 2);
                        sleep(400);
                        robot.click(profile.mp.width * 3 / 10, profile.mp.height / 2);
                    }
                    sleep(950);
                    // toastLog("isNext ?= " + checkState());
                }
            }
            toastLog(++counter_mp + "场多人比赛已完成，平均用时" +parseInt((nowTime - startTime)/1000/counter_mp)+"秒。\n即将开始下一场比赛。");
            sleep(2000)
        }
    },

    // 多人2
    mp2: {
        goingHome() {
            while (1){
                var mpStatus = mpCheckState();
                if (mpStatus == 7) {
                robot.click(profile.mp.claim.x, profile.mp.claim.y);
                sleep(2000);
                continue;
                }
                if ((mpStatus == 1) || (mpStatus == 0)) {
                    break;
                }
                else {
                    sleep(2000);
                    robot.back();
                }    
            }                
            toastLog("goingHome!"); 
        },
        /**
         * 非循环部分
         */
        beforeRun() {
            var Flag = false;
            // 判断是否是否已经到达开始界面
            while (!Flag){
                var mpStatus = mpCheckState();
                if (mpStatus != -1) {
                    timer = new Date().getTime();
                }
                else {
                    var now = new Date().getTime();
                    if ((now - timer) > 300000) {
                        toastLog("blocked!restart!");
                        timer = new Date().getTime();
                        restart();
                    }
                }
                
                switch(mpStatus){
                    case 0: {
                        toast('home');
                        robot.click(profile.mp.homedown.x, profile.mp.homedown.y);
                        sleep(2000);
                        break;
                    }
                   	// error
             		case -2: {
                 		toastLog('error');
	              	    robot.back();
	                    sleep(1000);                           
                 		break;            
                    } 

                    // 单个多人
                    case 2: {
                        robot.click(profile.mp.multiplayer.x, profile.mp.multiplayer.y);
                        sleep(1000);
                        break;
                    }
                        // 游戏主界面
                    case 1: {
                        // 点击多人按钮
                        toast('index');
                        robot.click(profile.mp.multiplayer.x, profile.mp.multiplayer.y);
                        sleep(4000);
                        break;
                    }
                        // 多人开始界面
                    case 3: {
                        toast('start');
                        Flag = true;
                        break;
                    }
                        // 结算界面
                    case 5: {
                        toast('result');
                        robot.back();
                        sleep(3950);
                        break;
                    }
                        // 打满了 5 / 10 / 20 个奖杯
                    case 7: {
                        toast('claim');
                        // log('claim');
                        robot.click(profile.mp.claim.x, profile.mp.claim.y);
                        sleep(2000);
                        break;
                    }
                        // 否则暂时停止运行
                    default: {
                        toast('default');
                        robot.back();
                        sleep(5950);
                    }
                        
                }
                sleep(100);
            }
        },
        
        /**
         * 选车
         */
        chooseCar() {        
	/* 下方多人选车策略多变，所以此处有多个开关以供选择 */
	// 不用选车直接开始
	if (0) {
            robot.click(profile.mp.start.x, profile.mp.start.y);
            sleep(4000);
            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
            return true;
        }
	// 使用上一次的车
        if (0) {
            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
            sleep(2000);
            if (up)
                robot.click(1100, 450);
            else
                robot.click(1100, 850);
            sleep(2000);
            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
            return true;
        }    
	// 常规选车
        if (1) {
            robot.click(profile.mp.start.x, profile.mp.start.y);
            sleep(4000);
            var FOUND = false;
    
            for (let i = lastLevel2; i < 10 && !FOUND; i++){
                if (status[i]){
                    if (hasFuel(levelName[i])){
                        FOUND = true;
                        lastLevel2 = i;
                    }
                }
            }
            
            if (FOUND){
                // 找到有油的车
                sleep(4000);
                robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
                return true;
            }
            else {
                lastCar = 0;
                lastLevel2 = 5;      
    
                toastLog("\n无油。\nNo fuel.");
                return false;
            }
        }
    },      //end of chooseCar
            
        /**
         * 完成每局比赛之后的结算
         * @param {number} counter_mp 已完成的多人比赛次数
         */
        run(counter_mp) {
            var left = 0;
            var runTime = new Date().getTime();
            
            // 检查是否已经到达结算界面
            while (true) {
                var nowTime = new Date().getTime();
                if ((nowTime - runTime) > 600000) {
                    toastLog("blocked!restart!");
                    restart();
                }
                if (mpCheckState() != -1) {
                    break;
                }
                // 若未跑完仍可点击氮气
                else {
                    robot.click(profile.mp.width * 4 / 5, profile.mp.height / 2);
                    if (left == 5){
                        left = 0;
                        robot.click(profile.mp.width * 3 / 10, profile.mp.height / 2);
                        sleep(400);
                        robot.click(profile.mp.width * 3 / 10, profile.mp.height / 2);
                    }
                    sleep(950);
                    // toastLog("isNext ?= " + checkState());
                }
            }
            toastLog(++counter_mp + "场无人比赛已完成，平均用时" +parseInt((nowTime - startTime)/1000/counter_mp)+"秒。\n即将开始下一场比赛。");
        }
    },
    
    // CarHunt
    ch:{
        /**
         * 非循环部分, position=寻车赛事按钮的位置，0表示特殊赛事寻车
         */
        beforeRun(position) {
            var Flag = false;
            // 判断是否是否已经到达开始界面
            while (!Flag){
                var chStatus = chCheckState();
                if (chStatus != -1) {
                    timer = new Date().getTime();
                }
                else {
                    var now = new Date().getTime();
                    if ((now - timer) > 300000) {
                        toastLog("BLOCKED!\nRESTART!\n");
                        timer = new Date().getTime();
                        restart();
                    }
                }
                
                switch(chStatus){
                        // error
                    case -2: {
                        toastLog('error');
                        for (let j=0; j<1; j++) {
                            robot.back();
                            sleep(1000);
                        }
                        sleep(2000);
                        break;
                    }
    
                        // 游戏主界面
                    case 1: 
                    case 2: {
                    //  toast('index');                   
                    // 点击每日按钮
                    if (position != 0) {
                        robot.click(profile.mp.meiri.x, profile.mp.meiri.y);
                    }
                    else {
                    // 点击特殊按钮
                        robot.click(profile.mp.teshu.x, profile.mp.teshu.y);
                    }
                    sleep(1000);
                    break;
                    }
                        // 每日开始界面
                    case 3: 
                        toastLog('teshu');
                    
                        // 每日寻车
                        if (position != 0) {
                            // 寻车赛事按钮位置
                            var CarHuntX = 255 + 280 * position;
                            var CarHuntY = 1015;
                            robot.click(CarHuntX, CarHuntY);
                        //   toast('start');
                            sleep(1000);
                            break;
                        }
                        // 特殊寻车
                        else {
                            swipes = 5;
                            // 右移377像素
                            for(let j = 0; j < swipes; j++) {
                                let dur = 700;
                                let slp = 2000;
                                sleep(slp);
                                toast("有意1次");
                                robot.swipe(800, 480, 1500, 480, dur);
                                sleep(slp);
                            }
                            
                            swipes = 3;
                
                            // 左移507像素
                            for(let j = 0; j < swipes; j++) {
                                let dur = 700;
                                let slp = 2000;
                                sleep(slp);
                                toast("作揖1次");
                                robot.swipe(1104, 480, 472, 480, dur);
                                sleep(slp);
                            }
                            
                            robot.click(profile.mp.width / 2, profile.mp.height / 2);
                            sleep(1000);
                            break;
                        }    
                        // 寻车开始界面
                    case 5: {
                        toast('carHunt');
                        sleep(2000);
                        Flag = true;
                        break;
                    }
                        // 否则暂时停止运行
                    default: {
                        toast('default');
                        robot.back();
                        sleep(5950);
                    }
                        
                }
                sleep(100);
            }
        },
        
        /**
         * 选车 
         * 利用最近一次使用的车辆会在屏幕中央的特性，不使用复杂的选车策略，
         * 请选择5个油、能够自动完成比赛并获得奖励的车，并在脚本运行前用该车辆跑一次，然后补满油
         * up参数为上/下车辆选择
         */
        
        chooseCar(up) {
            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
            sleep(2000);
            if (up)
                robot.click(1100, 450);
            else
                robot.click(1100, 850);
            sleep(2000);
            robot.click(profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
            return true;
        },
        
        /**
         * 完成每局比赛之后的结算
         * @param {number} counter_mp 已完成的多人比赛次数
         */
        run(counter_mp) {
            var left = 0;
            
            // 检查是否已经到达结算界面
            while (true) {
                if (mpCheckState() != -1) {
                    break;
                }
                // 若未跑完仍可点击氮气
                else {
                    robot.click(profile.mp.width * 4 / 5, profile.mp.height / 2);
                    if (left == 5){
                        left = 0;
                        robot.click(profile.mp.width * 3 / 10, profile.mp.height / 2);
                        sleep(400);
                        robot.click(profile.mp.width * 3 / 10, profile.mp.height / 2);
                    }
                    sleep(950);
                    // toastLog("isNext ?= " + checkState());
                }
            }
            toastLog(++counter_mp + "场寻车比赛已完成，即将开始下一场比赛。");
        }
}
    
}
/**
 * 控制完成一个段位的选车
 * @param {string} level 段位
 */
function hasFuel(level) {
    // log('checkFuel(' + level + ')');
    var cars;
    var carFuel;
    var levelPoint;
    // 给cars[]赋值
    switch(level) {

        case 'legend': {
            cars = carPick.legend;
            levelPoint = {
                x : profile.mp.legend.x,
                y : profile.mp.legend.y
            };
            break;
        }

        case 'platinum': {
            cars = carPick.platinum;
            levelPoint = {
                x : profile.mp.platinum.x,
                y : profile.mp.platinum.y
            };
            break;
        }

        case 'gold': {
            cars = carPick.gold;
            levelPoint = {
                x : profile.mp.gold.x,
                y : profile.mp.gold.y
            };
            break;
        }

        case 'silver': {
            cars = carPick.silver;
            levelPoint = {
                x : profile.mp.silver.x,
                y : profile.mp.silver.y
            };
            break;
        }

        case 'bronze': {
            cars = carPick.bronze;
            levelPoint = {
                x : profile.mp.bronze.x,
                y : profile.mp.bronze.y
            };
            break;
        }

        default: {
            cars = [4, 3, 2, 1];
            levelPoint = {
                x : profile.mp.bronze.x,
                y : profile.mp.bronze.y
            };
        }

    }
    robot.click(levelPoint.x, levelPoint.y);
    sleep(2000);
    toastLog('开始扫描' + level + '段位车辆');
    carFuel = scanFuel(cars);
    // log(carFuel);
    toastLog(level + '段位车辆扫描完成');
    var theCar = compareFuel(cars, carFuel);
    if(theCar == -1) {
        toastLog(level + '段位车辆全部无油');
        return false;
    } else {
        toastLog('\n' + level + '段位第' + theCar + '号车辆有油\n正在选取该车');
        lastCar = theCar;
        robot.click(levelPoint.x, levelPoint.y);
        sleep(2000)
        horizontalSwipe( parseInt( (theCar-1) / 2 ) );
        robot.click(profile.mp.firstCar.x, profile.mp.firstCar.y + parseInt( (theCar - 1) % 2 ) * profile.mp.distance.y);
        return true;
    }
}

/**
 * 扫描用户所选的车辆
 * @param {array} cars 用户自定义的选车数组
 */
function scanFuel(cars) {

    // 最靠后的车辆
    var maxCar = cars.reduce((a, b) => {
        return a > b ? a : b
    });
    var maxSwipes = parseInt( (maxCar-1) / 2 );
    // log('maxSwipes ' + maxSwipes)
    // 最靠前的车辆序号
    minCar = cars.reduce((a, b) => {
        return a < b ? a : b
    });
    var minSwipes = parseInt( (minCar-1) / 2 );
    // log('minSwipes ' + minSwipes)
    // 有几次整个屏幕（三列）
    var threeCol = parseInt( (maxSwipes - minSwipes + 1) / 3 );
    // log('3col ' + threeCol)
    // 有几个单列
    var oneCol = (maxSwipes - minSwipes + 1) % 3;
    // log('1col ' + oneCol)
    // 建立油量数组
    var carFuel = new Array(maxCar);

    // 先滑动最小的次数
    toast('滑动最小次数');
    horizontalSwipe(minSwipes);
    // 记录扫描进度
    var carNum = 2 * minSwipes;
    // 扫描三列
    for (let i = 0; i < threeCol; i++) {
        sleep(2000)
        for (let j = 1; j <= 6; j++) {
            carFuel[carNum + j] = judgeThisScreenFuel(j);
        }
        toast('滑动3列')
        horizontalSwipe(3);
        carNum += 6;
    }
    // 扫描单列
    for (let i = 0; i < oneCol; i++) {
        sleep(2000)
        for (let j = 1; j <= 2; j++) {
            carFuel[carNum + j] = judgeThisScreenFuel(j);
        }
        toast('滑动1列')
        horizontalSwipe(1);
        carNum += 2;
    }
    // log('Fuel(scanfuel)\n' + carFuel);
    // 返回油量表
    return carFuel;
}

/**
 * 对比用户的选择和实际情况，选择优先级最高的有油的车，返回是否找到
 * @param {array} cars 用户自定义的车辆使用数组
 * @param {array} carFuel 记录车辆有无油的数组
 */
function compareFuel(cars, carFuel) {
    for (let i = 0; i < cars.length; i++) {
        if(carFuel[cars[i]]) {
            return cars[i];
        }
    }
    return -1;
}

/**
 * 判断屏幕中具体车辆有油与否
 * @param {number} n 车辆编号
 */
function judgeThisScreenFuel(n) {
    var carPoint = {
        x: profile.mp.firstCar.x + profile.mp.distance.x * parseInt((n - 1) / 2),
        y: profile.mp.firstCar.y + profile.mp.distance.y * ((n - 1) % 2)
    }
    // toastLog(carPoint.x + "," + carPoint.y);
    var img = captureScreen();
    var carcheckState = images.pixel(img, carPoint.x, carPoint.y);
    // toastLog(colors.toString(carcheckState));

    if (colors.equals(carcheckState, "#ffc3fb12")) {
        return true;
    } else {
        return false;
    }
}

/**
 * 向左滑动指定列数
 * @param {number} swipes 列数
 */
function horizontalSwipe(swipes) {
    for(let i = 0; i < swipes; i++) {
        // toast("作揖1次");
        robot.swipe(1004, 480, 472, 480, 700);
        sleep(2000);
    }
}

/**
 * 生涯状态机
 */
function carrerCheckState() {
    var img = captureScreen();
    
    // 若干点的颜色值
    var token = images.pixel(img, profile.carrer.token.x, profile.carrer.token.y);
    var credit = images.pixel(img, profile.carrer.credit.x, profile.carrer.credit.y);
    var goldenPoint = images.pixel(img, profile.carrer.goldenPoint.x, profile.carrer.goldenPoint.y);
    var recommendedPoints = images.pixel(img, profile.carrer.recommendedPoints.x, profile.carrer.recommendedPoints.y);

    // 1 主页
    if (!colors.equals(goldenPoint, "#c3fb12") && colors.equals(token, "#0090ff") && colors.isSimilar(credit, "#ffc600", 2, "diff"))
        return 1;
    // 3 EURO
    if (colors.equals(recommendedPoints, "#c3fc0f") || colors.equals(recommendedPoints, "#ff0054"))
        return 3;
    // 5 结算
    if (colors.equals(goldenPoint, "#c3fb12") && !(colors.equals(recommendedPoints, "#c3fc0f") || colors.equals(recommendedPoints, "#ff0054")))
        return 5;
    /*
    toastLog("goldenPoint is " + colors.toString(goldenPoint));
    toastLog("token is " + colors.toString(token));
    toastLog("credit is " + colors.toString(credit));
    toastLog("recommendedPoints is " + colors.toString(recommendedPoints));
    */
    return -1;
}

/**
 * 多人状态机
 */
function mpCheckState() {
    var state = -1;

    var img = captureScreen();
    
    // 代币
    var token = images.pixel(img, profile.mp.token.x, profile.mp.token.y);
    var isToken = colors.equals(token, "#0090ff") || colors.equals(token, "#0492fa") || colors.equals(token, "#0392fb") || colors.equals(token, "#0291fd");

    // 积分
    var credit = images.pixel(img, profile.mp.credit.x, profile.mp.credit.y);
    var isCredit = colors.equals(credit, "#ffc600");
    
    // 多人开始按钮
    var start = images.pixel(img, profile.mp.start.x, profile.mp.start.y);
    var isStart = colors.equals(start, "#c3fb12");

    // 继续按钮
    var next = images.pixel(img, profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
    var isNext = colors.equals(next, "#c3fb12");

    // 多人按钮
    var duoren = images.pixel(img, profile.mp.multiplayer.x, profile.mp.multiplayer.y);
    var isDuoren = colors.equals(duoren, "#ffffff");

    // 返回按钮
    var back = images.pixel(img, profile.mp.back.x, profile.mp.back.y);
    var backward = images.pixel(img, 51, 46);
    var isBack = (colors.equals(back, "#fffffe") || colors.equals(back, "#ffffff")) && colors.equals(backward, "#010101");
		
	// 领取5-10-20
    var claim1 = images.pixel(img, profile.mp.mpackage1.x, profile.mp.mpackage1.y);
    var claim2 = images.pixel(img, profile.mp.mpackage2.x, profile.mp.mpackage2.y);
    var isClaim = colors.equals(claim1, "#fa154f") && colors.equals(claim2, "#fa154f");

	// 多人选取
    var homeup = images.pixel(img, profile.mp.homeup.x, profile.mp.homeup.y);
    var isHomeup = colors.equals(homeup, "#ffffff");
    var homedown = images.pixel(img, profile.mp.homedown.x, profile.mp.homedown.y);
    var isHomedown = colors.equals(homedown, "#ffffff");

	// 各种出错
    var errorleft = images.pixel(img, profile.mp.errorleft.x, profile.mp.errorleft.y);
    var errorright = images.pixel(img, profile.mp.errorright.x, profile.mp.errorright.y);
    var iserror = colors.equals(errorleft, "#1c5ab2") && colors.equals(errorright, "#1c5ab2");

if (false) {
    var ds="";
    if (isToken)
        ds += "代币1.";
    if (isCredit)
        ds += "积分.";
    if (isStart)
        ds += "开始.";
    if (isNext)
        ds += "继续.";
    if (isToken)
        ds +="多人";
    else
        ds += colors.toString(token);

    toastLog(ds);
  }
        
    // -2 error
    if (iserror)
	    state = -2;
    // 0 Home
    else if (isToken && isCredit && !isBack && !isStart && !isClaim && isHomedown && isHomeup)
        state = 0;
    // 1 主页
    else if (isToken && isCredit && !isBack && !isDuoren && !isStart && !isClaim)
        state = 1;
    // 2 单个多人
    else if (isToken && isCredit && isDuoren && !isBack)
        state = 2;
    // 3 多人开始
    else if (isToken && isCredit && isBack && isStart)
        state = 3;
    // 5 结算
    else if (isNext && !isCredit && !isToken)
        state = 5;
    // 7 5/10/20奖杯包
    else if (isToken && isCredit && isClaim)
        state = 7;
    
    return state;
}

/**
 * 寻车状态机
 */
function chCheckState() {
    var state = -1;
    
    var img = captureScreen();
    
    // 代币
    var token = images.pixel(img, profile.mp.token.x, profile.mp.token.y);
    var isToken = colors.equals(token, "#0090ff") || colors.equals(token, "#0492fa") || colors.equals(token, "#0392fb") || colors.equals(token, "#0291fd");
    
    // 积分
    var credit = images.pixel(img, profile.mp.credit.x, profile.mp.credit.y);
    var isCredit = colors.equals(credit, "#ffc600");
    
    // 买票➕
    var everyday_duoren = images.pixel(img, 1817, 161);
    var everyday_teshu = images.pixel(img, 1817, 184);
    var isEveryday = colors.equals(everyday_duoren, "#c3fb12") || colors.equals(everyday_teshu, "#c3fb12") ;

    // 寻车赛事按钮位置
    var CarHuntX = 1320;
    var CarHuntY = 1015;
    var CarHunt = images.pixel(img, CarHuntX, CarHuntY);
    var isCarHunt = colors.equals(CarHunt, "#c3fb12");

    // 寻车开始按钮
    var next = images.pixel(img, profile.mp.goldenPoint.x, profile.mp.goldenPoint.y);
    var isNext = colors.equals(next, "#c3fb12");

    // 每日按钮
    var meiri = images.pixel(img, profile.mp.meiri.x, profile.mp.meiri.y);
    var isMeiri = colors.equals(meiri, "#ffffff");

    // 特殊按钮
    var teshu = images.pixel(img, profile.mp.teshu.x, profile.mp.teshu.y);
    var isTeshu = colors.equals(teshu, "#ffffff");
    
    // 返回按钮
    var back = images.pixel(img, profile.mp.back.x, profile.mp.back.y);
    var backward = images.pixel(img, 51, 46);
    var isBack = (colors.equals(back, "#fffffe") || colors.equals(back, "#ffffff")) && colors.equals(backward, "#010101");
    
    // 各种出错
    var errorleft = images.pixel(img, profile.mp.errorleft.x, profile.mp.errorleft.y);
    var errorright = images.pixel(img, profile.mp.errorright.x, profile.mp.errorright.y);
    var iserror = colors.equals(errorleft, "#1c5ab2") && colors.equals(errorright, "#1c5ab2");
    
     if (0) {
     var ds="";
     if (isCredit)
     ds += "Cre";
     if (isToken)
     ds += "Tok";
     if (isBack)
     ds += "Back";
     if (isNext)
     ds += "next";
     if (isEveryday)
     ds += "everyday";
     else
     ds += colors.toString(everyday_duoren);
     
     toastLog(ds);
     }
     
    // 2 error
    if (iserror)
        state = -2;
    // 1 主页
    else if (isToken && isCredit && !isBack && !isEveryday && !isNext)
        state = 1;
    // 2 特别赛事
    else if (isToken && isCredit && !isEveryday && isTeshu && isBack)
        state = 2;
    // 3 每日开始
    else if (isToken && isCredit && isBack && isEveryday && !isNext)
        state = 3;
    // 5 寻车开始
    else if (isToken && isCredit && isBack && isNext)
        state = 5;

    return state;
}

/**
 * 重启游戏
 */
function restart() {
    
    var c = 0;

    robot.home();

    sleep(1000);
    openAppSetting(getPackageName("极光"));

    while(!click("结束运行")) {
        if (c++ > 3) {
            toastLog("kill V timeout!");
            break;
        }
        sleep(5000);
    //    toastLog("waiting...endv");
    }

    sleep(500);
    while(!click("确定")) {
        if (c++ > 3) {
            toastLog("confirm V timeout!");
            break;
        }
    //    toastLog("waiting...yesv");
        sleep(5000);
    }

    sleep(1000);
    robot.back();
        
    sleep(1000);
    openAppSetting(getPackageName("狂野飙车9"));
    while(!click("结束运行")) {
        if (c++ > 3) {
            toastLog("kill A timeout!");
            break;
        }
        sleep(5000);
    //    toastLog("waiting...enda");
        
    }

    sleep(500);
    while(!click("确定")) {
        if (c++ > 3) {
            toastLog("confirm A timeout!");
            break;
        }
    //    toastLog("waiting...yesa");
        sleep(5000);
    }

    sleep(1000);
    robot.back();

    // home
    for (let i=0; i<4; i++) {
    robot.home();
    sleep(1000);
    }

    click("极光");

    sleep(10000);

    while (!textContains("点击链接").exists()) {
        if (c++ > 3) break;
        sleep(5000);
    }

    click("点击连接");
        
    sleep(10000);    
    while (!textContains("轻触断开").exists()) {
        if (c++ > 3) break;
        sleep(5000);
    }

    sleep(1000);

    robot.home();

    sleep(2000);

    click("狂野飙车9");

    sleep(60000);

}
