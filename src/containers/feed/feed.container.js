import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import get from 'lodash.get';

import FeedTypes from '../../containers/feed/feed.redux';
import Card from '../../components/card';
import Button from '../../components/button';
import TweetFeed from '../../components/tweet-feed';

const Wrapper = styled.div`
  margin: 4rem auto;
  max-width 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  margin: 0 auto;
`;

const API_URL = 'http://localhost:5000/api/rules';

function Feed({
  connectToTwitter,
  connectionEstablished,
  connectionError,
  setRule,
  setRuleSuccess,
  setRuleError,
  pushTweet,
  donaldTweets,
  hillaryTweets,
  toggleFeedType,
  onDonaldFeed
}) {
  // create stream rules via the twitter API
  useEffect(() => {
    const createRules = async (params) => {
      // first check if we have any twitter stream rules created
      try {
        const res = await axios.get(API_URL);
        if (get(res, ['data', 'body', 'data'])) {
          // we have rules already, set them in our redux store and return early
          res.data.body.data.forEach((item) => {
            setRuleSuccess(item);
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
      try {
        for (const param of params) {
          setRule();
          const payload = {
            add: [{ value: param }]
          };
          const { data } = await axios.post(API_URL, payload);
          if (data.body.errors) {
            throw new Error(data.body.errors[0].title);
          }
          const rule = get(data, ['body', 'data', [0]]);
          setRuleSuccess(rule);
        }
      } catch (error) {
        console.log(error);
        setRuleError(error);
      }
    };
    createRules(['Donald Trump', 'Hillary Clinton']);
  }, [setRule, setRuleSuccess, setRuleError]);

  // start the tweet stream
  useEffect(() => {
    const streamTweets = () => {
      const socket = socketIOClient('http://localhost:5000/');
      connectToTwitter();
      socket.on('connect', () => {
        connectionEstablished();
      });
      socket.on('tweet', (json) => {
        if (json.data) {
          pushTweet(json);
        }
      });
      socket.on('error', (data) => {
        console.log('error', data);
        connectionError();
      });
      socket.on('authError', (data) => {
        console.log('auth error', data);
        connectionError();
      });
    };
    streamTweets();
  }, [connectToTwitter, connectionEstablished, connectionError, pushTweet]);

  return (
    <Wrapper>
      <h1>Twitter Feed</h1>
      <Card>
        <TweetFeed
          title={onDonaldFeed ? 'Donald Trump' : 'Hillary Clinton'}
          tweets={onDonaldFeed ? donaldTweets : hillaryTweets}
        />
      </Card>
      <ButtonWrapper>
        <Button onClick={toggleFeedType}>
          {onDonaldFeed ? 'View Hillary Feed' : 'View Trump Feed'}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRule: () => dispatch(FeedTypes.setRule()),
    setRuleSuccess: (rule) => dispatch(FeedTypes.setRuleSuccess(rule)),
    setRuleError: (error) => dispatch(FeedTypes.setRuleError(error)),
    connectToTwitter: () => dispatch(FeedTypes.connectToTwitter()),
    connectionEstablished: () => dispatch(FeedTypes.connectionEstablished()),
    connectionError: () => dispatch(FeedTypes.connectionError()),
    pushTweet: (tweet) => dispatch(FeedTypes.pushTweet(tweet)),
    toggleFeedType: () => dispatch(FeedTypes.toggleFeedType())
  };
};

const mapStateToProps = (state) => ({
  onDonaldFeed: state.feed.onDonaldFeed,
  donaldTweets: state.feed.donaldTweets,
  hillaryTweets: state.feed.hillaryTweets
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
