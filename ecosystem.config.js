module.exports = {
  apps: [
    {
      name: 'voditsa',
      exec_mode: 'cluster',
      instances: '2',
      max_memory_restart: '300M',
      cwd: '/root/voditsa.by',
      script: 'node_modules/nuxt/bin/nuxt.js',
      // script: 'node_modules/nuxt-start/bin/nuxt-start.js',
      args: 'start',
      env: {
        "PORT": "3000",
        "NODE_ENV": "production",
        "SITE_URL": "https://voditsa.by",
      }
    }
  ]
}
