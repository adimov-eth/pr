'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AnalysisPage = () => {
  const params = useParams();
  const { id } = params;
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('pull_requests')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setAnalysis(data);
        } catch (err) {
          setError('Failed to fetch analysis result');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analysis) return <div>No analysis found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Analysis Result</h1>
      <div className="shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            PR #{analysis.pr_number} - {analysis.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Repository: {analysis.repo_name}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Author</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {analysis.author}
              </dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created at</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(analysis.created_at).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Analysis Result</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <pre className="whitespace-pre-wrap">{analysis.analysis_result}</pre>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;