import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscription from '../app/models/Subscription';

import databaseConfig from '../config/database';

const models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // this.connection.sync({ force: true }); // => makes all migration run again REMOVING PREVIOUS DATABASE DATA
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
