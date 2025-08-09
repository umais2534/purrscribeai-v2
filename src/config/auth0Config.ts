export const auth0Config = {
  domain: "dev-jtiaaa6as2dvrknq.us.auth0.com", // e.g., dev-xyz123.us.auth0.com
  clientId: "i4w42sHzZgHE3J1x3aXP46P9tn67aCAe",
   redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI || "http://localhost:5173/dashboard",
  audience: "", // optional
};
