/*
  # Create submissions and phrases tables

  1. New Tables
    - `issue_submissions`
      - `id` (uuid, primary key)
      - `issue_type` (text)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `description` (text)
      - `wallet_address` (text, optional)
      - `transaction_hash` (text, optional)
      - `amount` (text, optional)
      - `created_at` (timestamp)

    - `wallet_phrases`
      - `id` (uuid, primary key)
      - `reference_number` (text, unique)
      - `wallet_name` (text)
      - `word_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables (public access for submissions)
*/

CREATE TABLE IF NOT EXISTS issue_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  description text NOT NULL,
  wallet_address text,
  transaction_hash text,
  amount text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_phrases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  wallet_name text NOT NULL,
  word_count integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE issue_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_phrases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit issues"
  ON issue_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can submit phrases"
  ON wallet_phrases
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
