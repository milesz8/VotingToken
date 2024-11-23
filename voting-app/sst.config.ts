/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "voting-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { cloudflare: "5.43.1" },
    };
  },
  async run() {
    new sst.aws.Nextjs("VotingAppWeb", {
      domain: {
        name: "voting-app.milesmclenon.com",
        dns: sst.cloudflare.dns(),
      },
    });
  },
});
