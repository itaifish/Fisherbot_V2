module.exports = {
  apps : [
    {
      name: 'Fisherbot',
      script: 'index.js',
      cwd: './src',
      watch: true,
      ignore_watch: ['node_modules', 'logs']
    }
  ],
};
