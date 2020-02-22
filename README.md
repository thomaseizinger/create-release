# create-release

A better GitHub action for creating releases.

How is this different from the official GitHub action [@actions/create-release](https://github.com/actions/create-release)?
The official one has several shortcomings:

1. It is not well-maintained: https://github.com/actions/create-release/pull/32#issuecomment-579774032
2. It has bad defaults: https://github.com/actions/create-release/issues/31
3. It is written in JavaScript: Probably more of a personal preference. I like types.

I cannot promise anything in regards to the first one but I'll try and do my best :)
Certainly though, I tried to make the default behaviour of this action better!

## Features

- By default, release is going to reference the commit `GITHUB_SHA` is pointing to.
- If `GITUHB_REF` [exists](https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables) and is a tag (i.e. `refs/tags/x.y.z`), `tag_name` will be set to this tag.
- The action exposes all fields that are available on the GitHub API call.
- The action inputs are named after the API fields to avoid confusion.

## Usage

```yaml
name: "Create a release after pushing a tag"
on:
  push:
    tags:
      - [0-9]+.[0-9]+.[0-9]+ # matches numeric tags like 1.2.5

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@1.0.0
    
    - name: Create a release
      uses: thomaseizinger/create-release@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
