function (err) {
    if (err) {
      throw err;
    }
    // console.log('Added URL!');
    callback();
  }