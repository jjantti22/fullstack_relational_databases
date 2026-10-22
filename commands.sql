CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Author First', 'https://url.com/1', 'Title is here', 1);
insert into blogs (author, url, title, likes) values ('Sauthor Second', 'https://url.com/2', 'Second title', 4);
