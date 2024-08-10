import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const PRList = ({ repos }) => {
  const { data: session } = useSession();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [prs, setPRs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPRs = async (repoName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/prs?repo=${repoName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PRs');
      }
      const data = await response.json();
      setPRs(data);
      setSelectedRepo(repoName);
    } catch (error) {
      console.error('Error fetching PRs:', error);
      setError('Failed to fetch pull requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzePR = async (repoName, prNumber) => {
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoName, prNumber })
      });
      if (!response.ok) {
        throw new Error('Failed to analyze PR');
      }
      const data = await response.json();
      setPRs(prs.map(pr => 
        pr.number === prNumber ? { ...pr, analysis: data.analysisResult } : pr
      ));
    } catch (error) {
      console.error('Error analyzing PR:', error);
      setError('Failed to analyze pull request. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select a Repository</h2>
      <ul className="mb-8">
        {repos.map((repo) => (
          <li key={repo.id} className="mb-2">
            <button
              onClick={() => fetchPRs(repo.full_name)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {repo.name}
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {selectedRepo && (
        <div>
          <h3 className="text-xl font-bold mb-4">Pull Requests for {selectedRepo}</h3>
          {loading ? (
            <p>Loading PRs...</p>
          ) : (
            <ul>
              {prs.map((pr) => (
                <li key={pr.id} className="mb-4 p-4 border rounded">
                  <h4 className="font-bold">{pr.title}</h4>
                  <p>#{pr.number} opened by {pr.user.login}</p>
                  {pr.analysis ? (
                    <div className="mt-2">
                      <h5 className="font-bold">Analysis:</h5>
                      <p>{pr.analysis}</p>
                      <Link href={`/analysis/${pr.id}`} className="text-blue-500 hover:underline">
                        View full analysis
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => analyzePR(selectedRepo, pr.number)}
                      className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                    >
                      Analyze
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PRList;