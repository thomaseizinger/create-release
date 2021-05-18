import {setFailed, setOutput, getInput} from '@actions/core';
import {getInputs} from './getInputs';
import {getOctokit} from '@actions/github';

async function run(): Promise<void> {
  try {
    const releaseParams = getInputs();

    const octokit = getOctokit(getInput('github_token', {required: true}));
    const response = await octokit.rest.repos.createRelease(releaseParams);

    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl, url }
    } = response;

    setOutput('id', releaseId.toString());
    setOutput('url', url);
    setOutput('html_url', htmlUrl);
    setOutput('upload_url', uploadUrl);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
