const axios = require("axios");

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const TEXT_FILE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".yml",
  ".yaml",
  ".md",
  ".txt",
  ".env",
  ".py",
  ".java",
  ".go",
  ".rb",
  ".php",
  ".c",
  ".h",
  ".cpp",
  ".hpp",
  ".cs",
  ".sql",
  ".xml",
  ".sh",
  ".bat",
  ".ps1",
]);

function isLikelyTextFile(fileName) {
  const lower = fileName.toLowerCase();

  if (lower.includes(".")) {
    const ext = lower.slice(lower.lastIndexOf("."));
    return TEXT_FILE_EXTENSIONS.has(ext);
  }

  return ["dockerfile", "makefile", "readme"].some((name) => lower.includes(name));
}

function buildHeaders(includeAuth = true) {
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "ai-cicd-security-analyzer",
  };

  if (includeAuth && process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function ensureRepositoryExists(repo) {
  const [owner, name] = repo.split("/");

  if (!owner || !name) {
    const error = new Error("Invalid repository format");
    error.statusCode = 400;
    error.publicMessage = "Invalid repository format. Use owner/repo";
    throw error;
  }

  try {
    const query = `
      query {
        repository(owner: "${owner}", name: "${name}") {
          id
          nameWithOwner
        }
      }
    `;

    const response = await axios.post(
      GITHUB_GRAPHQL_URL,
      { query },
      {
        headers: buildHeaders(),
        timeout: 15000,
      }
    );

    if (response.data.errors?.length) {
      const errorMsg = response.data.errors[0]?.message || "GraphQL error";

      if (errorMsg.includes("Could not resolve to a Repository") || errorMsg.includes("not found")) {
        const notFound = new Error("GitHub repository not found");
        notFound.statusCode = 404;
        notFound.publicMessage = "Repository not found on GitHub";
        throw notFound;
      }

      const graphqlError = new Error(errorMsg);
      graphqlError.statusCode = 400;
      graphqlError.publicMessage = errorMsg;
      throw graphqlError;
    }

    if (!response.data.data?.repository) {
      const error = new Error("Repository not accessible");
      error.statusCode = 404;
      error.publicMessage = "Repository not found or not accessible";
      throw error;
    }

    return true;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      try {
        // Fallback to public REST endpoint. This still validates public repositories
        // even when a GitHub token is invalid, expired, or rate-limited.
        const restResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}`, {
          headers: buildHeaders(false),
          timeout: 15000,
        });

        if (restResponse.status === 200) {
          return true;
        }
      } catch (fallbackError) {
        const fallbackStatus = fallbackError?.response?.status;
        if (fallbackStatus === 404) {
          const notFound = new Error("GitHub repository not found");
          notFound.statusCode = 404;
          notFound.publicMessage = "Repository not found on GitHub";
          throw notFound;
        }
      }

      const accessError = new Error("GitHub access denied");
      accessError.statusCode = 403;
      accessError.publicMessage = "GitHub API access denied or rate-limited. Check GITHUB_TOKEN.";
      throw accessError;
    }

    if (error.statusCode) {
      throw error;
    }

    const unknown = new Error(`GitHub repository check failed: ${error.message}`);
    unknown.statusCode = 502;
    unknown.publicMessage = "Failed to verify repository on GitHub";
    throw unknown;
  }
}

async function fetchRepoCode(repo) {
  const [owner, name] = repo.split("/");

  try {
    // GraphQL query to fetch default branch repository object entries recursively
    // This gets all files in one efficient query instead of hundreds of REST API calls
    const query = `
      query {
        repository(owner: "${owner}", name: "${name}") {
          defaultBranchRef {
            target {
              ... on Commit {
                tree {
                  entries {
                    name
                    type
                    object {
                      ... on Blob {
                        byteSize
                        text
                      }
                      ... on Tree {
                        entries {
                          name
                          type
                          object {
                            ... on Blob {
                              byteSize
                              text
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      GITHUB_GRAPHQL_URL,
      { query },
      {
        headers: buildHeaders(),
        timeout: 30000,
      }
    );

    if (response.data.errors) {
      const errorMsg = response.data.errors[0]?.message || "GraphQL error";
      
      if (errorMsg.includes("not exist") || errorMsg.includes("not found")) {
        const notFound = new Error("GitHub repository not found");
        notFound.statusCode = 404;
        notFound.publicMessage = "Repository not found";
        throw notFound;
      }

      const graphqlError = new Error(errorMsg);
      graphqlError.statusCode = 400;
      graphqlError.publicMessage = errorMsg;
      throw graphqlError;
    }

    const repoData = response.data.data?.repository;

    if (!repoData) {
      const error = new Error("Repository not accessible");
      error.statusCode = 404;
      error.publicMessage = "Repository not found or not accessible";
      throw error;
    }

    const defaultBranch = repoData.defaultBranchRef;

    if (!defaultBranch) {
      const error = new Error("Repository has no default branch");
      error.statusCode = 400;
      error.publicMessage = "Repository appears to be empty";
      throw error;
    }

    const rootEntries = defaultBranch.target?.tree?.entries || [];

    const allFiles = [];

    // Process root entries
    for (const entry of rootEntries) {
      if (entry.type === "blob" && entry.object?.text && isLikelyTextFile(entry.name)) {
        // Skip large files (>1MB)
        if (entry.object.byteSize > 1048576) {
          console.warn(`[GITHUB] Skipping large file ${entry.name}: ${entry.object.byteSize} bytes`);
          continue;
        }

        allFiles.push({
          path: entry.name,
          content: entry.object.text,
        });
      } else if (entry.type === "tree") {
        // Process files in subdirectories
        const subEntries = entry.object?.entries || [];
        for (const subEntry of subEntries) {
          if (
            subEntry.type === "blob" &&
            subEntry.object?.text &&
            isLikelyTextFile(subEntry.name)
          ) {
            // Skip large files
            if (subEntry.object.byteSize > 1048576) {
              console.warn(
                `[GITHUB] Skipping large file ${entry.name}/${subEntry.name}: ${subEntry.object.byteSize} bytes`
              );
              continue;
            }

            allFiles.push({
              path: `${entry.name}/${subEntry.name}`,
              content: subEntry.object.text,
            });
          }
        }
      }
    }

    if (!allFiles.length) {
      const error = new Error("No text-based files found in repository");
      error.statusCode = 400;
      error.publicMessage = "No scannable text files found in repository";
      throw error;
    }

    const combinedCode = allFiles
      .map((file) => `/* FILE: ${file.path} */\n${file.content}`)
      .join("\n\n");

    if (!combinedCode.trim()) {
      const error = new Error("Repository content is empty after parsing");
      error.statusCode = 400;
      error.publicMessage = "Repository appears to have no readable text content";
      throw error;
    }

    return {
      combinedCode,
      fileCount: allFiles.length,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const unknown = new Error(`GitHub fetch failed: ${error.message}`);
    unknown.statusCode = 502;
    unknown.publicMessage = "Failed to fetch repository from GitHub";
    throw unknown;
  }
}

module.exports = {
  ensureRepositoryExists,
  fetchRepoCode,
};
