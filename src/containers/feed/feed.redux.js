import { createReducer, createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    connectToTwitter: null,
    connectionEstablished: null,
    connectionError: ['error'],
    toggleFeedType: null,
    setRule: null,
    setRuleSuccess: ['rule'],
    setRuleError: ['error'],
    pushTweet: ['tweet'],
    pushDonaldTweet: ['tweet'],
    pushHillaryTweet: ['tweet']
  },
  { prefix: '[feed] ' }
);

export const FeedTypes = Types;
export default Creators;

export const INITIAL_STATE = {
  isConnecting: false,
  isConnectionEstablished: false,
  connectionError: false,
  settingRule: false,
  settingRuleSuccess: false,
  settingRuleError: null,
  onDonaldFeed: true,
  rules: [],
  donaldTweets: [],
  hillaryTweets: []
};

const connectToTwitter = (state) => ({
  ...state,
  isConnecting: true
});

const connectionEstablished = (state) => ({
  ...state,
  isConnecting: false,
  isConnectionEstablished: true
});

const connectionError = (state, { error }) => ({
  ...state,
  isConnecting: false,
  isConnectionEstablished: false,
  connectionError: error
});

const toggleFeedType = (state) => ({
  ...state,
  onDonaldFeed: !state.onDonaldFeed
});

const setRule = (state) => ({
  ...state,
  settingRule: true,
  settingRuleSuccess: false,
  settingRuleError: null
});

const setRuleSuccess = (state, { rule }) => ({
  ...state,
  settingRule: false,
  settingRuleSuccess: true,
  settingRuleError: null,
  rules: [...state.rules, rule]
});

const setRuleError = (state, { error }) => ({
  ...state,
  settingRule: false,
  settingRuleSuccess: false,
  settingRuleError: error
});

const pushDonaldTweet = (state, { tweet }) => ({
  ...state,
  donaldTweets: [tweet, ...state.donaldTweets]
});

const pushHillaryTweet = (state, { tweet }) => ({
  ...state,
  hillaryTweets: [tweet, ...state.hillaryTweets]
});

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONNECT_TO_TWITTER]: connectToTwitter,
  [Types.CONNECTION_ESTABLISHED]: connectionEstablished,
  [Types.CONNECTION_ERROR]: connectionError,
  [Types.TOGGLE_FEED_TYPE]: toggleFeedType,
  [Types.SET_RULE]: setRule,
  [Types.SET_RULE_SUCCESS]: setRuleSuccess,
  [Types.SET_RULE_ERROR]: setRuleError,
  [Types.PUSH_TWEET]: null,
  [Types.PUSH_DONALD_TWEET]: pushDonaldTweet,
  [Types.PUSH_HILLARY_TWEET]: pushHillaryTweet
});
