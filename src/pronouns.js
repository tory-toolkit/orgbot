const pronounsList = require('./pronounsList');

const extractPronouns = function (command) {
  let splitCommand;
  if (command.toLowerCase().startsWith('my pronouns are')) {
    try {
      splitCommand = command.split('are')[1].trim();
    } catch (e) {
      console.log('there was a problem splitting the command')
    }
  }
  return pronounsList[splitCommand];
}

const setPronouns = function (roleName, guildRoles, member) {
  const role = guildRoles.find(r => r.name === roleName);
  if (role) {
    member.addRole(role).catch(console.error);
    return `Success! We've set your pronouns to ${roleName}`;
  }
  return null;
}

module.exports = {
  extractPronouns,
  setPronouns
}
