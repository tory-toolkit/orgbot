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
        callback(`\`${user_name}\` is a member of the \`${org_name}\` organisation.`);
      }
    })
    .catch(err => {
      if (_.get(err, 'status') === 404) {
        callback(
          `\`${user_name}\` is not a member of the \`${org_name}\` organisation. If you would like to invite them, say \`orgbot add ${user_name}\`.`
        );
      }
    });
};

const inviteMember = function(org_name, user_name, callback) {
  octokit.orgs
    .addOrUpdateMembership({
      org: org_name,
      username: user_name,
      role: 'member'
    })
    .then(({ status }) => {
      if (status === 200) {
        callback(
          `\`${user_name}\` has been invited to the \`${org_name}\` organisation and will receive an invitation email.`
        );
      }
    })
    .catch(err => {
      if (_.get(err, 'status') === 403) {
        callback(
          'GitHub rate-limits organisation invitations particularly aggressively. Unfortunately, we have reached the limit for this period. Try again in 24 hours.'
        );
      } else {
        callback('Unknown error. Try again later, or contact @daveio if the issue persists.');
      }
    });
};

module.exports = {
  checkMembership,
  inviteMember
};
