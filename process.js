module.exports = {
    apps : [{
      name   : "api-efrei",
      script : "./index.js",
      exec_mode : "cluster",
      instances : "9",
      watch : true
    }]
  }