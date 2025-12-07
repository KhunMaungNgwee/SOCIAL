import * as newfeed from "./newfeed";
import * as post from "./post";
import * as profile from "./profile";
import * as auth from "./auth";
class API {
  newfeed: typeof newfeed;
  post: typeof post;
  profile: typeof profile;
  auth : typeof auth;

  constructor() {
    this.newfeed = newfeed;
    this.post = post;
    this.profile = profile;
    this.auth = auth

  }
}

const api = new API();
export default api;
