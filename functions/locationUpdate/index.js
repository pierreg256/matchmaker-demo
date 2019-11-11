module.exports = async function(context, documents) {
  if (!!documents && documents.length > 0) {
    let messages = [];
    documents.forEach(document => {
      if (document.record_type === "user_location") {
        context.log(document);
        let actions = [];
        const friends = ["1", "2", "3"];
        friends.forEach(friendseq => {
          const friendId = `${document.login}-friend-${friendseq}`;
          context.log(document);
          const coords = {
            longitude:
              document.location.coordinates[0] + (Math.random() * 2 - 1) * 0.01,
            latitude:
              document.location.coordinates[1] + (Math.random() * 2 - 1) * 0.01
          };
          context.log(coords);
          messages.push({
            userId: document.login,
            target: "newMessage",
            arguments: [{ action: "new_friend", friendId, coords }]
          });
        });
      }
    });
    if (messages.length > 0) {
      context.bindings.signalRMessages = messages;
    }
  }
};
