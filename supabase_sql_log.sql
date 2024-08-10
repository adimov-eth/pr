CREATE TABLE pull_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  repo_name TEXT,
  pr_number INT,
  title TEXT,
  description TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  analysis_result JSONB
);

CREATE INDEX idx_repo_name ON pull_requests(repo_name);
CREATE INDEX idx_pr_number ON pull_requests(pr_number);
CREATE INDEX idx_created_at ON pull_requests(created_at);

CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  github_username TEXT UNIQUE,
  analysis_credits INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own data
CREATE POLICY "Users can only access their own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, github_username)
  VALUES (new.id, new.raw_user_meta_data->>'user_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();