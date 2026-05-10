import { AbstractRepositoryAdapter, CommitFile } from '@quatrain/code'
import { Octokit } from '@octokit/rest'

/**
 * Repository integration logic specifically adapting GitHub via the official Octokit SDK.
 */
export class GithubAdapter extends AbstractRepositoryAdapter {
   protected _octokit: Octokit
   protected _owner: string
   protected _repo: string

   constructor(auth: string, owner: string, repo: string) {
      super()
      this._octokit = new Octokit({ auth })
      this._owner = owner
      this._repo = repo
   }

   /**
    * Fetches the latest reference for a specific branch from GitHub.
    * 
    * @param branch - The branch name to pull.
    */
   async pull(branch: string = 'main'): Promise<void> {
      // In a real implementation, this would fetch latest refs
      // Since this adapter is primarily to push changes from Studio, pull might be a no-op or fetch ref.
      await this._octokit.repos.get({
         owner: this._owner,
         repo: this._repo,
      })
   }

   /**
    * Commits and pushes a set of files to a specified GitHub branch.
    * 
    * @param files - List of files to commit.
    * @param message - The commit message.
    * @param branch - The target branch name.
    */
   async push(files: CommitFile[], message: string, branch: string = 'main'): Promise<void> {
      // 1. Get latest commit SHA for branch
      const { data: refData } = await this._octokit.git.getRef({
         owner: this._owner,
         repo: this._repo,
         ref: `heads/${branch}`,
      })
      const commitSha = refData.object.sha

      // 2. Get commit tree
      const { data: commitData } = await this._octokit.git.getCommit({
         owner: this._owner,
         repo: this._repo,
         commit_sha: commitSha,
      })
      const baseTreeSha = commitData.tree.sha

      // 3. Create blobs and tree array
      const tree = await Promise.all(
         files.map(async (file) => {
            const { data: blobData } = await this._octokit.git.createBlob({
               owner: this._owner,
               repo: this._repo,
               content: file.content,
               encoding: 'utf-8',
            })

            return {
               path: file.path,
               mode: '100644' as const,
               type: 'blob' as const,
               sha: blobData.sha,
            }
         })
      )

      // 4. Create new tree
      const { data: treeData } = await this._octokit.git.createTree({
         owner: this._owner,
         repo: this._repo,
         tree,
         base_tree: baseTreeSha,
      })

      // 5. Create new commit
      const { data: newCommitData } = await this._octokit.git.createCommit({
         owner: this._owner,
         repo: this._repo,
         message,
         tree: treeData.sha,
         parents: [commitSha],
      })

      // 6. Update ref
      await this._octokit.git.updateRef({
         owner: this._owner,
         repo: this._repo,
         ref: `heads/${branch}`,
         sha: newCommitData.sha,
      })
   }

   /**
    * Creates a new branch via the GitHub API based on an existing branch's latest commit.
    * 
    * @param branchName - The new branch name.
    * @param fromBranch - The source branch name.
    */
   async createBranch(branchName: string, fromBranch: string = 'main'): Promise<void> {
      const { data: refData } = await this._octokit.git.getRef({
         owner: this._owner,
         repo: this._repo,
         ref: `heads/${fromBranch}`,
      })

      await this._octokit.git.createRef({
         owner: this._owner,
         repo: this._repo,
         ref: `refs/heads/${branchName}`,
         sha: refData.object.sha,
      })
   }
}
