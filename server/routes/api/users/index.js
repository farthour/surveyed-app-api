/**
 * Define routes in this module
 * Should use only controllers
 * No actions will be used in this module
 */

const express = require("express");
const router = express.Router();
const { asyncMiddleware } = require("../../../middlewares");
const getAllUsers = require("./get_all_users.controller");

/**
 * Get all users
 *
 * @endpoint /api/user/all
 */
router.get("/all", asyncMiddleware(getAllUsers));

module.exports = router;
