import { morph } from "mock-env";
import { getInputs } from "../src/getInputs";

const MANDATORY_INPUTS = {
  GITHUB_REPOSITORY: "foo/bar",
  GITHUB_REF: "refs/tags/1.2.5",
  GITHUB_SHA: "79bafdf08707fbc63c74ff5df5eed1ee15157d64"
};

it("should extract defaults from env vars", function() {
  const inputs = morph(getInputs, MANDATORY_INPUTS);

  expect(inputs).toHaveProperty("owner", "foo");
  expect(inputs).toHaveProperty("repo", "bar");
  expect(inputs).toHaveProperty("tag_name", "1.2.5");
  expect(inputs).toHaveProperty(
    "target_commitish",
    "79bafdf08707fbc63c74ff5df5eed1ee15157d64"
  );
});

it("should require tag_name to be set if GITHUB_REF is missing", function() {
  expect(() =>
    morph(getInputs, {
      ...MANDATORY_INPUTS,
      GITHUB_REF: "refs/heads/dev"
    })
  ).toThrowError("Input required and not supplied: tag_name");
});

it("should require tag_name to be set if GITHUB_REF is not a tag", function() {
  expect(() =>
    morph(getInputs, {
      GITHUB_REPOSITORY: "foo/bar",
      GITHUB_SHA: "79bafdf08707fbc63c74ff5df5eed1ee15157d64"
    })
  ).toThrowError("Input required and not supplied: tag_name");
});

it('should parse "false" for prerelease as false', function() {
  const inputs = morph(getInputs, {
    ...MANDATORY_INPUTS,
    INPUT_PRERELEASE: "false"
  });

  expect(inputs).toHaveProperty("prerelease", false);
});

it('should parse "true" for prerelease as true', function() {
  const inputs = morph(getInputs, {
    ...MANDATORY_INPUTS,
    INPUT_PRERELEASE: "true"
  });

  expect(inputs).toHaveProperty("prerelease", true);
});

it("should include body if given", function() {
  const inputs = morph(getInputs, {
    ...MANDATORY_INPUTS,
    INPUT_BODY: "This is a very exciting release!"
  });

  expect(inputs).toHaveProperty("body", "This is a very exciting release!");
});

it("should allow to override target_commitish", function() {
  const inputs = morph(getInputs, {
    ...MANDATORY_INPUTS,
    INPUT_TARGET_COMMITISH: "9d9db5e79961731f4e1dfcbe758340e1aa6edb0e"
  });

  expect(inputs).toHaveProperty(
    "target_commitish",
    "9d9db5e79961731f4e1dfcbe758340e1aa6edb0e"
  );
});
