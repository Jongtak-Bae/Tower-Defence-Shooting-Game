AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        var el = this.el;
        document.body.addEventListener('mousedown', function () {



            el.emit('shoot');


        });
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
        el.addEventListener('hit', function () {
            var currentActiveBullet = gunShooter.getAttribute('shooter').activeBulletType;
            console.log(currentActiveBullet);

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

                    setTimeout(() => {
                        el.setAttribute('visible', 'false');
                    }, 1500);





                }



            } else {
                if (damagePoint > 1) {
                    newWidth = (damagePoint - 1) / healthPoint;
                    //console.log(newWidth);
                    damagePoint -= 3;
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

                    setTimeout(() => {
                        el.setAttribute('visible', 'false');
                    }, 1500);






                }


            }


        });



    }

});
AFRAME.registerComponent('gore-handler', {






    tick: function () {


        var el = this.el;
        var gore = document.querySelector('#gore');
        var currentEnemyPosition = el.object3D.position.z;
        var health = el.querySelector('#health-point');
        var enemyAlive = health.getAttribute('visible');
        var currentGoreFX = gore.getAttribute('material').opacity;

        if (currentEnemyPosition == 0 && enemyAlive) {
            //console.log(enemyAlive);
            
            el.setAttribute('animation-mixer', 'clip', 'attack');
            setTimeout(() => {
                gore.setAttribute('material', 'opacity', currentGoreFX + 0.1);

                //console.log(currentGoreFX);
            }, 2000);

        } else if (currentGoreFX > 0 && currentGoreFX < 1) {

            setTimeout(() => {
                gore.setAttribute('material', 'opacity', currentGoreFX - 0.1);

                //console.log(currentGoreFX);
            }, 2000);

        }




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

                console.log('roll');


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




                    console.log('if');
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

                    console.log('else');

                }
                dir = !dir;

            }






        }



        window.addEventListener('keydown', changeWeapon);



    }

});

/*
AFRAME.registerComponent('model-subset', {
      schema: {
    target: {default: '', type: 'selector'},
    name: {default: ''}
  },

    init: function () {
        var data = this.data;
        var el = this.el;
        var scene = this.el.sceneEl;

       data.target.addEventListener('model-loaded', function () {

            var clone = data.target.cloneNode(true);
         
            scene.appendChild(clone);


        });



    }



});*/


AFRAME.registerComponent('random-position', {
    init: function () {



        document.querySelector('a-scene').addEventListener('loaded', function () {


            console.log('loaded');
            var enemyGroup = document.querySelectorAll('.enemyGroup');


            for (var i = 0; i < enemyGroup.length; i++) {

                var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                var v = {
                    x: Math.floor(Math.random() * plusOrMinus * 50),
                    y: 0,
                    z: Math.floor(Math.random()  * 50),

                }



                var endPoint = {

                    x: 20 / Math.sqrt(1 + v.z * v.z / v.x * v.x),
                    y: 0,
                    z: 0,
                }

                if (v.x < 0) {
                    endPoint.x = - endPoint.x;

                }

                enemyGroup[i].object3D.position.set(v.x, 0, -v.z);
                enemyGroup[i].setAttribute('animation', {property: 'position', to: ''+ endPoint.x +' 0 '+'0'+'', dur:''+v.z * 500, easing: 'linear'});
              
console.log(endPoint.x);

            }




        });






    }


});
