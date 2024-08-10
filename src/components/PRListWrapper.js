// src/components/PRListWrapper.js
'use client';

import { useState, useEffect } from 'react';
import PRList from './PRList';

export default function PRListWrapper({ initialRepos }) {
  const [repos, setRepos] = useState(initialRepos);

  useEffect(() => {
    setRepos(initialRepos);
  }, [initialRepos]);

  return <PRList repos={repos} />;
}
