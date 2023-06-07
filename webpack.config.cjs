import Dotenv from 'dotenv-webpack';

module.exports = {
    output: {
        hashFunction: "xxhash64"
    },
    plugins: [
        new Dotenv()
      ]
};