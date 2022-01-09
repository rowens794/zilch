const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION,
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 500,
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
          code              CHAR(6) PRIMARY KEY,
          game_started      BOOL,
          turn              INT,
          players           VARCHAR(10)[],
          activePlayer      VARCHAR(10),
          creation_date     TIMESTAMPTZ,
          dice_values       INT[],
          used_dice         INT[],
          dice_selection    BOOL[]
      );`);

    await client.query(`
      CREATE TABLE player (
          code              VARCHAR(6) PRIMARY KEY,
          game              CHAR(6) ,      
          name              VARCHAR(10),
          score             INT,
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
