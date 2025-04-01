document.addEventListener("DOMContentLoaded", () =>{

const filmsList = document.getElementById('films');
const filmTitle = document.getElementById('title');
const filmRuntime = document.getElementById('runtime');
const filmShowtime = document.getElementById('showtime');
const filmPoster = document.getElementById('poster');
const filmDescription = document.getElementById('film-info');
const availableTickets = document.getElementById('ticket-num');
const buyTicketButton = document.getElementById('buy-btn');

let currentFilmId;
function fetchFilms() {
        fetch('https://my-json-server.typicode.com/NyawiraKori/mini-web-app/films')
            .then(response => response.json())
            .then(films => {
                filmsList.innerHTML = '';
                films.forEach(film => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('film', 'item');
                    listItem.textContent = film.title;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';

                    deleteButton.addEventListener('click', () => {
                        deleteFilm(film.id, listItem);
                    });

                    listItem.addEventListener('click', () => {
                        displayFilmDetails(film);
                    });
                    listItem.appendChild(deleteButton);
                    filmsList.appendChild(listItem);
                });
                if (films.length > 0) {
                    displayFilmDetails(films[0]);
                }
            });
    }

    function displayFilmDetails(film) {
        currentFilmId = film.id;
        filmTitle.textContent = film.title;
        filmRuntime.textContent = `Runtime: ${film.runtime} minutes`;
        filmShowtime.textContent = `Showtime: ${film.showtime}`;
        filmPoster.src = film.poster;
        filmDescription.textContent = film.description;
        const available = film.capacity - film.tickets_sold;
        availableTickets.textContent = available;

        if (available <= 0) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.classList.add('sold-out');
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.classList.remove('sold-out');
        }
    }

    function buyTicket(event) {
    event.preventDefault();

    if (buyTicketButton.classList.contains('sold-out')) return;

    fetch(`https://my-json-server.typicode.com/NyawiraKori/mini-web-app/films/${currentFilmId}`)
        .then(response => response.json())
        .then(film => {
            let available = film.capacity - film.tickets_sold;

            if (available <= 0) {
                buyTicketButton.textContent = 'Sold Out';
                buyTicketButton.classList.add('sold-out');
                return;
            }

            const updatedTicketsSold = film.tickets_sold + 1;

            fetch(`https://my-json-server.typicode.com/NyawiraKori/mini-web-app/films/${currentFilmId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tickets_sold: updatedTicketsSold })
            })
            .then(response => response.json())
            .then(updatedFilm => {
                availableTickets.textContent = film.capacity - updatedTicketsSold;

                if (availableTickets.textContent <= 0) {
                    buyTicketButton.textContent = 'Sold Out';
                    buyTicketButton.classList.add('sold-out');
                }

                console.log(`Tickets Sold: ${updatedTicketsSold}, Available Tickets: ${availableTickets.textContent}`);
            });
        });
}

    function deleteFilm(filmId, listItem) {
        fetch(`https://my-json-server.typicode.com/NyawiraKori/mini-web-app/films/${filmId}`, {
            method: 'DELETE'
        })
        .then(() => {
            listItem.remove();
            fetchFilms();
        });
    }

    buyTicketButton.addEventListener('click', buyTicket);
    fetchFilms();
});