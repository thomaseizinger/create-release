import { getInput } from "@actions/core/lib/core";
import {ReposCreateReleaseParams} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/rest-endpoint-methods-types'

type Inputs = ReposCreateReleaseParams;

export function getInputs(): Inputs {
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
