## Welcome to Zilch

Zilch is a dice game that allows players to compete against each other in a race to 10,000 points. Points are awarded based of a list of "hands" and players must roll a scorable "hand" on every turn or forfeit the points they've been awarded.

## This Project - Technology Used

This project was built with the following technologies:

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## This Project - Overview

I wanted to build an implementation of the dice game zilch that allowed players to easily connect with friends and play with their phones. I wanted to avoid the hassle of account creation and built the game to allow players to join with just a 3 digit game code. I also wanted all game state to be stored on the server so that all opponents could see exactly where the game stands at any point in time, and refresh the page without losing their progress.

## Pages acessible to players

The overall design of the game is relatively simple. Through the front end, players can access the following pages:

- [Home](/) - The home page. This page is the landing page for the game. It allows players to join a game or create a new game.
- [Create Game](/create-game) - Create Game page. This page allows a player to setup a new game.
- [Join Game](/join-game) - Join Game page. This page allows a player to join an existing game.
- [Lobby](/lobby/[gameID]/[userID]) - Lobby page. This page displays the current game state, who is hosting the game, who is playing in the game and allows the host to control the start of the game.
- [Game](/game/[gameID]/[userID]) - Game page. Where the action occurs. Allows the host and players to take all actions nessary during the course of the game.
- [Winner's Circle](/winner-circle/[gameID]) - Winner's Circle page. This page displays the winner of the game and allows the player to play again.

## API Endpoints

The above pages are supported by the following API endpoints:

Gamesetup:

- [POST /api/createGame] - Creates a game and a user object for the host of a game.
- [POST /api/joinGame] - Creates a user object for a player of a game and attaches them to a given game.
- [POST /api/getGameDetails] - While in lobby, this endpoint returns the current game state, including what players are in the game.
- [POST /api/startGame] - Starts the game and initiates the transition of players from lobby to game screen.
- [POST /api/abortGame] - Removes a player from a game or (if initiated by the host) removes all players and the game.

Gameplay:

- [POST /api/game/initiateRoll] - Initiates a dice roll for the current players.
- [POST /api/game/takePoints] - Allows current player to take points on the board and continue their current turn.
- [POST /api/game/bankPoints] - Allows a player to bank all points acquired during a roll and end their current turn.
- [POST /api/game/getLiveGameDetails] - Performs a live update of the game state and special checks for the host that allow the game to progress.

Winner Announcement:

- [POST /api/getWinner] - Returns sorted array of players and their points, to facilitate winner announcement.
