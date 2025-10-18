document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('puzzle-board');
    const shuffleButton = document.getElementById('shuffle-button');
    const statusMessage = document.getElementById('status-message');
    const size = 3;
    let tiles = [];

    function initializeBoard() {
        tiles = [];
        for (let i = 1; i <= size * size - 1; i++) {
            tiles.push(i);
        }
        tiles.push(0); // 0 represents the empty tile
        render();
    }

    function render() {
        board.innerHTML = '';
        tiles.forEach(tileValue => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (tileValue === 0) {
                tile.classList.add('empty');
            } else {
                tile.textContent = tileValue;
                tile.addEventListener('click', () => handleTileClick(tileValue));
            }
            board.appendChild(tile);
        });
    }

    function handleTileClick(tileValue) {
        const emptyIndex = tiles.indexOf(0);
        const tileIndex = tiles.indexOf(tileValue);
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;
        const tileRow = Math.floor(tileIndex / size);
        const tileCol = tileIndex % size;

        // Check if the tile is adjacent to the empty space
        if (
            (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
            (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)
        ) {
            swapTiles(emptyIndex, tileIndex);
            if (isSolved()) {
                endGame();
            }
        }
    }

    function swapTiles(index1, index2) {
        [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];
        render();
    }

    function shuffleTiles() {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            swapTiles(i, j);
        }
        // Ensure the shuffled puzzle is solvable
        if (!isSolvable()) {
            // Swap two tiles to make it solvable
            swapTiles(0, 1);
        }
        statusMessage.textContent = '';
        render();
    }

    function isSolvable() {
        const flatTiles = tiles.filter(tile => tile !== 0);
        let inversions = 0;
        for (let i = 0; i < flatTiles.length - 1; i++) {
            for (let j = i + 1; j < flatTiles.length; j++) {
                if (flatTiles[i] > flatTiles[j]) {
                    inversions++;
                }
            }
        }
        return inversions % 2 === 0;
    }

    function isSolved() {
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }

    function endGame() {
        statusMessage.textContent = 'Congratulations, you solved the puzzle!';
        document.body.classList.add('solved');
    }

    shuffleButton.addEventListener('click', () => {
        document.body.classList.remove('solved');
        shuffleTiles();
    });

    initializeBoard();
});
