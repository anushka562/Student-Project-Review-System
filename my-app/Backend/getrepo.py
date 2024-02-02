from flask import Flask, request, jsonify
from github import Github
import re

app = Flask(__name__)

@app.route('/get_commits', methods=['POST'])
def get_github_commits():
    # Get the GitHub repository URL from the request
    repo_url = request.form['repo_url']
    print(repo_url)

    if not repo_url:
        return jsonify({"error": "Missing 'repo_url' in the request"}), 400

    # Extract the owner and repository name from the URL
    match = re.match(r"https://github\.com/([^/]+)/([^/]+)", repo_url)

    
    if not match:
        return jsonify({"error": "Invalid GitHub repository URL format"}), 400

    owner = match.group(1)
    repo_name = match.group(2)

    print(owner, repo_name)

    # Retrieve the GitHub personal access token from an environment variable
    access_token = "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"

    if not access_token:
        return jsonify({"error": "GitHub personal access token not found"}), 500

    # Create a Github instance and authenticate using the personal access token
    g = Github(access_token)

    print("hell")

    try:
        # Get the repository
        print("he")
        repo = g.get_repo(f"{owner}/{repo_name}")
        print(repo)

        # List all commits in the repository
        commits = repo.get_commits()
        

        # Extract commit information
        commit_list = [{'sha': commit.sha, 'message': commit.commit.message} for commit in commits]
        print(commit_list)
        return jsonify({"commits": commit_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
