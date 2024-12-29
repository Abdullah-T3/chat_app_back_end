class User {
    constructor(id, email, password, first_name, last_name, created_at) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.first_name = first_name;
      this.last_name = last_name;
      this.created_at = created_at;
    }
  }
  module.exports = User;
  