import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCol-rgOTcjnPF49U3XtajROsWWy-N_1Us",
  authDomain: "thriftswift-b2ea2.firebaseapp.com",
  projectId: "thriftswift-b2ea2",
  storageBucket: "thriftswift-b2ea2.appspot.com",
  messagingSenderId: "1009646846800",
  appId: "1:1009646846800:web:626f83dad8a70df81fa255",
  measurementId: "G-BZG44B95S2"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

console.log(database);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.command === "fetch") {
    const domain = msg.data.domain;
    const enc_domain = btoa(domain);
    const domainRef = ref(database, `/domain/${enc_domain}`);

    console.log('check', domain,enc_domain);

    get(domainRef).then((snapshot) => {
      response({
        type: "result",
        status: "success",
        data: snapshot.val(),
        request: msg,
      });
    });
  }

  // Submit coupon data
  if (msg.command === "post") {
    const domain = msg.data.domain;
    const enc_domain = btoa(domain);
    const code = msg.data.code;
    const desc = msg.data.desc;

    try {
      const newPostRef = push(ref(database, `/domain/${enc_domain}`));
      set(newPostRef, {
        code: code,
        description: desc,
      });

      const postId = newPostRef.key;
      response({
        type: "result",
        status: "success",
        data: postId,
        request: msg,
      });
    } catch (e) {
      console.error("error:", e);
      response({ type: "result", status: "error", data: e, request: msg });
    }
  }

  return true;
});