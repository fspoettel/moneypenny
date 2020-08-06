CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE member;

CREATE TABLE member (
  id uuid DEFAULT uuid_generate_v4(),
  email varchar(320) UNIQUE,
  password varchar(60),
  PRIMARY KEY (id)
);
