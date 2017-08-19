#!/usr/bin/env node
const fs  = require('fs');
const cmd = require('node-cmd');
const Promise = require('promise');

let config = {}; // Configuration settings to be set from process_args()
let isMounting = true;


/** process_args(args)
 * Splices an array of strings into usable options
 * @param {Array} args
 */
const process_args = (args) => {
    // I promise to return an array of objects
    return new Promise((resolve) => {
        let cli_args = [];
        // If more args than the defaults
        if (process.argv.length > 2) {
            process.argv.map((arg, index, arr) => {
                // Convert "key=value" to ['key', 'value']
                let argArr = arg.split('=');
                switch (argArr[0]) {
                    case 'unmount':
                        isMounting = false;
                        break;
                    case 'config':
                        isMounting = true;
                        config = JSON.parse(fs.readFileSync(argArr[1]));
                        break;
                    default:
                        break;
                }

                // Resolve the promise if done
                if (arr.length - index === 1) {
                    resolve();
                }
            });
        }
        else {
            isMounting = true;
            config = JSON.parse(fs.readFileSync('sm-config.json'));
            resolve();
        }
    });
};


/** create_dirs(dirs)
 * Create directories to be used as mount points.
 * @param {Array} dirs
 */
const create_dirs = (dirs) => {
    console.log('Create needed directories:');

    // I promise to return an array of mountable directories
    return new Promise((resolve) => {
        let  mountable_dirs = [];
        dirs.map((dir) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    // Create mount directories if missing
                    console.log(`Creating directory: ${dir} does not yet exist.`)
                    cmd.run(`mkdir ${config.dir_path}/${dir}`);
                }
                else {
                    console.log(`Skipping directory: ${dir} already exists.`);
                }
                mountable_dirs.push(dir);
                if ( mountable_dirs.length === dirs.length) {
                    resolve( mountable_dirs);
                }
            });
        });
    });
};


/** mount_dirs(dirs, host)
 * Mount to remote server with matching directories as mount points.
 * @param {Object} config
 * @param {Array} dirs
 */
const mount_dirs = (config, dirs) => {
    console.log('Mount to directories:');
    let c = config;
    dirs.map((dir) => {
        console.log(`Mounting to directory: ${dir}`);
        let opts = `auto_cache,defer_permissions,follow_symlinks,reconnect,noappledouble,allow_other,volname=${dir}`;
        let command = `sshfs ${c.user}@${c.host}:${c.server_path}/${dir} ${c.dir_path}/${dir} -o ${opts}`;
        cmd.get(command, (err, data, stderr) => {
            if (stderr) console.log(stderr);
        });
    });
    console.log('Mounting complete.');
};


/** remove_dirs(dirs)
 * Create directories to be used as mount points.
 * @param {Array} dirs
 */
const remove_dirs = (dirs) => {
    console.log('Remove old directories:');
    dirs.map((dir) => {
        fs.readdir(dir, (err, files) => {
            if (!err) {
                // Create mount directories if missing
                console.log(`Deleting directory: ${dir}`)
                cmd.run(`rm -r ${config.dir_path}/${dir}`);
            }
            else {
                console.log(`Skipping directory: ${dir} already removed.`);
            }
        });
    });
};


/** mount_dirs(dirs, host)
 * Mount to remote server with matching directories as mount points.
 * @param {Object} config
 * @param {Array} dirs
 */
const unmount_dirs = (config) => {
    let removable_dirs = [];
    // I promise to return an array of directories that can be removed
    return new Promise((resolve) => {
        let c = config;
        c.dirs.map((dir, index, arr) => {
            console.log(`Unmounting directory: ${dir}`);
            let command = `umount ${c.dir_path}/${dir}`;
            cmd.get(command, (err, data, stderr) => {
                if (!err && !stderr) {
                    removable_dirs.push(dir);
                    if (arr.length - index === 1) {
                        console.log('Unmounting complete.');
                        resolve(removable_dirs);
                    }
                }
            });
        });
    });
};


// RUN THE THINGS
process_args()
.then(() => {
    if (isMounting) {
        // Create the directories
        create_dirs(config.dirs)
        .then((resp_dirs) =>{
            // Mount to directories that were either just created or already existed
            mount_dirs(config, resp_dirs);
        });
    }
    else {
        // Unmount each mount point
        unmount_dirs(config)
        .then((resp_dirs) => {
            // Remove old directories
            remove_dirs(resp_dirs);
        });
    }
});