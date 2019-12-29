const Octokit = require('@octokit/rest');
const _ = require('lodash');

class GithubApi {
  constructor(githubToken, githubOrgName) {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_API_TOKEN
    });
    this.org_name = githubOrgName || 'tory-toolkit';
  }

  checkMembership(user_name, callback, errorCallback) {
    this.octokit.orgs
      .checkMembership({
        org: this.org_name,
        username: user_name
      })
      .then(({ status }) => {
        if (status === 204) {
          callback(`\`${user_name}\` is a member of the \`${this.org_name}\` organisation.`);
        }
      })
      .catch(err => {
        if (_.get(err, 'status') === 404) {
          errorCallback('not-found');
        }
        else {
          errorCallback('unknown');
        }
      });
  }
  
  inviteMember(user_name, callback, errorCallback) {
    this.octokit.orgs
      .addOrUpdateMembership({
        org: this.org_name,
        username: user_name,
        role: 'member'
      })
      .then(({ status }) => {
        if (status === 200) {
          callback(
            `\`${user_name}\` has been invited to the \`${this.org_name}\` organisation and will receive an invitation email.`
          );
        }
      })
      .catch(err => {
        if (_.get(err, 'status') === 403) {
          errorCallback('rate-limited');
        } else {
          errorCallback('unknown');
        }
      });
  }
}

module.exports = GithubApi;
