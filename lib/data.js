/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for module to be exported
const lib = {
  baseDir: path.join(__dirname, '/../.data/'),

  // Write data to a file
  create: (dir, fileName, data, callback) => {
    fs.open(`${lib.baseDir}${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to a string
        const stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing new file');
              }
            });
          } else {
            callback('Error writing to a new file');
          }
        });
      } else {
        callback('Could not create a new file');
      }
    });
  },

  // Read data from a file
  read: (dir, fileName, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${fileName}.json`, 'utf8', (err, data) => {
      callback(err, data);
    });
  },

  // Update data in a file
  update: (dir, fileName, data, callback) => {
    fs.open(`${lib.baseDir}${dir}/${fileName}.json`, 'r+', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to a string
        const stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error closing existing file');
                  }
                });
              } else {
                callback('Error writing to an existing file');
              }
            });
          } else {
            callback('Error truncating a file');
          }
        });
      } else {
        callback('Could not open file for updating, it may not exist yet');
      }
    });
  },

  // Delete a file
  delete: (dir, fileName, callback) => {
    // Unlink the file
    fs.unlink(`${lib.baseDir}${dir}/${fileName}.json`, (err) => {
      if (!err) {
        callback(false);
      } else {
        callback('Error deleting file');
      }
    });
  }
};

// Export module
module.exports = lib;