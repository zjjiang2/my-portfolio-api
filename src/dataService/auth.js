const { Client } = require('pg')

const client = new Client ({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'3883',
    database:'Portfolio'
});

// const client = new Client({
//   connectionString: process.env.CONNECT_STRING,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
client.connect()

// Returns user results with matching email
module.exports.getUser = async (email) => {
    try {
        const query = {
            text: 'SELECT * from users where user_email = $1',
            values: [email]
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

// Adds a new user into the database
module.exports.addUser = async (email, password, fname, lname) => {
    try {
        const query = {
            text: 'INSERT INTO users( user_email, user_password, user_firstname, user_lastname) VALUES($1, $2, $3, $4) RETURNING *',
            values: [email, password, fname, lname],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

module.exports.addProfile = async (uid) => {
    try {
        const query = {
            text: 'INSERT INTO PROFILES( PROFILE_DESCRIPTION, PROFILE_COLOR, USER_ID) VALUES($1, $2, $3)',
            values: ['', 0, uid],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}