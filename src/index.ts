import {setFailed, setOutput} from '@actions/core'
import {Octokit} from '@octokit/action'
import {getInputs} from './getInputs'

async function run(): Promise<void> {
  try {
    const releaseParams = getInputs();

    const octokit = new Octokit();
    const response = await octokit.repos.createRelease(releaseParams)

    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl, url }
    } = response;

    setOutput('id', releaseId.toString());
    setOutput('url', url);
    setOutput('html_url', htmlUrl);
    setOutput('upload_url', uploadUrl);
  } catch (error: any) {
    setFailed(error.message);
  }
}

run();
