const allRoles = {
  ADMIN: [],
  MEMBER: [],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
