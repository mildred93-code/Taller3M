const bcrypt = require("bcryptjs");
const UserRepositoryAdapter = require("../infrastructure/userRepositoryAdapter");

class UserService {
  constructor() {
    this.userRepository = new UserRepositoryAdapter();
  }

  async getUsers() {
    return await this.userRepository.findAll();
  }

  async registerUser(nombre, email, password) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 409, msg: "El correo ya está registrado" };
    }

    // Encriptar la contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await this.userRepository.save(nombre, email, hashedPassword);
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw { status: 400, msg: "Correo o contraseña incorrectos" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw { status: 400, msg: "Correo o contraseña incorrectos" };
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id, nombre, email, password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return await this.userRepository.update(id, nombre, email, hashedPassword);
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }
}

module.exports = UserService;