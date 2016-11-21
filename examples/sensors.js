var Example = Example || {};

Example.sensors = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Events = Matter.Events,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: Math.min(document.body.clientWidth, 1024),
            height: Math.min(document.body.clientHeight, 1024),
            wireframes: false,
            background: '#111'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var redColor = '#C44D58',
        greenColor = '#C7F464';

    var collider = Bodies.rectangle(400, 300, 500, 50, {
        isSensor: true,
        isStatic: true,
        render: {
            strokeStyle: redColor,
            fillStyle: 'transparent'
        }
    });

    World.add(world, [
        collider,
        Bodies.rectangle(400, 620, 800, 50, { 
            isStatic: true,
            render: {
                fillStyle: 'transparent'
            }
        })
    ]);

    World.add(world,
        Bodies.circle(400, 40, 30, {
            render: {
                strokeStyle: greenColor,
                fillStyle: 'transparent'
            }
        })
    );

    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
        
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];

            if (pair.bodyA === collider) {
                pair.bodyB.render.strokeStyle = redColor;
            } else if (pair.bodyB === collider) {
                pair.bodyA.render.strokeStyle = redColor;
            }
        }
    });

    Events.on(engine, 'collisionEnd', function(event) {
        var pairs = event.pairs;
        
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];

            if (pair.bodyA === collider) {
                pair.bodyB.render.strokeStyle = greenColor;
            } else if (pair.bodyB === collider) {
                pair.bodyA.render.strokeStyle = greenColor;
            }
        }
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, Composite.allBodies(world));

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};