'use strict'

let flashcards = [];
let review = [];

/**
 * * make a bootstrap row with some additional classes
 * */
function makeRow() {
    const row = document.createElement('div');
    row.classList.add('row', 'd-flex', 'justify-content-center', 'flex-nowrap', 'p-4');
    return row;
}

// make a bootstrap col with some additional classes
/**
 * make column with a certain size
 * @param {int} size 
 * @returns an HTML element
 */
function makeCol(size) {
    const col = document.createElement('div');
    col.classList.add(size === 0 ? 'col' : 'col-' + size.toString(), 'text-center', 'word-wrap');
    return col;
}


/* DOM SURGERY
<div class="row d-flex justify-content-center flex-nowrap p-4">
	<div class="col-3 text-center">
		1 of 3
	</div>
	<div class="col-3 text-center">
		2 of 3
	</div>
	<div class="col-1 text-center">
		<i class="bi bi-x hov"></i>
	</div>
</div>
*/


/**
* renders the flashcards in the edit screen
*/
function makeEditFlashcard(flashcardObj) {
	const main = makeRow();

	const term = makeCol(3);
	term.innerText = flashcardObj.term;

	const definition = makeCol(3);
	definition.innerText = flashcardObj.definition;

	const xButton = makeCol(1);
	const x = document.createElement('i');
	x.classList.add('bi', 'bi-x', 'hov');
	x.setAttribute('id', 'add-flashcard-x-btn');
	xButton.appendChild(x);

	main.appendChild(term);
	main.appendChild(definition);
	main.appendChild(xButton);
	return main;
}


/* DOM SURGERY
<div id="study-flashcard">
<div class="row d-flex justify-content-center flex-nowrap p-4">
	<div class="col box text-center">
		<!-- CARD + BUTTONS -->
		<div class="row d-flex justify-content-center flex-nowrap p-4">
			<!-- CARD ON THE LEFT SIDE -->
			<div class="col box text-center">
				<div class="card" id="study-flashcard-card">
					<div class="card-body">
						<p class="card-text">Some quick example text to build on the card title and make up
							the bulk of the card's content.</p>
					</div>
				</div>
			</div>
			<!-- 2 BUTTONS ON THE LEFT SIDE -->
			<div class="col box text-center align-self-center">
				<div class="d-grid gap-2">
					<button class="btn btn-success" type="button">Button</button>
					<button class="btn btn-danger" type="button">Button</button>
				</div>
			</div>
		</div>
	</div>

	<div class="col box text-center">
		<!-- CARD + BUTTONS -->
		<div class="row d-flex justify-content-center flex-nowrap p-4">
			<!-- CARD ON THE RIGHT SIDE -->
			<div class="col box text-center">
				<div class="card" id="study-flashcard-card">
					<div class="card-body">
						<p class="card-text">Some quick example text to build on the card title and make up
							the bulk of the card's content.
							Some quick example text to build on the card title and make up
							the bulk of the card's content
							Some quick example text to build on the card title and make up
							the bulk of the card's content</p>
						Some quick example text to build on the card title and make up
						the bulk of the card's content
					</div>
				</div>
			</div>
			<!-- 2 BUTTONS ON THE RIGHT SIDE -->
			<div class="col box text-center align-self-center">
				<div class="d-grid gap-2">
					<button class="btn btn-success" type="button">Button</button>
					<button class="btn btn-danger" type="button">Button</button>
				</div>
			</div>
		</div>
	</div>
</div>

</div>
*/


function makeCard(text) {
    const cardCol = makeCol(0);
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', 'study-flashcard-card');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerText = text;
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);
    cardCol.appendChild(card);

    return cardCol;

}

function makeButtons() {
    const colButton = document.createElement('div');
    colButton.classList.add('col', 'text-center', 'align-self-center');
    const buttonWrap = document.createElement('div');
    buttonWrap.classList.add('d-grid', 'gap-2');
    
    const correct = document.createElement('button');
    correct.classList.add('btn', 'btn-success');
    correct.innerText = 'Correct';
	correct.setAttribute('type', 'button')
    
    const incorrect = document.createElement('button');
    incorrect.classList.add('btn', 'btn-danger');
    incorrect.innerText = 'Incorrect';
	incorrect.setAttribute('type', 'button')

	buttonWrap.appendChild(correct);
	buttonWrap.appendChild(incorrect);
    colButton.appendChild(buttonWrap);
	
    return colButton;
}


/**
 * renders the flashcards in the edit screen
 */
function renderFlashcards(element) {
    element.innerHTML = '';

    for (let i = 0; i < flashcards.length; i++) {
        const main = makeEditFlashcard(flashcards[i]);

        main.childNodes[2].firstChild.addEventListener('click', () => {
            const temp = flashcards[i];
            
            // post to server. tell server to delete this flashcard
            fetch('/api/users/USER/class/CLASS/flashcards/FLASHCARD/removeFlashcard', {
                method: 'POST', 
                body: JSON.stringify(temp), 
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                return response.json();
            }).then(obj => {
                // TODO
                console.log(obj.status);
                if(obj.status === 200) {
                    flashcards.splice(i, 1);    // removes this flashcard from array

                    // rerenders flashcards after client deletes the flashcard in the edit screen
                    renderFlashcards(document.getElementById('flashcard'));
                }
            }).catch(e => {
                console.log(error);
            });
        })
        element.appendChild(main);

    }
}

function renderReview(element) {
    element.innerHTML = '';

    for(let i = 0 ; i < review.length; i++) {
        const main = makeEditFlashcard(review[i]);
        main.lastChild.innerHTML = '';

        element.appendChild(main);
    }
}


function renderStudyFlashcards(element) {
    element.innerHTML = '';

    let rowOuter = makeRow();
    
    const copy = JSON.parse(JSON.stringify(flashcards));
    const copyShuffle = shuffle(copy);      // shuffle flashcards up

    for (let i = 0; i < copyShuffle.length; i++) {
        const colOuterLeft = makeCol(0);
        const colOuterRight = makeCol(0);
        
        if (i % 2 === 0) {
            rowOuter = makeRow();
        }
        
        const content = makeRow();
        content.appendChild(makeCard(copyShuffle[i].term));
        content.appendChild(makeButtons());

        // event listener that allows user to click on the card and it will switch
        // between term and definition
        content.firstChild.addEventListener('click', () => {
            let cardParagraph = content.firstChild.firstChild.firstChild.firstChild;
            if (cardParagraph.innerHTML === copyShuffle[i].term) {
                cardParagraph.innerHTML = copyShuffle[i].definition;
            } else {
                cardParagraph.innerHTML = copyShuffle[i].term;
            }
        })

        const correctButton = content.childNodes[1].firstChild.firstChild;
        const incorrectButton = content.childNodes[1].firstChild.childNodes[1];
        correctButton.addEventListener('click', () => {
            
            // remove word from review if its in the array
            if (review.includes(copyShuffle[i])) {
                review.splice(i, 1);
            }
            
        });
        
        incorrectButton.addEventListener('click', () => {
            // put word in review array if it is not in there
            if (!review.includes(copyShuffle[i])) {
                review.push(copyShuffle[i]);
            }

        });
        
        
        if(i % 2 === 0) {
            // dummy flashcard on the right side if there is an odd number of flashcards
            const rightCard = makeCard('');
            const rightButtons = makeButtons();
            rightCard.classList.toggle('invisible');
            rightButtons.classList.toggle('invisible');
            const contentRight = makeRow();
            contentRight.appendChild(rightCard);
            contentRight.appendChild(rightButtons);
            colOuterRight.appendChild(contentRight);
            colOuterLeft.appendChild(content);

            rowOuter.appendChild(colOuterLeft);
            rowOuter.appendChild(colOuterRight);
        } else {
            
            // remove the dummy flashcard from the screen
            rowOuter.removeChild(rowOuter.lastChild);
            colOuterRight.appendChild(content);
            rowOuter.appendChild(colOuterRight);
        }
        
        if (i % 2 === 0) {
            element.appendChild(rowOuter);
        }
    }

}


function shuffle(array) {
    // Fisher-Yates shuffle, used for random decoder cipher below    
    let m = array.length;
    
    // While there remain elements to shuffle…                                                                                
    while (m) {
	
        // Pick a remaining element…                                                                                          
        let i = Math.floor(Math.random() * m--);
	
        // And swap it with the current element.                                                                              
        let t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    
    return array;
};



// when client clicks on the initial add flashcard button, it adds an attribute 
// to the modal button. Adding the attribute will close the modal 
document.getElementById('add-flashcard-modal').addEventListener('shown.bs.modal', function (event) {
    document.getElementById('add-flashcard-btn').setAttribute("data-bs-dismiss", "modal")
})


// Event listener for the add flashcard modal. Receives the term and the description
// from client after they click the add button
document.getElementById('add-flashcard-btn').addEventListener('click', () => {
    const t = document.getElementById('term-input').value;
    const d = document.getElementById('flashcard-desc-input').value;

    if (t.length === 0 || d.length === 0) {
        return;
    }

    let temp = {
        term: t,
        definition: d
    }

    // POST: add a flashcard to the set of flashcards
    fetch('/api/users/USER/class/CLASS/flashcards/FLASHCARD/addFlashcard', {
        method: 'POST', 
        body: JSON.stringify(temp), 
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        return response.json();
    }).then(obj => {
        // TODO 
        console.log(obj.status);
    }).catch(e => {
        console.log(e);
    });

    // grab flashcards from server
    fetch('/api/users/USER/class/CLASS/flashcards/FLASHCARD')
    .then(response => {
        return response.json();
    }).then(obj => {
        // if we get a status code of 200, replace client-side flashcard set 
        // with flashcard set from server
        if (obj.status === 200) {
            flashcards = obj.result;
        }
    }).catch(e => {
        console.log(e);
    });


    // clear term and description input box after every added term
    document.getElementById('term-input').value = '';
    document.getElementById('flashcard-desc-input').value = '';
    
    renderFlashcards(document.getElementById('flashcard'));

    // the following 2 lines of code auto scroll to the buttom when
    //  adding flashcards in the edit screen
    const elem = document.getElementById('flashcard');
    elem.scrollTop = elem.scrollHeight;
    
});

// the study button is displayed when you are in th editing flashcard section
document.getElementById('study-btn').addEventListener('click', () => {
    document.getElementById('study-and-flashcard').classList.toggle("invisible");
    document.getElementById('review-missed-term').classList.toggle("invisible");
    renderStudyFlashcards(document.getElementById('flashcard'));
});

// The edit button is displayed when you are in the study section of the flashcards
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('study-and-flashcard').classList.toggle("invisible");
    document.getElementById('review-missed-term').classList.toggle("invisible");
    renderFlashcards(document.getElementById('flashcard'));
});


document.getElementById('reset-btn').addEventListener('click', () => {
    review = [];
    renderStudyFlashcards(document.getElementById('flashcard'));
});

document.getElementById('reset-btn').addEventListener('click', () => {
    renderStudyFlashcards(document.getElementById('flashcard'));
});

document.getElementById('review-missed-term-btn').addEventListener('click', () => {
    renderReview(document.getElementById('flashcard'));
});