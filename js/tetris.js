var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var current, currentX, currentY, currentBlk;
var stopflg;
var shapes = [
    [ 0, 0, 0, 0,
      0, 0, 0, 0,
      1, 1, 1, 1 ],
    [ 0, 0 ,0,
      1, 1, 1,
      1 ],
    [ 0, 0, 0,
      1, 1, 1,
      0, 0, 1],
    [ 0, 0, 0,
      1, 1, 0,
      1, 1],
    [ 0, 0, 0,
      1, 1, 0,
      0, 1, 1 ],
    [ 0, 0, 0,
      0, 1, 1,
      1, 1 ],
    [ 0, 1, 0,
      1, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 1, 1, 0,
      0, 0, 1, 0, 0,
      1, 1, 1, 1, 1],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 1, 0, 0, 0,
      0, 1, 0, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 1, 0, 0, 0, 1, 0,
      0, 1, 0, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 1, 0, 0, 0, 1, 0,
      0, 1, 0, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 1, 0, 0, 0,
      0, 1, 0, 1, 0, 1, 0, 1, 0 ],
];
var blks = [
    4,
    3,
    3,
    3,
    3,
    3,
    3,
    5,
    9
];

var colors = [
    'red',
    'blue', 
    'orange', 
    'yellow', 
    'green', 
    'magenta', 
    'cyan',
    'silver',
    'gold'
];

function newShape() {
    var id = Math.floor( Math.random() * blks.length );
    var shape = shapes[ id ];
    currentBlk=blks[id];

    console.log("id="+id);

    current = [];
    for ( var y = 0; y < currentBlk; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < currentBlk; ++x ) {
            var i = currentBlk * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    currentX = Math.floor(5-currentBlk/2);
    currentY = 0;
    
}

function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    else {
        freeze();
        clearLines();
        if (lose) {
            stopflg=true;
            return false;
        }    
        newShape();
    }
}

function freeze() {
    for ( var y = 0; y < currentBlk; ++y ) {
        for ( var x = 0; x < currentBlk; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
}

function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < currentBlk; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < currentBlk; ++x ) {
            newCurrent[ y ][ x ] = current[ currentBlk-1 - x ][ y ];
        }
    }

    return newCurrent;
}

function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var row = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                row = false;
                break;
            }
        }
        if ( row ) {
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
        }
    }
}

function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'rotate':
            if(stopflg) {
                newGame();
                break;
            }
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
    }
}

function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;



    for ( var y = 0; y < currentBlk; ++y ) {
        for ( var x = 0; x < currentBlk; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if (currentY == 0 && currentX == Math.floor(5-currentBlk/2) ) {
                        lose = true;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function newGame() {
    stopflg=false;
    clearInterval(interval);
    init();
    newShape();
    lose = false;
    interval = setInterval( tick, 1000 );
}

newGame();
