import bcrypt from "bcrypt";

export default (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, function (err, hash: string) {
      if (err) return reject(err);
      resolve(hash);
    });
  });
};