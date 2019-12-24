module.exports = {
  getSession: () => {
    let rightNow = new Date();
    let session = 0;
    let hour = rightNow.getHours();
    let mins = rightNow.getMinutes();
    switch (hour) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        session = 0;
        break;
      case 9:
        if (mins == 15) {
          session = 1;
        }
        if (mins > 15) {
          session = 2;
        }
        break;
      case 10:
        session = 2;
        break;
      case 11:
        if (mins <= 30) {
          session = 2;
        }
        break;
      case 13:
        session = 2;
        break;
      case 14:
        if (mins <= 30) {
          session = 2;
        }
        if (mins == 45) {
          session = 3;
        }
        if (mins > 45) {
          session = 4;
        }
        break;
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
        session = 0;
        break;
      default:
        session = 0;
    }
    return session;
  },
};
