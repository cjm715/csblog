var pred_prey = function(s) {

    var w;
    var columns;
    var rows;
    var board;
    var next;

    s.setup = function() {

        var canvasWidth = 400;
        var canvasHeight = 400;

        var canvasDiv = s.select('#canvasDiv-pp')
        var sketchDiv = s.select('#sketch-holder-pp')
        //sketchDiv.style('position: relative')
        canvas = s.createCanvas(canvasWidth, canvasHeight);
        //canvas = createCanvas(360, 360);
        canvas.parent(canvasDiv);
        //sketchDiv.style('width: ${canvasWidth}')

        w = 10;
        // Calculate columns and rows
        columns = s.floor(s.width / w);
        rows = s.floor(s.height / w);
        // Wacky way to make a 2D array is JS
        board = new Array(columns);
        for (var i = 0; i < columns; i++) {
            board[i] = new Array(rows);
        }
        // Going to use multiple 2D arrays and swap them
        next = new Array(columns);
        for (i = 0; i < columns; i++) {
            next[i] = new Array(rows);
        }
        s.init();
    }

    s.draw = function() {
        // s.background(34,139,34);
        // s.generate();
        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < rows; j++) {

                // if ((board[i][j] == 1)) s.fill(34,139,34);
                // else s.fill(255);
                s.fill(34,139,34)
                // s.stroke(255);
                s.rect(i * w, j * w, w - 1, w - 1);
            }
        }

    }

    // reset board when mouse is pressed
    s.mousePressed = function() {
        s.init();
    }

    // Fill board randomly
    s.init = function() {
        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < rows; j++) {
                // Lining the edges with 0s
                if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
                // Filling the rest randomly
                else board[i][j] = s.floor(s.random(2));
                next[i][j] = 0;
            }
        }
    }

    s.sheep = function() {

    }

    // The process of creating the new generation
    // s.generate = function() {

        // // Loop through every spot in our 2D array and check spots neighbors
        // for (var x = 1; x < columns - 1; x++) {
        //     for (var y = 1; y < rows - 1; y++) {
        //         // Add up all the states in a 3x3 surrounding grid
        //         var neighbors = 0;
        //         for (var i = -1; i <= 1; i++) {
        //             for (var j = -1; j <= 1; j++) {
        //                 neighbors += board[x + i][y + j];
        //             }
        //         }
        //
        //         // A little trick to subtract the current cell's state since
        //         // we added it in the above loop
        //         neighbors -= board[x][y];
        //         // Rules of Life
        //         if ((board[x][y] == 1) && (neighbors < 2)) next[x][y] = 0; // Loneliness
        //         else if ((board[x][y] == 1) && (neighbors > 3)) next[x][y] = 0; // Overpopulation
        //         else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1; // Reproduction
        //         else next[x][y] = board[x][y]; // Stasis
        //     }
        // }
        //
        // // Swap!
        // var temp = board;
        // board = next;
        // next = temp;
    }

// }

var myp5 = new p5(pred_prey);
