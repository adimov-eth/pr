import { Octokit } from '@octokit/rest';

export const getOctokit = (accessToken) => {
  return new Octokit({ auth: accessToken });
};
