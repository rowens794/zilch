const { Pool, Client } = require("pg");
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION,
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 1000,
  max: 5,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const runQuery = (queryText, inputArray) => {
  let promise = new Promise(async (resolve, reject) => {
    const client = await pool.connect();

    let queryResult = await client.query(queryText, inputArray);
    client.release();

    resolve(queryResult);
  });

  return promise;
};

export const runQueryClient = (queryText, inputArray) => {
  let promise = new Promise(async (resolve, reject) => {
    const client = new Client({
      connectionString: process.env.DB_CONNECTION,
      connectionTimeoutMillis: 1000,
      idleTimeoutMillis: 1000,
      max: 5,
    });

    await client.connect();

    const queryResult = await client.query(queryText, inputArray);
    await client.end();

    resolve(queryResult);
  });

  return promise;
};

export const setupTables = () => {
  let promise = new Promise(async (resolve, reject) => {
    const client = await pool.connect();

    // drop existing tables
    // CASCADE option will drop any foreign key constraints
    await client.query("DROP TABLE IF EXISTS game CASCADE");
    await client.query("DROP TABLE IF EXISTS player CASCADE");

    //create tables
    await client.query(`
      CREATE TABLE game (
          code                            CHAR(3) PRIMARY KEY,
          creation_date                   TIMESTAMPTZ,
          game_started                    BOOL,
          game_stage                      INT DEFAULT 1,
          players                         VARCHAR(6)[],
          active_player                   VARCHAR(6),
          start_of_turn                   BOOL,
          roll_id                         CHAR(6),
          roll_animation_end              TIMESTAMPTZ,
          zilched                         BOOL,
          zilch_animation_start           TIMESTAMPTZ,
          zilch_animation_end             TIMESTAMPTZ,
          next_up                         BOOL,
          next_up_animation_start         TIMESTAMPTZ,
          next_up_animation_end           TIMESTAMPTZ,
          banked_score                    BOOL,
          banked_score_animation_start    TIMESTAMPTZ,
          banked_score_animation_end      TIMESTAMPTZ,
          last_turn_triggered             BOOL,
          last_turn_animation_start       TIMESTAMPTZ,
          last_turn_animation_end         TIMESTAMPTZ,
          last_turn_triggered_by          Char(6),
          dice_values                     INT[],
          used_dice                       INT[],
          dice_selection                  BOOL[],
          board_cleared                   BOOL,
          announce_winner                 BOOL
      );`);

    await client.query(`
      CREATE TABLE player (
          code              VARCHAR(6) PRIMARY KEY,
          game              CHAR(6) ,      
          name              VARCHAR(10),
          turn_score        INT,
          banked_score      INT,
          host              BOOL,
          creation_date     TIMESTAMPTZ,
          CONSTRAINT fk_game
            FOREIGN KEY(game) 
              REFERENCES game(code)
      );`);

    //release client back into pool
    client.release();

    resolve(null);
  });

  return promise;
};
