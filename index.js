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
        fetch('http://localhost:3000/films')
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

    function buyTicket() {
        if (buyTicketButton.classList.contains('sold-out')) return;

        fetch(`http://localhost:3000/films/${currentFilmId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: parseInt(availableTickets.textContent) + 1 })
        })
        .then(response => response.json())
        .then(updatedFilm => {
            fetch('http://localhost:3000/tickets',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({film_id: currentFilmId, number_of_tickets: 1})
            })
            displayFilmDetails(updatedFilm);
        });
    }

    function deleteFilm(filmId, listItem) {
        fetch(`http://localhost:3000/films/${filmId}`, {
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