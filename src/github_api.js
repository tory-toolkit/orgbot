const Octokit = require('@octokit/rest');
const _ = require('lodash');

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN
});

const checkMembership = function(org_name, user_name, callback) {
  octokit.orgs
    .checkMembership({
      org: org_name,
      username: user_name
    })
    .then(({ status }) => {
      if (status === 204) {
        callback(`${user_name} is a member of the ${org_name} organisation.`);
      }
    })
    .catch(err => {
      if (_.get(err, 'status') === 404) {
        callback(
          `${user_name} is not a member of the ${org_name} organisation. If you would like to invite them, say \`orgbot add ${user_name}\`.`
        );
      }
    });
};

module.exports = {
  checkMembership
};
