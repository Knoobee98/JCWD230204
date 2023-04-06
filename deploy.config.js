module.exports = {
  apps: [
    {
      name: "JCWD-2302-04", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8305,
      },
      time: true,
    },
  ],
};
