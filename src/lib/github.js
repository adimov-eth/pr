import { Octokit } from '@octokit/rest';

export const getOctokit = (accessToken) => {
  if (!accessToken) {
    console.error('No access token provided to getOctokit');
    throw new Error('Authentication required');
  }
  return new Octokit({ auth: accessToken });
};