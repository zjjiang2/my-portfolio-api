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
module.exports.getNames = async (uid) => {
    try {
        const query = {
            text: ` select user_firstname, user_lastname 
                    from users
                    where user_id = $1`,
            values: [uid]
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

module.exports.getDescription = async (uid) => {
    try {
        const query = {
            text: ` select profile_id, profile_description, profile_color 
                    from profiles
                    where user_id = $1`,
            values: [uid]
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}
module.exports.getSkills = async (pid) => {
    try {
        const query = {
            text: ` select skill_id, skill_name, skill_rating, skill_description 
                    from skills
                    where profile_id = $1`,
            values: [pid]
        }
        const res = await client.query(query)

        return res.rows
    } catch (err) {
        console.log(err.stack)
    }
}
module.exports.getExperience = async (pid) => {
    try {
        const query = {
            text: ` select exp_id, exp_name, exp_start, exp_end,exp_description 
                    from experience
                    where profile_id = $1`,
            values: [pid]
        }
        const res = await client.query(query)

        return res.rows
    } catch (err) {
        console.log(err.stack)
    }
}
module.exports.getContact = async (pid) => {
    try {
        const query = {
            text: ` select contact_phone, contact_linkedin, contact_github
                    from contact
                    where profile_id = $1`,
            values: [pid]
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

// Update experience data
module.exports.editDescription = async (pid, description) => {
    try {
        const query = {
            text: `UPDATE PROFILES SET PROFILE_DESCRIPTION = $2 WHERE PROFILE_ID = $1 `,
            values: [pid, description],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

// Add new experience
module.exports.addSkills = async (name, rating, description, pid) => {
    try {
    const query = {
        text: `INSERT INTO SKILLS (SKILL_NAME, SKILL_RATING, SKILL_DESCRIPTION, PROFILE_ID) VALUES ($1, $2, $3, $4, $5)`,
        values: [name, rating, description, pid],
    }
  
      const res = await client.query(query);
  
      return res.rows;
    } catch (err) {
      console.log(err.stack);
    }
};

// Update existing skill data
module.exports.editSkills = async (name, rating, description, sid) => {
    try {
        const query = {
            text: `UPDATE SKILLS SET SKILL_NAME = $1, SKILL_RATING = $2, SKILL_DESCRIPTION = $3 WHERE SKILL_ID = $4`,
            values: [name, rating, description, sid],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}

// Remove skill by matching id
module.exports.removeSkills = async (sid) => {
    try {
  
      const query = {
        text: `DELETE FROM SKILLS WHERE SKILL_ID = $1`,
        values: [sid],
      };
      const res = await client.query(query);
  
      return res.rows[0];
    } catch (err) {
      console.log(err.stack);
    }
};

// Add new experience
module.exports.addExperience = async (name, start, end, description, eid) => {

    try {
    const query = {
        text: `INSERT INTO EXPERIENCE (EXP_NAME, EXP_START, EXP_END, EXP_DESCRIPTION, PROFILE_ID) VALUES ($1, $2, $3, $4, $5)`,
        values: [name, start, end, description, eid],
    }
  
      const res = await client.query(query);
  
      return res.rows;
    } catch (err) {
      console.log(err.stack);
    }
};

// Update experience data
module.exports.editExperience = async (name, start, end, description, eid) => {
    try {
        const query = {
            text: `UPDATE EXPERIENCE SET EXP_NAME = $1, EXP_START = $2, EXP_END = $3, EXP_DESCRIPTION = $4 WHERE EXP_ID = $5`,
            values: [name, start, end, description, eid],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
};

// Remove experience by matching id
module.exports.removeExperience = async (eid) => {
    try {
  
      const query = {
        text: `DELETE FROM EXPERIENCE WHERE EXP_ID = $1`,
        values: [eid],
      };
      const res = await client.query(query);
  
      return res.rows[0];
    } catch (err) {
      console.log(err.stack);
    }
};

// Update contact data
module.exports.editContact = async (pid, phone, linkedin, github ) => {
    try {
        const query = {
            text: `UPDATE CONTACT SET CONTACT_PHONE = $1, CONTACT_LINKEDIN = $2, CONTACT_GITHUB = $3 WHERE PROFILE_ID = $4`,
            values: [phone, linkedin, github, pid],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
};