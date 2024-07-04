import { getInput } from "@actions/core";
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types'

export function getInputs(): RestEndpointMethodTypes["repos"]["createRelease"]["parameters"] {
  const draft = getInput("draft") ? JSON.parse(getInput("draft")) : undefined;
  const prerelease = getInput("prerelease") ? JSON.parse(getInput("prerelease")) : undefined;
  const body = getInput("body") || undefined;
  const name = getInput("name") || undefined;

  const githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error("GITHUB_REPOSITORY is not set");
  }

  const targetCommitish = determineTargetCommitish()
  const tagName = determineTagName();

  const [owner, repo] = githubRepository.split("/");

  return {
    draft,
    body,
    owner,
    repo,
    target_commitish: targetCommitish,
    prerelease,
    tag_name: tagName,
    name
  };
}

function determineTargetCommitish() {
  const currentCommit = process.env.GITHUB_SHA

  if (!currentCommit) {
    throw new Error("GITHUB_SHA not set. What is this environment?")
  }

  const targetCommitishInput = getInput('target_commitish')

  if (targetCommitishInput) {
    return targetCommitishInput
  } else {
    return currentCommit
  }
}

function determineTagName(): string {
  const currentRef = process.env.GITHUB_REF;

  if (!currentRef) {
    return getInput("tag_name", {required: true})
  }

  const isTag = currentRef.startsWith("refs/tags")

  if (!isTag) {
    return getInput("tag_name", {required: true})
  }

  return currentRef.replace("refs/tags/", "");
}
