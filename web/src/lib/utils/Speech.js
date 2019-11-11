import API from "./API";

class SpeechService {
  fetchSentence(text) {
    // 1 - get token
    API.fetchSpeechToken((err, token) => {
      if (token) {
        const url =
          "https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1";
        const options = {
          method: "POST",
          headers: new Headers({
            "X-Microsoft-OutputFormat": "raw-16khz-16bit-mono-pcm",
            "Content-Type": "application/ssml+xml",
            Authorization: `Bearer${token}`
          })
        };
        fetch(url, options)
          .then(result => console.log(result))
          .catch(e => console.log(e));
      }
    });
  }
}

const Speech = new SpeechService();
export default Speech;
