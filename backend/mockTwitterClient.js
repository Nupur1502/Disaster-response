// mockTwitterClient.js

function fetchMockTweets(disasterId) {
  return [
    {
      user: "citizen1",
      post: "Volunteers needed in Mumbai for rescue ops.",
      timestamp: new Date().toISOString(),
      disaster_id: disasterId,
    },
    {
      user: "volunteerX",
      post: "Need food in Mumbai due to flood.",
      timestamp: new Date().toISOString(),
      disaster_id: disasterId,
    },
  ];
}

module.exports = { fetchMockTweets };

