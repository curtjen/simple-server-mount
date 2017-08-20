# Server Mount
This is a CLI tool for mounting remote directories to your local machine.

## Installation
1. Install SSHFS: [https://github.com/libfuse/sshfs](https://github.com/libfuse/sshfs) (for MacOSX: [https://osxfuse.github.io/](https://osxfuse.github.io/))
0. Run the following in your terminal:
```
npm install -g https://github.com/curtjen/server-mount
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