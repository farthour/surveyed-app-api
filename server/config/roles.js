const allRoles = {
  ADMIN: [],
  MEMBER: [],
};

exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));
