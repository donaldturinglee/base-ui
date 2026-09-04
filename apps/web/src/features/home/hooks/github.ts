// Who the repository belongs to and what it is called. The page asks GitHub about the library in
// more than one place, and every one of them is asking about the same repository, so it is named
// here once rather than written into each request. An owner spelled out at every call site is an
// owner that has to be found again at every call site the day the repository changes hands, and
// one missed is a request that quietly goes on asking about somewhere the work no longer is
const owner = "gamecrafters-io";
const repo = "base-ui";

// Where the REST API is answered from
const host = "https://api.github.com";

// One endpoint, as a URL the reader's own browser can ask for.
//
// An endpoint is written the way `gh api` takes one, with the repository left as `{owner}` and
// `{repo}` rather than spelled out, and filled in here from the names above — which is what the
// command line does with the repository it is run in. See https://cli.github.com/manual/gh_api.
//
// Writing them that way leaves each endpoint reading as the path the API documents it under, so
// what is being asked for can be checked against the documentation without first being read apart
// from the repository it was spliced into. Anything the path carries beyond the placeholders, a
// query string among it, is left as it was written
export const endpoint = (path: string) =>
    `${host}/${path.replace(/\{owner\}/g, owner).replace(/\{repo\}/g, repo)}`;
