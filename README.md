# Server Mount
This is a CLI tool for mounting remote directories to your local machine.

## Installation
1. Install SSHFS: [https://github.com/libfuse/sshfs](https://github.com/libfuse/sshfs) (for MacOSX: [https://osxfuse.github.io/](https://osxfuse.github.io/))
0. Run the following in your terminal:
```
npm install -g https://github.com/curtjen/server-mount
```

## Configuration File
The default for the tool will use the file named `sm-config.json` located directly inside the same directory you are running the command from. However, you can provide a JSON file of your choosing. This configuration file will contain the settings needed to properly mount the directories to your computer.

In order for the tool to work properly, the config file needs to contain the following keys:
``` javascript
{
    "user": String,       // Remote server user
    "host": String,       // Remote server host
    "dirs": Array,        // Array of directories on the remote server you want to mount to your local machine
    "dir_path": String,   // Absolute path on your local machine
    "server_path": String // Absolute path on the remote server
}
```

e.g.
``` json
{
    "user": "pi",
    "host": "192.168.1.12",
    "dirs": [
        "Documents",
        "Pictures"
    ],
    "dir_path": "/User/johndoe/Development/pi2",
    "server_path": "/home/pi"
}
```

## Usage
There are several ways to use the tool: mount or unmount. Both require a `sm-config.json` file to perform their respective action. This config can either be in the same directory you're running the command in or via CLI argument.

- __Mount:__
    - (Default) Mount using `sm-config.json` in same directory you're running the command in:
        ```
        $ ssm
        ```
    - Mount using config file via CLI argument:
        e.g.
        ```
        $ ssm config=/User/johndoe/Documents/my-awesome-config.json
        ```
- __Unmount:__
    - (Default) Unmount using `sm-config.json` in same directory you're running the command in:
        ```
        $ ssm unmount
        ```
    - Unmount using config file via CLI argument:
        e.g.
        ```
        $ ssm config=/User/johndoe/Documents/my-awesome-config.json unmount
        ```