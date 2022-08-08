const passport = require('passport');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const profileData = require('../dataService/profile')

module.exports = function(app) {

    // GET profile info API call
    app.get('/getProfile', passport.authenticate('jwt', { session: false }), async (req, res) => {
        const names = await profileData.getNames(req.user.user_id);
        const description = await profileData.getDescription(req.user.user_id);
        const skills = await profileData.getSkills(description.profile_id);
        const exp = await profileData.getExperience(description.profile_id);
        const contact = await profileData.getContact(description.profile_id);
        //console.log(names, description, skills, exp, contact)
        res.json({
            pid:description.profile_id,
            fname:names.user_firstname,
            lname:names.user_lastname,
            description:description.profile_description,
            skills:skills,
            experience:exp,
            phone:contact.contact_phone,
            linkedin:contact.contact_linkedin,
            github:contact.contact_github,
            background:description.profile_color,
          });
    });

    // REMOVE skills
    app.post(
    '/removeSkill',
    body('id').isLength({ min: 1, max: 5 }),
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({
                    status: 'validation mismatch',
                    err: errors.msg + ': ' + errors.param,
                });
            } else {
                const rmData = await profileData.removeSkills(req.body.id);
                res.send(rmData);
            }
        } catch (error) {
            return res.json({ status: 'fail' });
        }
    });

    // REMOVE experience
    app.post(
    '/removeExp',
    body('id').isLength({ min: 1, max: 5 }),
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({
                    status: 'validation mismatch',
                    err: errors.msg + ': ' + errors.param,
                });
            } else {
                const rmData = await profileData.removeExperience(req.body.id);
                res.send(rmData);
            }
        } catch (error) {
            return res.json({ status: 'fail' });
        }
    });

    // EDIT Description
    app.post(
    '/editDesc',
    body('id').isLength({ min: 1, max: 5 }),
    body('text').isLength({ min: 1, max: 500 }),
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({
                    status: 'validation mismatch',
                    err: errors.msg + ': ' + errors.param,
                });
            } else {
                const editData = await profileData.editDescription(req.body.id, req.body.text);
                res.send(editData);
            }
        } catch (error) {
            return res.json({ status: 'fail' });
        }
    });

    // EDIT Contacts
    app.post(
    '/editContact',
    body('id').isLength({ min: 1, max: 5 }),
    body('phone').isLength({ min: 1, max: 10 }),
    body('linkedin').isLength({ min: 1, max: 20 }),
    body('github').isLength({ min: 1, max: 20 }),
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {

        console.log(req.body.id, req.body.phone, req.body.linkedin, req.body.github)
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({
                    status: 'validation mismatch',
                    err: errors.msg + ': ' + errors.param,
                });
            } else {
                const editData = await profileData.editContact(req.body.id, req.body.phone, req.body.linkedin, req.body.github);
                res.send(editData);
            }
        } catch (error) {
            return res.json({ status: 'fail' });
        }
    });
}
