const canvas = document.getElementById('canvas');


const button = document.getElementById('button');


const gridButton = document.getElementById('gridButton');


const clearButton = document.getElementById('clearButton');


const ctx = canvas.getContext('2d');



canvas.width = 408;


canvas.height = 300;



const width = canvas.width;


const height = canvas.height;



const cellSize = 12;


const rows = height / cellSize;


const cols = width / cellSize;


let showGrid = false;



const powders = new Map([

	[0, {

		name: 'Null',

		color: 'transparent'

	}],


	[1, {

		name: 'Water',

		color: 'blue'

	}],


	[2, {

		name: 'Fire',

		color: 'red'

	}],


	[3, {

		name: 'Dirt',

		color: 'brown'

	}],


	[4, {

		name: 'Steam',

		color: 'lightgray'

	}],


	[5, {

		name: 'Wood',

		color: 'brown'

	}],


	[6, {

		name: 'Acid',

		color: '#00FF00'

	}],


	[7, {

		name: 'Thunder',

		color: 'yellow'

	}],


	[8, {

		name: 'Lava',

		color: 'orange'

	}],


	[9, {

		name: 'Metal',

		color: 'gray'

	}],


	[10, {

		name: 'Charcoal',

		color: 'black'

	}],


	[11, {

		name: 'Stone',

		color: 'gray'

	}],

	[12, {

		name: 'Glass',

		color: 'lightgray'

	}],
	
	
	[13, {

		name: 'Blood',

		color: 'red'

	}],
	

]);


const reactions = {

	Water: {

		Fire: 11, // Water and fire react to create stone (index 2 in powders Map)

		Acid: 6, // Water and acid react to create acid solution (index 6 in powders Map)

		Dirt: 3, // Water and dirt react to create mud (index 3 in powders Map)

		Metal: null, // Water and metal do not react

		Charcoal: null, // Water and charcoal do not react

		Lava: 11,

		Steam: 1,
		
		Stone: null,

	},

	Fire: {

		Water: 11, // Fire and water react to create steam (index 2 in powders Map)

		Wood: 10, // Fire and wood react to create charcoal (index 10 in powders Map)

		Dirt: 4, // Fire and dirt react to create ash (index 4 in powders Map)

		Metal: null, // Fire and metal react to heat up and potentially melt or burn

		Charcoal: 2, // Fire and charcoal react to create more fire (index 2 in powders Map)

		Lava: 8,

	},

	Dirt: {

		Water: 3, // Dirt and water react to create mud (index 3 in powders Map)

		Fire: 8, // Dirt and fire react to create ash (index 4 in powders Map)

		Acid: null, // Dirt and acid react to dissolve or react with the minerals in the dirt

		Charcoal: null, // Dirt and charcoal do not react

		Lava: 8,

	},

	Steam: {

		Water: 1, // Steam and water react to condense back into liquid water

		Fire: null, // Steam and fire do not react

		Acid: null, // Steam and acid react to cause the acid to evaporate or boil

		Charcoal: null, // Steam and charcoal do not react

		Lava: 0,

	},
	
	Blood: {

		Water: 1, // Steam and water react to condense back into liquid water

		Fire: null, // Steam and fire do not react

		Acid: null, // Steam and acid react to cause the acid to evaporate or boil

		Charcoal: null, // Steam and charcoal do not react

		Lava: 0,

	},

	Wood: {

		Water: 5, // Wood and water react to absorb the water and potentially swell or rot

		Fire: 10, // Wood and fire react to create charcoal (index 10 in powders Map)

		Acid: null, // Wood and acid react to cause the acid to dissolve or react with the cellulose in the wood

		Charcoal: null, // Wood and charcoal do not react

		Thunder: 2,

	},

	Acid: {

		Water: 6, // Acid and water react to create a solution of the acid in water

		Fire: 6, // Acid and fire react to cause the acid to evaporate or boil

		Dirt: 6, // Acid and dirt react to cause the acid to dissolve or react with the minerals in the dirt

		Steam: 6,

		Wood: 6,

		Thunder: 7,

		Lava: 3,

		Metal: 6,

		Stone: 6,

		Glass: null,

		Charcoal: 6, // Acid and charcoal react

	},

	Lava: {

		Water: 11, // Lava and water react to cause a violent reaction as the lava cools and solidifies. Steam would be produced.

		Fire: 8, // Lava and fire do not react

		Dirt: 11, // Lava and dirt react to cause the lava to solidify and potentially create new rock formations (index 11 in powders Map)

		Charcoal: 8, // Lava and charcoal do not react

		Stone: 8,

		Metal: 8,

		Acid: 3,

		Thunder: 8,

		Glass: 8,

		Steam: 8,

	},

	Metal: {

		Water: 9, // Metal and water do not react

		Fire: 8, // Metal and fire react to heat up and potentially melt or burn

		Dirt: null, // Metal and dirt do not react

		Charcoal: null, // Metal and charcoal do not react

		Acid: 6,

		Lava: 8,

		Thunder: 8,

		Lava: 8,

	},

	Charcoal: {

		Water: 10, // Charcoal and water do not react

		Fire: 2, // Charcoal and fire react to create more fire (index 2 in powders Map)

		Dirt: null, // Charcoal and dirt do not react

		Acid: 6, // Charcoal and acid do not react

		Lava: 2,

		Thunder: 2,

		Lava: 8,

	},

	Stone: {

		Water: 11, // Stone and water do not react

		Fire: 8, // Stone and fire do not react

		Dirt: null, // Stone and dirt do not react

		Acid: 6, // Stone and acid do not react

		Charcoal: null, // Stone and charcoal do not react

		Lava: 8,

	},

	Thunder: {

		Water: 0, // Stone and water do not react

		Fire: 7, // Stone and fire do not react

		Dirt: 8, // Stone and dirt do not react

		Acid: 7, // Stone and acid do not react

		Charcoal: 2, // Stone and charcoal do not react

		Lava: 8,

		Thunder: 0,

		Wood: 2,

		Glass: 7

	},

	Glass: {
	 Water: 12,

		Lava: 8,

		Thunder: 0,

	},

};


/*let then = performance.now();


function drawFps() {

  // Update

  const now = performance.now();

  const elapsed = now - then;

  const fps = 1000 / elapsed;


  // Draw

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';

  ctx.font = '24px sans-serif';

  ctx.textAlign = 'right';

  ctx.textBaseline = 'top';

  ctx.fillText(fps.toFixed(1) + ' FPS', canvas.width, 0);


  then = now;


  requestAnimationFrame(drawFps);

}


requestAnimationFrame(drawFps);*/


let grid = Array.from({

	length: Math.floor(rows)

}, () => Array(Math.floor(cols)).fill(0));



function drawGrid() {


	ctx.clearRect(0, 0, width, height); // Clear the canvas before drawing the grid


	ctx.lineWidth = 1;

	if (showGrid) {

		ctx.strokeStyle = 'gray';

	} else {

		ctx.strokeStyle = 'transparent';

	}


	for (let i = 0; i < rows; i++) {


		for (let j = 0; j < cols; j++) {


			const powderIndex = grid[i][j];


			if (powders.has(powderIndex)) {


				ctx.fillStyle = powders.get(powderIndex) && powders.get(powderIndex).color || powders.get(0).color;


			} else {


				ctx.fillStyle = powders.get(0).color; // or some other default color


			}



			ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);


			ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);


		}


	}


}



function toggleCell(x, y, powderIndex) {


	const row = Math.floor(y / cellSize);


	const col = Math.floor(x / cellSize);


	grid[row][col] = powderIndex;


}



let currentPowder = 1;



const currentPowderDiv = document.getElementById('current-powder');



button.addEventListener('click', (event) => {


	currentPowder = (currentPowder + 1) % powders.size;


	const currentPowderObject = powders.get(currentPowder);


	if (currentPowderObject) {


		currentPowderDiv.innerHTML = ' ' + currentPowderObject.name;

		currentPowderDiv.style.color = currentPowderObject.color;


	} else {


		currentPowderDiv.innerHTML = 'Null'; // or some other default name


	}


});


gridButton.addEventListener('click', () => {

	showGrid = !showGrid;

});


clearButton.addEventListener('click', () => {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	grid = grid.map(row => row.map(() => 0));

	//draw();

});


canvas.addEventListener('click', (event) => {

	toggleCell(event.offsetX, event.offsetY, currentPowder);

	drawGrid();	

});


let isMouseDown = false;


canvas.addEventListener('mousedown', (event) => {

	isMouseDown = true;

	toggleCell(event.offsetX, event.offsetY, currentPowder);

	drawGrid();

});


canvas.addEventListener('mousemove', (event) => {

	if (isMouseDown) {

		toggleCell(event.offsetX, event.offsetY, currentPowder);

		drawGrid();

	}

});


canvas.addEventListener('mouseup', (event) => {

	isMouseDown = false;

});


/*Mobile Touch Start*/

let isTouchDown = false;


canvas.addEventListener('touchstart', (event) => {

  isTouchDown = true;

  // Get the x and y coordinates of the touch event

  const x = event.touches[0].clientX - canvas.offsetLeft;

  const y = event.touches[0].clientY - canvas.offsetTop;

  toggleCell(x, y, currentPowder);

  drawGrid();

});


canvas.addEventListener('touchmove', (event) => {

  if (isTouchDown) {

    // Get the x and y coordinates of the touch event

    const x = event.touches[0].clientX - canvas.offsetLeft;

    const y = event.touches[0].clientY - canvas.offsetTop;

    toggleCell(x, y, currentPowder);

    drawGrid();

  }

});


canvas.addEventListener('touchend', (event) => {

  isTouchDown = false;  

});


/*Mobile Touch End*/



drawGrid();


function updateGrid() {


	for (let i = rows - 2; i >= 0; i--) {


		for (let j = 0; j < cols; j++) {


			// Move powders down if the cell below is empty


			if (grid[i][j] !== 0 && grid[i + 1][j] === 0) {


				grid[i + 1][j] = grid[i][j];


				grid[i][j] = 0;


			}



			// Check for reactions with all adjacent cells


			if (grid[i][j] !== 0 && powders.has(grid[i][j])) {


				const powder1 = powders.get(grid[i][j]);



				// Check the cell to the left


				if (j > 0 && grid[i][j - 1] !== 0 && grid[i][j - 1] !== grid[i][j]) {


					const powder2 = powders.get(grid[i][j - 1]);


					if (reactions[powder1.name] && reactions[powder1.name][powder2.name]) {


						grid[i][j] = reactions[powder1.name][powder2.name];


						grid[i][j - 1] = 0;


					}


				}



				// Check the cell to the right


				if (j < cols - 1 && grid[i][j + 1] !== 0 && grid[i][j + 1] !== grid[i][j]) {


					const powder2 = powders.get(grid[i][j + 1]);


					if (reactions[powder1.name] && reactions[powder1.name][powder2.name]) {


						grid[i][j] = reactions[powder1.name][powder2.name];


						grid[i][j + 1] = 0;


					}


				}



				// Check the cell above


				if (i > 0 && grid[i - 1][j] !== 0 && grid[i - 1][j] !== grid[i][j]) {


					const powder2 = powders.get(grid[i - 1][j]);


					if (reactions[powder1.name] && reactions[powder1.name][powder2.name]) {


						grid[i][j] = reactions[powder1.name][powder2.name];


						grid[i - 1][j] = 0;


					}


				}



				// Check the cell below


				if (i < rows - 1 && grid[i + 1][j] !== 0 && grid[i + 1][j] !== grid[i][j]) {


					const powder2 = powders.get(grid[i + 1][j]);


					if (reactions[powder1.name] && reactions[powder1.name][powder2.name]) {


						grid[i][j] = reactions[powder1.name][powder2.name];




						grid[i + 1][j] = 0;


					}


				}



				// If there are no reactions available, move the powder randomly to the left or right


				// Only move powders that are "Water", "Steam", "Fire", "Acid", or "Lava"


				if (["Water", "Steam", "Fire", "Acid", "Lava"].includes(powder1.name)) {


					if (Math.random() < 0.5) {


						// Try to move powder to the left


						if (j > 0 && grid[i][j - 1] === 0) {


							grid[i][j - 1] = grid[i][j];


							grid[i][j] = 0;


						}


					} else {


						// Try to move powder to the right


						if (j < cols - 1 && grid[i][j + 1] === 0) {


							grid[i][j + 1] = grid[i][j];


							grid[i][j] = 0;


						}


					}


				}


			}


		}


	}


	// Redraw the grid after all reactions and movements have been processed


	drawGrid();


}



setInterval(updateGrid, 1000);



function react(i, j, powder1, powder2) {


	if (!powder1 || !powder2) {


		return;

	}


}
function animate() {


	updateGrid();


	drawGrid();


	requestAnimationFrame(animate);
	}
	//requestAnimationFrame(animate);
