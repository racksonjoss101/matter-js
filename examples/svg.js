var Example = Example || {};

Example.svg = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Vertices = Matter.Vertices,
        Svg = Matter.Svg,
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
            height: Math.min(document.body.clientHeight, 1024)
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var svgs = [
        'iconmonstr-check-mark-8-icon', 
        'iconmonstr-paperclip-2-icon',
        'iconmonstr-puzzle-icon',
        'iconmonstr-user-icon'
    ];

    for (var i = 0; i < svgs.length; i += 1) {
        (function(i) {
            $.get('./svg/' + svgs[i] + '.svg').done(function(data) {
                var vertexSets = [],
                    color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

                $(data).find('path').each(function(i, path) {
                    var points = Svg.pathToVertices(path, 30);
                    vertexSets.push(Vertices.scale(points, 0.4, 0.4));
                });

                World.add(world, Bodies.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
                    render: {
                        fillStyle: color,
                        strokeStyle: color
                    }
                }, true));
            });
        })(i);
    }

    $.get('./svg/svg.svg').done(function(data) {
        var vertexSets = [],
            color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

        $(data).find('path').each(function(i, path) {
            vertexSets.push(Svg.pathToVertices(path, 30));
        });

        World.add(world, Bodies.fromVertices(400, 80, vertexSets, {
            render: {
                fillStyle: color,
                strokeStyle: color
            }
        }, true));
    });

    World.add(world, [
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

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