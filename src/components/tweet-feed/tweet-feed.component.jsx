import styled from 'styled-components';

const FeedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ListWrapper = styled.ul`
  text-align: left;
  list-style: none;
`;

const Tweet = styled.li`
  padding: 1rem;
`;

function TweetFeed({ title, tweets }) {
  return (
    <FeedWrapper>
      <h1>{title}</h1>
      <ListWrapper>
        {tweets &&
          tweets.map((tweet, index) => {
            return <Tweet key={index}>{tweet.data.text}</Tweet>;
          })}
      </ListWrapper>
    </FeedWrapper>
  );
}

export default TweetFeed;
