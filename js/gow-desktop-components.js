AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        var el = this.el;
        var data = this.data;
        var gunWrapper01 = document.querySelector('#gun-wrapper01');
        var gunWrapper02 = document.querySelector('#gun-wrapper02');
        var magazine01 = gunWrapper01.querySelectorAll('a-image');
        var magazine02 = gunWrapper02.querySelectorAll('a-image');

        var bulletNumber01 = 10;
        var bulletNumber02 = 5;

        var newWidth = magazine01[11].getAttribute('geometry').width;
        var shooter = document.querySelector('#gun-shooter');
        var flag = true;

        document.body.addEventListener('click', function () {




            if (flag) {


                if (bulletNumber01 > 0) {
                    el.emit('shoot');
                    magazine01[bulletNumber01].setAttribute('material', 'opacity', '0.2');

                    bulletNumber01 -= 1;

                } else {

                    setTimeout(() => {
                        bulletNumber01 = 10;
                        for (var i = 1; i < 11; i++) {
                            magazine01[i].setAttribute('material', 'opacity', '1');

                        }
                    }, 500);
                }



            } else {

                if (bulletNumber02 > 0) {
                    el.emit('shoot');

                    //console.log(bulletNumber02);
                    magazine02[6 - bulletNumber02].setAttribute('material', 'opacity', '0.2');


                    bulletNumber02 -= 1;

                } else {

                    setTimeout(() => {
                        bulletNumber02 = 5;
                        for (var i = 1; i < 6; i++) {
                            magazine02[i].setAttribute('material', 'opacity', '1');

                        }
                    }, 1000);
                }



            }


        });
        shooter.addEventListener('componentchanged', function (evt) {
            if (evt.detail.name === 'shooter') {

                flag = !flag;
                console.log(flag);
            }



        });


    }
});
AFRAME.registerComponent('start-game', {

    schema: {

        newBoss: {

            type: 'boolean',
            default: true
        }

    },
    init: function () {


        var startInfo = document.querySelector('#start-info');
        var sceneEl = document.querySelector('a-scene');
        var startButton = document.querySelector('#start-button');

        var health = document.querySelector('#health')
        var healthPoints = health.querySelectorAll('a-image')
        var sceneEl = document.querySelector('a-scene');
        var el = this.el;
        var scoreEl = document.querySelector('[score-handler]');
        this.eventHandlerFn = function () {



            el.setAttribute('start-game', 'newBoss', true);
            console.log(el.getAttribute('start-game').newBoss);

            console.log('hit');
            // hide start Info
            startInfo.setAttribute('visible', 'false'); //child enetity can not be detacted.
            el.setAttribute('visible', 'false');
            startInfo.object3D.position.set(0, 12, 0);
            // reset score
            scoreEl.setAttribute('score-handler', 'score', 0);

            // initialize enemies
            for (var i = 0; i < 5; i++) {

                var enemy = document.createElement('a-entity');
                enemy.setAttribute('mixin', 'enemy');
                enemy.setAttribute('class', 'enemyGroup');
                sceneEl.appendChild(enemy);
                var healthBg = document.createElement('a-plane');
                healthBg.setAttribute('mixin', 'health-bg');
                enemy.appendChild(healthBg);
                var healthPoint = document.createElement('a-entity');
                healthPoint.setAttribute('mixin', 'health-point');
                healthPoint.setAttribute('id', 'health-point');
                healthBg.appendChild(healthPoint);

                enemy.setAttribute('attack-handler', 'flag', true);
                // random position of enemies
                var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                var v = {
                    x: Math.floor(Math.random() * plusOrMinus * 10),
                    y: 0,
                    z: Math.floor(Math.random() * 40 + 10),

                }
                enemy.object3D.position.set(v.x, 0, -v.z);
                enemy.setAttribute('animation', {
                    property: 'position',
                    to: '' + v.x + ' 0 ' + '23' + '',
                    dur: '' + v.z * 8000,
                    easing: 'easeOutCubic'
                });
                setTimeout(() => { //add fly enemies

                    var flyEnemy = document.createElement('a-entity');
                    flyEnemy.setAttribute('mixin', 'fly-enemy');
                    flyEnemy.setAttribute('class', 'enemyGroup');
                    sceneEl.appendChild(flyEnemy);
                    var flyHealthBg = document.createElement('a-plane');
                    flyHealthBg.setAttribute('mixin', 'fly-health-bg');
                    flyEnemy.appendChild(flyHealthBg);
                    var flyHealthPoint = document.createElement('a-entity');
                    flyHealthPoint.setAttribute('mixin', 'fly-health-point');
                    flyHealthPoint.setAttribute('id', 'health-point');
                    flyHealthBg.appendChild(flyHealthPoint);

                    flyEnemy.setAttribute('attack-handler', 'flag', true);
                    // random position of enemies
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    var v = {
                        x: Math.floor(Math.random() * plusOrMinus * 10),
                        y: 0,
                        z: Math.floor(Math.random() * 40 + 10),

                    }
                    flyEnemy.object3D.position.set(v.x, 6, -v.z);
                    flyEnemy.setAttribute('animation', {
                        property: 'position',
                        to: '' + v.x + ' 6 ' + '23' + '',
                        dur: '' + v.z * 2000,
                        easing: 'easeOutCubic'
                    });
                }, 5000);



            }

            // full health
            health.setAttribute('health-check', 'damage', -1);

            //console.log(health);
            for (var i = 0; i < healthPoints.length; i++) {

                healthPoints[i].setAttribute('material', 'opacity', '1');
            }

            // enable add enemy
            sceneEl.setAttribute('add-enemy', 'enabled', true);
            el.emit('ready');

            el.removeEventListener('hit', this.eventHandlerFn);
        }


        el.addEventListener('hit', this.eventHandlerFn);









    },

    //add Boss
    update: function () {

        var sceneEl = document.querySelector('a-scene');

        setInterval(() => {

            if (this.data.newBoss) {
                //set enemy boss spider

                var enemyBoss = document.createElement('a-entity');
                enemyBoss.setAttribute('mixin', 'enemy-boss');
                enemyBoss.setAttribute('class', 'enemyBoss');
                enemyBoss.setAttribute('animation', {
                    property: 'position',
                    from: '0 0 -60',
                    to: '0 0 23',
                    dur: '50000',
                    easing: 'easeOutCubic'
                });
                //add sound
                enemyBoss.setAttribute('sound', {
                    src: '#spider-sound',
                    autoplay: true,
                    volume: 8
                });

                sceneEl.appendChild(enemyBoss);

                var enemyBossHealthBg = document.createElement('a-entity');

                enemyBossHealthBg.setAttribute('mixin', 'health-bg-boss');
                enemyBossHealthBg.setAttribute('id', 'enemy-boss-health-bg');
                enemyBossHealthBg.setAttribute('position', '0 50 0');
                enemyBossHealthBg.setAttribute('sound', {
                    src: '#boss-die-sound',
                    volume: 8,
                })

                enemyBoss.appendChild(enemyBossHealthBg);
                var enemyBossHealthPoint = document.createElement('a-entity');
                enemyBossHealthPoint.setAttribute('id', 'health-point-boss');
                enemyBossHealthPoint.setAttribute('mixin', 'health-point-boss');
                enemyBossHealthBg.appendChild(enemyBossHealthPoint);

                //console.log(el);   
            }









        }, 50000)
    }






});
AFRAME.registerComponent('hit-handler', {
    init: function () {
        var el = this.el;
        var health = el.querySelector('#health-point');
        var newWidth = 0;
        var healthPoint = el.getAttribute('target').healthPoints;
        var gunShooter = document.querySelector('#gun-shooter');
        var damagePoint = healthPoint;
        var healthCheck = document.querySelector('[health-check]');
        var sceneEl = document.querySelector('a-scene');
        var scoreEl = document.querySelector('[score-handler]')
        el.addEventListener('hit', function () {
            var currentActiveBullet = gunShooter.getAttribute('shooter').activeBulletType;
            //console.log(currentActiveBullet);

            if (currentActiveBullet === 'bullet01') {

                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint;
                    //console.log(newWidth);
                    damagePoint -= 1;
                    //console.log(damagePoint);
                    health.setAttribute('geometry', 'width', newWidth);
                    health.setAttribute('position', {
                        x: -(1 - newWidth) / 2,
                        y: 0,
                        z: 0.01

                    });
                } else {



                    el.setAttribute('animation-mixer', 'clip', 'death');
                    el.setAttribute('animation-mixer', 'loop', 'once');
                    health.setAttribute('visible', 'false');
                    el.components.sound.playSound();

                    //add score  
                    var score = scoreEl.getAttribute('score-handler').score;
                    score += 10;

                    scoreEl.setAttribute('score-handler', 'score', score);

                    setTimeout(() => {
                        el.parentNode.removeChild(el)
                        var newDeadEnemyNumber = sceneEl.getAttribute('add-enemy').deadEnemyNumber;
                        // console.log(newDeadEnemyNumber);
                        newDeadEnemyNumber += 1;
                        sceneEl.setAttribute('add-enemy', 'deadEnemyNumber', newDeadEnemyNumber);;





                        //console.log(el);

                    }, 1500);





                }



            } else {
                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint;
                    //console.log(newWidth);
                    damagePoint -= 5;
                    //console.log(damagePoint);
                    health.setAttribute('geometry', 'width', newWidth);
                    health.setAttribute('position', {
                        x: -(1 - newWidth) / 2,
                        y: 0,
                        z: 0.01

                    });
                } else {
                    el.setAttribute('animation-mixer', 'clip', 'death');
                    el.setAttribute('animation-mixer', 'loop', 'once');
                    health.setAttribute('visible', 'false');
                    //add score
                    var score = scoreEl.getAttribute('score-handler').score;
                    score += 10;

                    scoreEl.setAttribute('score-handler', 'score', score);

                    setTimeout(() => {
                        // el.setAttribute('visible', 'false');
                        el.parentNode.removeChild(el);
                        var newDeadEnemyNumber = sceneEl.getAttribute('add-enemy').deadEnemyNumber;
                        // console.log(newDeadEnemyNumber);
                        newDeadEnemyNumber += 1;
                        sceneEl.setAttribute('add-enemy', 'deadEnemyNumber', newDeadEnemyNumber);



                    }, 1500);







                }


            }


        });
        healthCheck.addEventListener('game-over', () => {
            el.parentNode.removeChild(el);

        });



    }

});
AFRAME.registerComponent('hit-handler-fly', {
    init: function () {
        var el = this.el;
        var health = el.querySelector('#health-point');
        var newWidth = 0;
        var healthPoint = el.getAttribute('target').healthPoints;
        var gunShooter = document.querySelector('#gun-shooter');
        var damagePoint = healthPoint;
        var healthCheck = document.querySelector('[health-check]');
        var sceneEl = document.querySelector('a-scene');
        var scoreEl = document.querySelector('[score-handler]')
        el.addEventListener('hit', function () {
            var currentActiveBullet = gunShooter.getAttribute('shooter').activeBulletType;
            //console.log(currentActiveBullet);

            if (currentActiveBullet === 'bullet01') {

                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint;
                    //console.log(newWidth);
                    damagePoint -= 1;
                    //console.log(damagePoint);
                    health.setAttribute('geometry', 'width', newWidth);
                    health.setAttribute('position', {
                        x: -(1 - newWidth) / 2,
                        y: 0,
                        z: 0.01

                    });
                } else {


                    el.components.sound.playSound();


                    //add score  
                    var score = scoreEl.getAttribute('score-handler').score;
                    score += 5;

                    scoreEl.setAttribute('score-handler', 'score', score);

                    el.setAttribute('visible', 'false');
                    setTimeout(() => {
                        el.parentNode.removeChild(el)
                        var newDeadEnemyNumber = sceneEl.getAttribute('add-enemy').deadEnemyNumber;
                        // console.log(newDeadEnemyNumber);
                        newDeadEnemyNumber += 1;
                        sceneEl.setAttribute('add-enemy', 'deadEnemyNumber', newDeadEnemyNumber);;





                        //console.log(el);

                    }, 1500);





                }



            } else {
                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint;
                    //console.log(newWidth);
                    damagePoint -= 5;
                    //console.log(damagePoint);
                    health.setAttribute('geometry', 'width', newWidth);
                    health.setAttribute('position', {
                        x: -(1 - newWidth) / 2,
                        y: 0,
                        z: 0.01

                    });
                } else {
                    el.components.sound.playSound();
                    //add score
                    var score = scoreEl.getAttribute('score-handler').score;
                    score += 10;

                    scoreEl.setAttribute('score-handler', 'score', score);
                    el.setAttribute('visible', 'false');
                    setTimeout(() => {

                        el.parentNode.removeChild(el);
                        var newDeadEnemyNumber = sceneEl.getAttribute('add-enemy').deadEnemyNumber;
                        // console.log(newDeadEnemyNumber);
                        newDeadEnemyNumber += 1;
                        sceneEl.setAttribute('add-enemy', 'deadEnemyNumber', newDeadEnemyNumber);



                    }, 1500);







                }


            }


        });
        healthCheck.addEventListener('game-over', () => {
            el.parentNode.removeChild(el);

        });



    }

});
AFRAME.registerComponent('hit-handler-boss', {
    init: function () {
        var el = this.el;
        var health = el.querySelector('#health-point-boss');
        var newWidth = 0;
        var healthPoint = el.getAttribute('target').healthPoints;
        var gunShooter = document.querySelector('#gun-shooter');
        var damagePoint = healthPoint;
        var sceneEl = document.querySelector('a-scene');
        var scoreEl = document.querySelector('[score-handler]')

        el.addEventListener('hit', function () {
            var currentActiveBullet = gunShooter.getAttribute('shooter').activeBulletType;
            //console.log(currentActiveBullet);


            if (currentActiveBullet === 'bullet01') {

                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint * 19;
                    //console.log(newWidth);
                    damagePoint -= 1;
                    //console.log(damagePoint);
                    health.setAttribute('geometry', 'width', newWidth);
                    health.setAttribute('position', {
                        x: -(19 - newWidth) / 2,
                        y: 0,
                        z: 1

                    });
                } else {
                    el.removeAttribute('animation-mixer');
                    el.removeAttribute('animation');

                    health.setAttribute('visible', 'false');
                    //add score
                    var score = scoreEl.getAttribute('score-handler').score;
                    score += 20;

                    scoreEl.setAttribute('score-handler', 'score', score);
                    //play dead sound

                    el.querySelector('#enemy-boss-health-bg').components.sound.playSound();


                    setTimeout(() => {

                        el.parentNode.removeChild(el);


                    }, 1500);





                }



            } else {
                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint * 19;
                    //console.log(newWidth);
                    damagePoint -= 3;
                    //console.log(damagePoint);
                    health.setAttribute('geometry', 'width', newWidth);
                    health.setAttribute('position', {
                        x: -(19 - newWidth) / 2,
                        y: 0,
                        z: 1

                    });
                } else {
                    el.removeAttribute('animation-mixer');
                    el.removeAttribute('animation');
                    health.setAttribute('visible', 'false');
                    //add score
                    var score = scoreEl.getAttribute('score-handler').score;
                    score += 20;

                    scoreEl.setAttribute('score-handler', 'score', score);
                    //play dead sound
                    el.querySelector('#enemy-boss-health-bg').components.sound.playSound();


                    setTimeout(() => {
                        el.parentNode.removeChild(el);

                    }, 1500);






                }


            }


        });



    }

});
AFRAME.registerComponent('sound-handler', {


    init: function () {
        var el = this.el;

        var gunSound01 = document.querySelector('#gun-sound01');
        el.addEventListener('shoot', function () {

            gunSound01.components.sound.playSound();




        });



    }
});
AFRAME.registerComponent('gun-animation-handler', {
    init: function () {
        var el = this.el;
        var gunWrapper = document.querySelector('#gun-wrapper01');

        el.addEventListener('shoot', () => {

            gunWrapper.setAttribute('animation-mixer', 'clip', 'Shoot');
            gunWrapper.setAttribute('animation-mixer', 'loop', 'once');

            setTimeout(() => {
                gunWrapper.removeAttribute('animation-mixer');
            }, 500);
        })


    }

});
AFRAME.registerComponent('change-weapon', {

    init: function () {

        var el = this.el;
        var dir = false;
        var gun01 = document.querySelector('#gun-wrapper01');
        var gun02 = document.querySelector('#gun-wrapper02');
        var gunShooter = document.querySelector('#gun-shooter');
        var gunSound = document.querySelector('#gun-sound01');
        var changeWeapon = function changeWeapon(e) {

            if (e.keyCode === 32) {




                if (dir) {
                    gun01.setAttribute('animation__1', 'enabled', 'ture');
                    gun01.setAttribute('animation__1', 'dir', 'reverse');
                    gun01.setAttribute('animation__2', 'enabled', 'ture');
                    gun01.setAttribute('animation__2', 'dir', 'reverse');

                    gun02.setAttribute('animation__1', 'enabled', 'ture');
                    gun02.setAttribute('animation__1', 'dir', 'reverse');
                    gun02.setAttribute('animation__2', 'enabled', 'ture');
                    gun02.setAttribute('animation__2', 'dir', 'reverse');
                    gunShooter.setAttribute('position', '0.15225 -0.06 -0.1');
                    gunShooter.setAttribute('shooter', 'activeBulletType', 'bullet01');
                    gunSound.setAttribute('sound', 'src', '#gun01-sound');





                } else {
                    gun01.setAttribute('animation__1', 'enabled', 'ture');
                    gun01.setAttribute('animation__1', 'dir', 'normal');
                    gun01.setAttribute('animation__2', 'enabled', 'ture');
                    gun01.setAttribute('animation__2', 'dir', 'normal');

                    gun02.setAttribute('animation__1', 'enabled', 'ture');
                    gun02.setAttribute('animation__1', 'dir', 'normal');
                    gun02.setAttribute('animation__2', 'enabled', 'ture');
                    gun02.setAttribute('animation__2', 'dir', 'normal');

                    gunShooter.setAttribute('position', '0.152 -0.08 -0.42');
                    gunShooter.setAttribute('shooter', 'activeBulletType', 'bullet02');
                    gunSound.setAttribute('sound', 'src', '#gun02-sound');



                }
                dir = !dir;

            }

        }



        window.addEventListener('keydown', changeWeapon);

    }

});
AFRAME.registerComponent('attack-handler', {


    schema: {
        flag: {
            type: 'boolean',
            default: true
        },

    },



    tick: function () {
        var sceneEl = document.querySelector('a-scene');


        if (this.data.flag) {


            var el = this.el;
            var data = this.data;
            var currentEnemyPosition = el.getAttribute('position');
            var enemyAlive = el.getAttribute('visible');

            var healthCheck = document.querySelector('[health-check]');



            if (currentEnemyPosition.z == 23 && enemyAlive) {


                el.parentNode.removeChild(el);
                var newDamage = healthCheck.getAttribute('health-check').damage;
                newDamage += 1;
                //console.log(newDamage);
                healthCheck.setAttribute('health-check', 'damage', newDamage);
                this.data.flag = !this.data.flag;

            }

        }



    }








});
AFRAME.registerComponent('health-check', {

    schema: {
        damage: {
            type: 'number',
            default: -1
        },

    },



    update: function () {

        var el = this.el;
        var health = document.querySelector('#health')
        var healthPoints = health.querySelectorAll('a-image');

        if (this.data.damage < 2 && this.data.damage >= 0) {
            healthPoints[this.data.damage].setAttribute('material', 'opacity', '0.2');
        } else if (this.data.damage == 2) {
            healthPoints[this.data.damage].setAttribute('material', 'opacity', '0.2');
            el.emit('game-over');
        }




    }

});
AFRAME.registerComponent('game-over', {

    init: function () {

        var el = this.el;
        var startInfo = document.querySelector('#start-info');
        var startButton = document.querySelector('#start-button');






        startButton.addEventListener('ready', () => {
            var healthCheck = document.querySelector('#health');

            healthCheck.addEventListener('game-over', () => {


                var newBoss = document.querySelector('[start-game]');

                // remove boss
                var enemyBoss = document.querySelector('.enemyBoss');
                enemyBoss.components.sound.stopSound();
                enemyBoss.parentNode.removeChild(enemyBoss);

                newBoss.setAttribute('start-game', 'newBoss', false);
                //healthCheck.removeAttribute('health-check');

                //stop add enemy

                el.setAttribute('add-enemy', 'enabled', false);




                // show startIn
                startInfo.setAttribute('visible', 'true');
                startInfo.object3D.position.set(0, 0, 0);
                startButton.setAttribute('visible', true);

                console.log('game over');


            })


        })


    }







});
AFRAME.registerComponent('add-enemy', {

    schema: {
        deadEnemyNumber: {
            type: 'number',
            default: 0
        },
        enabled: {

            type: 'boolean',
            default: false
        }

    },

    update: function () {
        var sceneEl = document.querySelector('a-scene');
        if (this.data.enabled) {

            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

            if (plusOrMinus == -1) {


                var enemy = document.createElement('a-entity');
                enemy.setAttribute('mixin', 'enemy');
                enemy.setAttribute('class', 'enemyGroup');
                sceneEl.appendChild(enemy);
                var healthBg = document.createElement('a-plane');
                healthBg.setAttribute('mixin', 'health-bg');
                enemy.appendChild(healthBg);
                var healthPoint = document.createElement('a-entity');
                healthPoint.setAttribute('mixin', 'health-point');
                healthPoint.setAttribute('id', 'health-point');
                healthBg.appendChild(healthPoint);

                enemy.setAttribute('attack-handler', 'flag', true);
                // random position of enemy
                var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                var v = {
                    x: Math.floor(Math.random() * plusOrMinus * 10),
                    y: 0,
                    z: Math.floor(Math.random() * 40 + 10),

                }
                enemy.object3D.position.set(v.x, 0, -v.z);
                enemy.setAttribute('animation', {
                    property: 'position',
                    to: '' + v.x + ' 0 ' + '23' + '',
                    dur: '' + v.z * 3000,
                    easing: 'linear'
                });
                console.log('addEnemy');



            } else {

                var flyEnemy = document.createElement('a-entity');
                flyEnemy.setAttribute('mixin', 'fly-enemy');
                flyEnemy.setAttribute('class', 'enemyGroup');
                sceneEl.appendChild(flyEnemy);
                var flyHealthBg = document.createElement('a-plane');
                flyHealthBg.setAttribute('mixin', 'fly-health-bg');
                flyEnemy.appendChild(flyHealthBg);
                var flyHealthPoint = document.createElement('a-entity');
                flyHealthPoint.setAttribute('mixin', 'fly-health-point');
                flyHealthPoint.setAttribute('id', 'health-point');
                flyHealthBg.appendChild(flyHealthPoint);

                flyEnemy.setAttribute('attack-handler', 'flag', true);
                // random position of enemies
                var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                var v = {
                    x: Math.floor(Math.random() * plusOrMinus * 10),
                    y: Math.floor(Math.random() * 4 + 10),
                    z: Math.floor(Math.random() * 40 + 10),

                }
                flyEnemy.object3D.position.set(v.x, 6, -v.z);
                flyEnemy.setAttribute('animation', {
                    property: 'position',
                    to: '' + v.x + ' 6 ' + '23' + '',
                    dur: '' + v.z * 1000,
                    easing: 'easeOutCubic'

                });


                console.log('add-fly-Enemy');






            }



        }
    }

});
AFRAME.registerComponent('score-handler', {

    schema: {
        score: {
            type: 'number',
            default: 0
        },
    },
    update: function () {
        var el = this.el;
        var score = this.data.score;
        el.setAttribute('text', 'value', score);
        console.log(score);

    }



});
