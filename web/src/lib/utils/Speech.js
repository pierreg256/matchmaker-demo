import API from "./API";

class SpeechService {
  fetchSentence(text, cb) {
    // 1 - get token
    API.fetchSpeechToken((err, token) => {
      if (token) {
        const url =
          "https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1";
        const body = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female'
          name = 'en-US-JessaRUS' >
              ${text}
</voice ></speak >`;
        const options = {
          method: "POST",
          body,
          headers: new Headers({
            "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
            "Content-Type": "application/ssml+xml",
            Authorization: `Bearer ${token}`
          })
        };
        fetch(url, options)
          .then(result => {
            if (result.ok) return result.blob();
          })
          .then(blob => {
            console.log(blob);
            cb(null, blob);
          })
          .catch(e => cb(e));
      }
      if (err) {
        console.log("error:", err);
        cb(err);
      }
    });
  }
}

const Speech = new SpeechService();
export default Speech;
