# Build

Quanta uses **Clang++** across all platforms.

## Windows

Install LLVM (Clang + LLD) from LLVM releases:

https://github.com/llvm/llvm-project/releases

After installation, make sure LLVM is available in `PATH`, then verify:

```bash
clang++ --version
```

Build using the project script:

```bash
git clone https://github.com/solarbrowser/quanta
cd quanta
build-windows.bat
```

## Linux

Install Clang and LLD:

```bash
# Ubuntu/Debian
sudo apt install clang lld

# Fedora
sudo dnf install clang lld

# Arch
sudo pacman -S clang lld
```

Build using the project script:

```bash
git clone https://github.com/solarbrowser/quanta
cd quanta
./build.sh
```

## macOS

Install command line tools:

```bash
xcode-select --install
```

Build using the project script:

```bash
git clone https://github.com/solarbrowser/quanta
cd quanta
./build.sh
```

## Build Outputs

- **Windows:** `build/bin/quanta.exe`
- **Linux/macOS:** `build/bin/quanta`
- **Static Library:** `build/libquanta.a`
- **Logs:** `build/build.log`, `build/errors.log`

## Usage

```bash
# Run a JavaScript file
./build/bin/quanta example.js

# Start REPL
./build/bin/quanta
```

## Troubleshooting

### Clang not found

- **Windows:** Ensure LLVM is in `PATH`, then restart your terminal.
- **Linux:** Install `clang` and `lld`.

### Build errors

Delete the `build/` directory and rebuild with the scripts.

Check:

`build/errors.log`
