CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

INSERT INTO
  blogs (author, url, title)
values
  (
    'Dan Abramov',
    'https://overreacted.io/on-let-vs-const/',
    'On let vs const'
  );

INSERT INTO
  blogs (author, url, title)
values
  (
    'Laurenz Albe',
    'https://www.cybertec-postgresql.com/en/gaps-in-sequences-postgresql/',
    'Gaps in sequences in PostgreSQL'
  );
